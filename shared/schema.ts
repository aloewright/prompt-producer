import { z } from "zod";

export const promptElementsSchema = z.object({
  subject: z.string().optional(),
  customSubject: z.string().optional(),
  context: z.string().optional(),
  action: z.string().optional(),
  customAction: z.string().optional(),
  style: z.array(z.string()).optional(),
  cameraMotion: z.string().optional(),
  ambiance: z.string().optional(),
  audio: z.string().optional(),
  closing: z.string().optional(),
});

export const savedPromptSchema = z.object({
  id: z.string(),
  text: z.string(),
  elements: promptElementsSchema,
  createdAt: z.string(),
});

export type PromptElements = z.infer<typeof promptElementsSchema>;
export type SavedPrompt = z.infer<typeof savedPromptSchema>;
