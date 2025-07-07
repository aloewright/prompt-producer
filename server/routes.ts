import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedPromptSchema, promptElementsSchema, type DbSavedPrompt } from "@shared/schema";

const PUBLIC_USER_ID = "public";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get saved prompts
  app.get("/api/prompts", async (_req: any, res: Response) => {
    try {
      const prompts: DbSavedPrompt[] = await storage.getSavedPrompts(PUBLIC_USER_ID);
      
      // Transform database prompts to frontend format
      const transformedPrompts = prompts.map((prompt) => ({
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
        createdAt: prompt.createdAt instanceof Date ? prompt.createdAt.toISOString() : new Date(prompt.createdAt).toISOString(),
      }));

      res.json(transformedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  // Save a new prompt
  app.post("/api/prompts", async (req: any, res: Response) => {
    try {
      const { text, elements } = req.body;
      
      if (!text || !elements) {
        return res.status(400).json({ error: "Text and elements are required" });
      }

      // Validate elements
      const validatedElements = promptElementsSchema.parse(elements);
      
      const savedPrompt: DbSavedPrompt = await storage.savePrompt(PUBLIC_USER_ID, text, validatedElements);
      
      // Transform to frontend format
      const transformedPrompt = {
        id: savedPrompt.id.toString(),
        text: savedPrompt.text,
        elements: validatedElements,
        createdAt: savedPrompt.createdAt instanceof Date ? savedPrompt.createdAt.toISOString() : new Date(savedPrompt.createdAt).toISOString(),
      };

      res.json(transformedPrompt);
    } catch (error) {
      console.error("Error saving prompt:", error);
      res.status(500).json({ error: "Failed to save prompt" });
    }
  });

  // Delete a prompt
  app.delete("/api/prompts/:id", async (req: any, res: Response) => {
    try {
      const promptId = parseInt(req.params.id);
      
      if (isNaN(promptId)) {
        return res.status(400).json({ error: "Invalid prompt ID" });
      }

      const success = await storage.deletePrompt(PUBLIC_USER_ID, promptId);
      
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

  // News API endpoint
  app.get("/api/news", async (_req: Request, res: Response) => {
    try {
      const newsApiKey = process.env.NEWS_API_KEY;
      
      if (!newsApiKey) {
        return res.status(500).json({ message: "News API key not configured" });
      }

      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=10&apiKey=${newsApiKey}`);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data: any = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`News API error: ${data.message}`);
      }

      // Filter out articles with null titles and format the response
      const articles = data.articles
        .filter((article: any) => article.title && article.title !== '[Removed]')
        .map((article: any) => ({
          title: article.title,
          url: article.url,
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name
          }
        }));

      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
