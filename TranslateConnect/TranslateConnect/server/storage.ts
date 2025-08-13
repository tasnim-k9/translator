import { type User, type InsertUser, type Translation, type InsertTranslation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserTranslations(userId: string): Promise<Translation[]>;
  saveTranslation(translation: InsertTranslation): Promise<Translation>;
  deleteTranslation(id: string, userId: string): Promise<boolean>;
  clearUserTranslations(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private translations: Map<string, Translation>;

  constructor() {
    this.users = new Map();
    this.translations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserTranslations(userId: string): Promise<Translation[]> {
    return Array.from(this.translations.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async saveTranslation(translation: InsertTranslation): Promise<Translation> {
    const id = randomUUID();
    const newTranslation: Translation = {
      ...translation,
      id,
      timestamp: Date.now(),
      userId: translation.userId || null,
    };
    this.translations.set(id, newTranslation);
    return newTranslation;
  }

  async deleteTranslation(id: string, userId: string): Promise<boolean> {
    const translation = this.translations.get(id);
    if (translation && translation.userId === userId) {
      this.translations.delete(id);
      return true;
    }
    return false;
  }

  async clearUserTranslations(userId: string): Promise<void> {
    const translationsToDelete: string[] = [];
    for (const [id, translation] of this.translations.entries()) {
      if (translation.userId === userId) {
        translationsToDelete.push(id);
      }
    }
    translationsToDelete.forEach(id => this.translations.delete(id));
  }
}

export const storage = new MemStorage();
