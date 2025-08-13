import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, registerSchema, insertTranslationSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "textify_secret_change_me";

// Middleware to verify JWT token
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Register endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({ 
        token, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        token, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Translate endpoint
  app.get("/api/translate", async (req: Request, res: Response) => {
    try {
      const { text, source = "auto", target = "en" } = req.query;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text parameter is required" });
      }

      // Use external translation API (MyMemory)
      const encodedText = encodeURIComponent(text);
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${source}|${target}`
      );

      if (!response.ok) {
        return res.status(502).json({ error: "Translation service unavailable" });
      }

      const data = await response.json();
      const translatedText = data.responseData?.translatedText || "";

      res.json({
        text,
        translatedText,
        source: source === "auto" ? "en" : source, // Simplified auto-detection
        target,
      });
    } catch (error) {
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Save translation to history (authenticated)
  app.post("/api/translations", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const translation = insertTranslationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });

      const savedTranslation = await storage.saveTranslation(translation);
      res.status(201).json(savedTranslation);
    } catch (error) {
      res.status(400).json({ error: "Invalid translation data" });
    }
  });

  // Get user's translation history (authenticated)
  app.get("/api/translations", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const translations = await storage.getUserTranslations(req.user!.id);
      res.json(translations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  // Delete translation (authenticated)
  app.delete("/api/translations/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTranslation(id, req.user!.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  // Clear all user translations (authenticated)
  app.delete("/api/translations", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      await storage.clearUserTranslations(req.user!.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear translations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
