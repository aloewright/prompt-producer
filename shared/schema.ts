import { z } from "zod";
import { pgTable, serial, text, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
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
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedPrompts = pgTable("saved_prompts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
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
