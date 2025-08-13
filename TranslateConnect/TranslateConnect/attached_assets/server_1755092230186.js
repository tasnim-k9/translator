// server.js - Textify backend with simple file-based auth and JWT
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { franc } from "franc";
import langs from "langs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const __dirname = path.resolve();
const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "textify_secret_change_me";

const app = express();
app.use(cors());
app.use(express.json());

// simple file storage helpers
function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) { console.error("loadUsers err", e); return []; }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// Simple in-memory cache for translations
const cache = new Map();

function toISO1(francCode){
  try{
    const info = langs.where("3", francCode);
    if(info && info['1']) return info['1'];
  }catch(e){}
  return null;
}

// Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing username or password" });
  const users = loadUsers();
  if (users.find(u => u.username === username)) return res.status(409).json({ error: "User exists" });
  const hashed = await bcrypt.hash(password, 8);
  const user = { id: uuidv4(), username, password: hashed, history: [] };
  users.push(user);
  saveUsers(users);
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: user.username });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing username or password" });
  const users = loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: user.username });
});

// Middleware to check token
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Translate endpoint; supports query ?text=...&source=...&target=...
app.get("/api/translate", async (req, res) => {
  try{
    let { text = "", source = "auto", target = "en" } = req.query;
    text = String(text || "").trim();
    target = String(target).slice(0,2).toLowerCase();
    if(!text) return res.status(400).json({ error: "Missing text" });

    // detect if source === auto
    if(source === "auto" || !source){
      const francCode = franc(text, {minLength:3});
      const iso1 = toISO1(francCode) || "en";
      source = iso1;
    } else {
      source = String(source).slice(0,2).toLowerCase();
    }
    if(source === target) return res.status(400).json({ error: "Source and target same" });

    const cacheKey = `${source}|${target}|${text}`;
    if(cache.has(cacheKey)){
      return res.json({ translatedText: cache.get(cacheKey), source, target, cached:true });
    }

    const q = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${source}|${target}`;
    const resp = await fetch(url);
    if(!resp.ok) return res.status(502).json({ error: "Translation API failure" });
    const j = await resp.json();
    let translated = (j && j.responseData && j.responseData.translatedText) || "";
    if(!translated && Array.isArray(j.matches) && j.matches.length>0){
      translated = j.matches[0].translation || "";
    }
    translated = translated.replace(/&quot;/g,'"').replace(/&amp;/g,"&");
    cache.set(cacheKey, translated);
    if(cache.size > 500){
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return res.json({ translatedText: translated, source, target, cached:false });
  }catch(err){
    console.error("Translate error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Save translation to user history (protected)
app.post("/api/history", authMiddleware, (req, res) => {
  const { text, translatedText, source, target } = req.body || {};
  if(!text || !translatedText) return res.status(400).json({ error: "Missing data" });
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);
  if(!user) return res.status(404).json({ error: "User not found" });
  const entry = { id: uuidv4(), text, translatedText, source, target, ts: Date.now() };
  user.history = user.history || [];
  user.history.unshift(entry);
  if(user.history.length > 100) user.history = user.history.slice(0,100);
  saveUsers(users);
  res.json({ ok:true, entry });
});

// Get user history (protected)
app.get("/api/history", authMiddleware, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);
  if(!user) return res.status(404).json({ error: "User not found" });
  res.json({ history: user.history || [] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Textify server listening on ${PORT}`));
