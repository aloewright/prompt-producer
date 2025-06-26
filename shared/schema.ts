import { z } from "zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const promptElementsSchema = z.object({
  subject: z.string().optional(),
  customSubject: z.string().optional(),
  subjectAge: z.string().optional(),
  subjectGender: z.string().optional(),
  subjectAppearance: z.string().optional(),
  subjectClothing: z.string().optional(),
  context: z.string().optional(),
  action: z.string().optional(),
  customAction: z.string().optional(),
  style: z.array(z.string()).optional(),
  cameraMotion: z.string().optional(),
  ambiance: z.string().optional(),
  audio: z.string().optional(),
  closing: z.string().optional(),
});

// Database tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedPrompts = pgTable("saved_prompts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  text: text("text").notNull(),
  subject: text("subject"),
  customSubject: text("custom_subject"),
  subjectAge: text("subject_age"),
  subjectGender: text("subject_gender"),
  subjectAppearance: text("subject_appearance"),
  subjectClothing: text("subject_clothing"),
  context: text("context"),
  action: text("action"),
  customAction: text("custom_action"),
  style: text("style").array(),
  cameraMotion: text("camera_motion"),
  ambiance: text("ambiance"),
  audio: text("audio"),
  closing: text("closing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const savedPromptSchema = z.object({
  id: z.string(),
  text: z.string(),
  elements: promptElementsSchema,
  createdAt: z.string(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSavedPromptSchema = createInsertSchema(savedPrompts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SavedPrompt = z.infer<typeof savedPromptSchema>;
export type PromptElements = z.infer<typeof promptElementsSchema>;
export type DbSavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = z.infer<typeof insertSavedPromptSchema>;
