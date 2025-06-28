import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema, insertQuizResultSchema, insertVideoJobSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Educational content routes
  app.get("/api/educational-content", async (req, res) => {
    try {
      const content = await storage.getEducationalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational content" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  app.post("/api/quiz/results", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid quiz result data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save quiz result" });
      }
    }
  });

  // Video generation routes
  app.post("/api/video/generate", async (req, res) => {
    try {
      const validatedData = insertVideoJobSchema.parse(req.body);
      const job = await storage.createVideoJob(validatedData);
      
      // Simulate video generation process
      setTimeout(async () => {
        const mockVideoUrl = `https://example.com/videos/${job.id}.mp4`;
        const mockDuration = Math.floor(Math.random() * 60) + 30; // 30-90 seconds
        const mockFileSize = Math.floor(Math.random() * 50000000) + 10000000; // 10-60MB
        
        await storage.updateVideoJob(job.id, {
          status: "completed",
          videoUrl: mockVideoUrl,
          duration: mockDuration,
          fileSize: mockFileSize
        });
      }, 5000); // Simulate 5 second processing time
      
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid video job data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create video job" });
      }
    }
  });

  app.get("/api/video/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getVideoJob(id);
      
      if (!job) {
        res.status(404).json({ message: "Video job not found" });
        return;
      }
      
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video job" });
    }
  });

  // Reporting routes
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create report" });
      }
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
