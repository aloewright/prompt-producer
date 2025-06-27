import {
  users,
  savedPrompts,
  type User,
  type UpsertUser,
  type DbSavedPrompt,
  type InsertSavedPrompt,
  type PromptElements,
} from "@shared/schema";
import { db } from "./db";
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

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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
      style: elements.style,
      cameraMotion: elements.cameraMotion,
      ambiance: elements.ambiance,
      audio: elements.audio,
      closing: elements.closing,
    };

    const [savedPrompt] = await db
      .insert(savedPrompts)
      .values(promptData)
      .returning();
    return savedPrompt;
  }

  async getSavedPrompts(userId: string): Promise<DbSavedPrompt[]> {
    return await db
      .select()
      .from(savedPrompts)
      .where(eq(savedPrompts.userId, userId))
      .orderBy(savedPrompts.createdAt);
  }

  async deletePrompt(userId: string, promptId: number): Promise<boolean> {
    const result = await db
      .delete(savedPrompts)
      .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
