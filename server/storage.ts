import { users, savedPrompts, type User, type InsertUser, type DbSavedPrompt, type InsertSavedPrompt, type PromptElements } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  savePrompt(userId: number, promptText: string, elements: PromptElements): Promise<DbSavedPrompt>;
  getSavedPrompts(userId: number): Promise<DbSavedPrompt[]>;
  deletePrompt(userId: number, promptId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async savePrompt(userId: number, promptText: string, elements: PromptElements): Promise<DbSavedPrompt> {
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

  async getSavedPrompts(userId: number): Promise<DbSavedPrompt[]> {
    return await db
      .select()
      .from(savedPrompts)
      .where(eq(savedPrompts.userId, userId))
      .orderBy(savedPrompts.createdAt);
  }

  async deletePrompt(userId: number, promptId: number): Promise<boolean> {
    const result = await db
      .delete(savedPrompts)
      .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
