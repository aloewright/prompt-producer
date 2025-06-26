import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedPromptSchema, promptElementsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // For demo purposes, we'll use a simple user ID of 1
  // In a real app, this would come from authentication
  const DEMO_USER_ID = 1;

  // Create demo user if it doesn't exist
  app.use(async (req, res, next) => {
    try {
      let user = await storage.getUser(DEMO_USER_ID);
      if (!user) {
        user = await storage.createUser({
          username: "demo_user",
          password: "demo_password"
        });
      }
      next();
    } catch (error) {
      console.error("Error ensuring demo user:", error);
      next();
    }
  });

  // Get saved prompts
  app.get("/api/prompts", async (req: Request, res: Response) => {
    try {
      const prompts = await storage.getSavedPrompts(DEMO_USER_ID);
      
      // Transform database prompts to frontend format
      const transformedPrompts = prompts.map(prompt => ({
        id: prompt.id.toString(),
        text: prompt.text,
        elements: {
          subject: prompt.subject,
          customSubject: prompt.customSubject,
          subjectAge: prompt.subjectAge,
          subjectGender: prompt.subjectGender,
          subjectAppearance: prompt.subjectAppearance,
          subjectClothing: prompt.subjectClothing,
          context: prompt.context,
          action: prompt.action,
          customAction: prompt.customAction,
          style: prompt.style,
          cameraMotion: prompt.cameraMotion,
          ambiance: prompt.ambiance,
          audio: prompt.audio,
          closing: prompt.closing,
        },
        createdAt: prompt.createdAt.toISOString(),
      }));

      res.json(transformedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  // Save a new prompt
  app.post("/api/prompts", async (req: Request, res: Response) => {
    try {
      const { text, elements } = req.body;
      
      if (!text || !elements) {
        return res.status(400).json({ error: "Text and elements are required" });
      }

      // Validate elements
      const validatedElements = promptElementsSchema.parse(elements);
      
      const savedPrompt = await storage.savePrompt(DEMO_USER_ID, text, validatedElements);
      
      // Transform to frontend format
      const transformedPrompt = {
        id: savedPrompt.id.toString(),
        text: savedPrompt.text,
        elements: validatedElements,
        createdAt: savedPrompt.createdAt.toISOString(),
      };

      res.json(transformedPrompt);
    } catch (error) {
      console.error("Error saving prompt:", error);
      res.status(500).json({ error: "Failed to save prompt" });
    }
  });

  // Delete a prompt
  app.delete("/api/prompts/:id", async (req: Request, res: Response) => {
    try {
      const promptId = parseInt(req.params.id);
      
      if (isNaN(promptId)) {
        return res.status(400).json({ error: "Invalid prompt ID" });
      }

      const success = await storage.deletePrompt(DEMO_USER_ID, promptId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Prompt not found" });
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ error: "Failed to delete prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
