import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertReportSchema, 
  insertQuizResultSchema, 
  insertVideoJobSchema,
  insertBusinessThreatSchema,
  insertIpTheftSchema,
  insertAiAgentMonitoringSchema,
  insertTruthVerificationSchema
} from "@shared/schema";
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

  // Business Threat routes
  app.post("/api/business-threats", async (req, res) => {
    try {
      const validatedData = insertBusinessThreatSchema.parse(req.body);
      const threat = await storage.createBusinessThreat(validatedData);
      res.json(threat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid business threat data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create business threat" });
      }
    }
  });

  app.get("/api/business-threats", async (req, res) => {
    try {
      const threats = await storage.getBusinessThreats();
      res.json(threats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business threats" });
    }
  });

  app.patch("/api/business-threats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedThreat = await storage.updateBusinessThreat(id, req.body);
      
      if (!updatedThreat) {
        res.status(404).json({ message: "Business threat not found" });
        return;
      }
      
      res.json(updatedThreat);
    } catch (error) {
      res.status(500).json({ message: "Failed to update business threat" });
    }
  });

  // IP Theft routes
  app.post("/api/ip-theft", async (req, res) => {
    try {
      const validatedData = insertIpTheftSchema.parse(req.body);
      const theft = await storage.createIpTheft(validatedData);
      res.json(theft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid IP theft data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create IP theft record" });
      }
    }
  });

  app.get("/api/ip-theft", async (req, res) => {
    try {
      const thefts = await storage.getIpThefts();
      res.json(thefts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IP theft records" });
    }
  });

  app.post("/api/ip-theft/:id/rollback", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.rollbackIpTheft(id);
      
      if (!success) {
        res.status(400).json({ message: "Rollback not possible for this theft record" });
        return;
      }
      
      res.json({ message: "Rollback successful", success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to rollback IP theft" });
    }
  });

  // AI Agent Monitoring routes
  app.post("/api/ai-agents", async (req, res) => {
    try {
      const validatedData = insertAiAgentMonitoringSchema.parse(req.body);
      const monitoring = await storage.createAiAgentMonitoring(validatedData);
      res.json(monitoring);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid AI agent monitoring data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create AI agent monitoring" });
      }
    }
  });

  app.get("/api/ai-agents", async (req, res) => {
    try {
      const monitoring = await storage.getAiAgentMonitoring();
      res.json(monitoring);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI agent monitoring" });
    }
  });

  app.patch("/api/ai-agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedMonitoring = await storage.updateAgentMonitoring(id, req.body);
      
      if (!updatedMonitoring) {
        res.status(404).json({ message: "AI agent monitoring not found" });
        return;
      }
      
      res.json(updatedMonitoring);
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI agent monitoring" });
    }
  });

  // Truth Verification routes
  app.post("/api/truth-verification", async (req, res) => {
    try {
      const validatedData = insertTruthVerificationSchema.parse(req.body);
      const verification = await storage.createTruthVerification(validatedData);
      res.json(verification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid truth verification data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create truth verification" });
      }
    }
  });

  app.get("/api/truth-verification", async (req, res) => {
    try {
      const verifications = await storage.getTruthVerifications();
      res.json(verifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch truth verifications" });
    }
  });

  app.post("/api/truth-verification/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { currentHash } = req.body;
      
      if (!currentHash) {
        res.status(400).json({ message: "Current hash is required" });
        return;
      }
      
      const isIntact = await storage.verifyContentIntegrity(id, currentHash);
      res.json({ isIntact, message: isIntact ? "Content is intact" : "Content has been modified" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify content integrity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
