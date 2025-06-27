import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedPromptSchema, promptElementsSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get saved prompts
  app.get("/api/prompts", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const prompts = await storage.getSavedPrompts(userId);
      
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
  app.post("/api/prompts", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { text, elements } = req.body;
      const userId = req.user.claims.sub;
      
      if (!text || !elements) {
        return res.status(400).json({ error: "Text and elements are required" });
      }

      // Validate elements
      const validatedElements = promptElementsSchema.parse(elements);
      
      const savedPrompt = await storage.savePrompt(userId, text, validatedElements);
      
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
  app.delete("/api/prompts/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const promptId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      if (isNaN(promptId)) {
        return res.status(400).json({ error: "Invalid prompt ID" });
      }

      const success = await storage.deletePrompt(userId, promptId);
      
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
