import { z } from "zod";
import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";
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

// Session storage table.
// (IMPORTANT) This table is mandatory for session management.
export const sessions = sqliteTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess", { mode: "json" }).notNull(),
  expire: integer("expire", { mode: "timestamp" }).notNull(),
});

// User storage table.
// (IMPORTANT) This table is used for user management.
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const savedPrompts = sqliteTable("saved_prompts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
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
  style: text("style", { mode: "json" }), // Store array as JSON
  cameraMotion: text("camera_motion"),
  ambiance: text("ambiance"),
  audio: text("audio"),
  closing: text("closing"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
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
  createdAt: true,
  updatedAt: true,
});

export const insertSavedPromptSchema = createInsertSchema(savedPrompts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type SavedPrompt = z.infer<typeof savedPromptSchema>;
export type PromptElements = z.infer<typeof promptElementsSchema>;
export type DbSavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = z.infer<typeof insertSavedPromptSchema>;
