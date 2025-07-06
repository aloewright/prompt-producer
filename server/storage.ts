import {
  users,
  savedPrompts,
  type User,
  type UpsertUser,
  type DbSavedPrompt,
  type InsertSavedPrompt,
  type PromptElements,
} from "@shared/schema";
import { getDb } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Prompt operations
  savePrompt(userId: string, promptText: string, elements: PromptElements): Promise<DbSavedPrompt>;
  getSavedPrompts(userId: string): Promise<DbSavedPrompt[]>;
  deletePrompt(userId: string, promptId: number): Promise<boolean>;
}

export class D1Storage implements IStorage {
  private db: ReturnType<typeof getDb>;

  constructor(env: { DB: D1Database }) {
    this.db = getDb(env);
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // SQLite doesn't have UPSERT syntax like PostgreSQL, so we'll do INSERT OR REPLACE
    const [user] = await this.db
      .insert(users)
      .values({
        ...userData,
        createdAt: userData.createdAt || new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Prompt operations
  async savePrompt(userId: string, promptText: string, elements: PromptElements): Promise<DbSavedPrompt> {
    const promptData: InsertSavedPrompt = {
      userId,
      text: promptText,
      subject: elements.subject,
      customSubject: elements.customSubject,
      subjectAge: elements.subjectAge,
      subjectGender: elements.subjectGender,
      subjectAppearance: elements.subjectAppearance,
      subjectClothing: elements.subjectClothing,
      context: elements.context,
      action: elements.action,
      customAction: elements.customAction,
      style: elements.style ? JSON.stringify(elements.style) : null, // Convert array to JSON string
      cameraMotion: elements.cameraMotion,
      ambiance: elements.ambiance,
      audio: elements.audio,
      closing: elements.closing,
    };

    const [savedPrompt] = await this.db
      .insert(savedPrompts)
      .values(promptData)
      .returning();
    
    // Parse the style JSON back to array for return value
    if (savedPrompt.style) {
      savedPrompt.style = JSON.parse(savedPrompt.style as string);
    }
    
    return savedPrompt;
  }

  async getSavedPrompts(userId: string): Promise<DbSavedPrompt[]> {
    const prompts = await this.db
      .select()
      .from(savedPrompts)
      .where(eq(savedPrompts.userId, userId))
      .orderBy(savedPrompts.createdAt);
    
    // Parse style JSON back to arrays
    return prompts.map(prompt => ({
      ...prompt,
      style: prompt.style ? JSON.parse(prompt.style as string) : null,
    }));
  }

  async deletePrompt(userId: string, promptId: number): Promise<boolean> {
    const result = await this.db
      .delete(savedPrompts)
      .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)));
    return (result.changes || 0) > 0;
  }
}

// Factory function to create storage instance
export function createStorage(env: { DB: D1Database }): IStorage {
  return new D1Storage(env);
}

// Legacy export for compatibility (will be removed later)
export const storage = {
  getUser: () => { throw new Error("Storage must be initialized with D1 database"); },
  upsertUser: () => { throw new Error("Storage must be initialized with D1 database"); },
  savePrompt: () => { throw new Error("Storage must be initialized with D1 database"); },
  getSavedPrompts: () => { throw new Error("Storage must be initialized with D1 database"); },
  deletePrompt: () => { throw new Error("Storage must be initialized with D1 database"); },
};

