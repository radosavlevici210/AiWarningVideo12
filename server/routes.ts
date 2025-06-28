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
  insertTruthVerificationSchema,
  insertApiTheftSchema,
  insertAiConsoleControlSchema,
  insertUserHarassmentSchema,
  insertBlockchainIntegritySchema,
  insertAdvancedThreatSchema,
  insertCorporateAiTheftSchema,
  insertGithubWorkflowTheftSchema,
  insertOfflineAiAccessSchema,
  insertCopyrightComplaintSchema,
  insertCopyrightRewardSchema,
  insertAiFingerprintDetectionSchema,
  insertZeroKnowledgeAbuseLogSchema,
  insertInvestorDashboardMetricsSchema,
  insertCommunityWatchdogModeSchema,
  insertParallelConsoleDetectionSchema,
  insertRealityExploitationMonitorSchema,
  insertBlockchainTamperWatchSchema,
  insertForkCloneSelfDestructSchema,
  insertGovernmentInactionDatabaseSchema
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

  // API Theft Monitoring routes
  app.get("/api/api-theft", async (req, res) => {
    try {
      const thefts = await storage.getApiThefts();
      res.json(thefts);
    } catch (error) {
      console.error("API theft fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/api-theft", async (req, res) => {
    try {
      const result = insertApiTheftSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const theft = await storage.createApiTheft(result.data);
      res.status(201).json(theft);
    } catch (error) {
      console.error("API theft creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/api-theft/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedTheft = await storage.updateApiTheftStatus(id, status);
      if (!updatedTheft) {
        return res.status(404).json({ error: "API theft not found" });
      }
      
      res.json(updatedTheft);
    } catch (error) {
      console.error("API theft status update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Console Control routes
  app.get("/api/console-controls", async (req, res) => {
    try {
      const controls = await storage.getConsoleControls();
      res.json(controls);
    } catch (error) {
      console.error("Console controls fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/console-controls", async (req, res) => {
    try {
      const result = insertAiConsoleControlSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const control = await storage.createConsoleControl(result.data);
      res.status(201).json(control);
    } catch (error) {
      console.error("Console control creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/console-controls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedControl = await storage.updateConsoleControl(id, updates);
      if (!updatedControl) {
        return res.status(404).json({ error: "Console control not found" });
      }
      
      res.json(updatedControl);
    } catch (error) {
      console.error("Console control update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User Harassment Detection routes
  app.get("/api/harassment-cases", async (req, res) => {
    try {
      const cases = await storage.getHarassmentCases();
      res.json(cases);
    } catch (error) {
      console.error("Harassment cases fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/harassment-cases", async (req, res) => {
    try {
      const result = insertUserHarassmentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const harassmentCase = await storage.createHarassmentCase(result.data);
      res.status(201).json(harassmentCase);
    } catch (error) {
      console.error("Harassment case creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/harassment-cases/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedCase = await storage.updateHarassmentStatus(id, status);
      if (!updatedCase) {
        return res.status(404).json({ error: "Harassment case not found" });
      }
      
      res.json(updatedCase);
    } catch (error) {
      console.error("Harassment case status update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Blockchain AI Integrity routes
  app.get("/api/blockchain-records", async (req, res) => {
    try {
      const records = await storage.getBlockchainRecords();
      res.json(records);
    } catch (error) {
      console.error("Blockchain records fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/blockchain-records", async (req, res) => {
    try {
      const result = insertBlockchainIntegritySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const record = await storage.createBlockchainRecord(result.data);
      res.status(201).json(record);
    } catch (error) {
      console.error("Blockchain record creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/blockchain-records/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.verifyBlockchainIntegrity(id);
      res.json({ verified: result });
    } catch (error) {
      console.error("Blockchain verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Advanced Threat Analysis routes
  app.get("/api/threat-analyses", async (req, res) => {
    try {
      const analyses = await storage.getThreatAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Threat analyses fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/threat-analyses", async (req, res) => {
    try {
      const result = insertAdvancedThreatSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const analysis = await storage.createThreatAnalysis(result.data);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Threat analysis creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/threat-analyses/:id/confidence", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { confidence } = req.body;
      
      if (typeof confidence !== 'number' || confidence < 0 || confidence > 100) {
        return res.status(400).json({ error: "Confidence must be a number between 0 and 100" });
      }
      
      const updatedAnalysis = await storage.updateAnalysisConfidence(id, confidence);
      if (!updatedAnalysis) {
        return res.status(404).json({ error: "Threat analysis not found" });
      }
      
      res.json(updatedAnalysis);
    } catch (error) {
      console.error("Threat analysis confidence update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Corporate AI Theft routes
  app.get("/api/corporate-theft", async (req, res) => {
    try {
      const thefts = await storage.getCorporateThefts();
      res.json(thefts);
    } catch (error) {
      console.error("Corporate theft fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/corporate-theft", async (req, res) => {
    try {
      const result = insertCorporateAiTheftSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const theft = await storage.createCorporateTheft(result.data);
      res.status(201).json(theft);
    } catch (error) {
      console.error("Corporate theft creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/corporate-theft/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedTheft = await storage.updateCorporateTheftStatus(id, status);
      if (!updatedTheft) {
        return res.status(404).json({ error: "Corporate theft case not found" });
      }
      
      res.json(updatedTheft);
    } catch (error) {
      console.error("Corporate theft status update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GitHub Workflow Theft routes
  app.get("/api/github-theft", async (req, res) => {
    try {
      const thefts = await storage.getGithubThefts();
      res.json(thefts);
    } catch (error) {
      console.error("GitHub theft fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/github-theft", async (req, res) => {
    try {
      const result = insertGithubWorkflowTheftSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const theft = await storage.createGithubTheft(result.data);
      res.status(201).json(theft);
    } catch (error) {
      console.error("GitHub theft creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/github-theft/:id/dmca", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedTheft = await storage.updateDmcaStatus(id, status);
      if (!updatedTheft) {
        return res.status(404).json({ error: "GitHub theft case not found" });
      }
      
      res.json(updatedTheft);
    } catch (error) {
      console.error("GitHub theft DMCA update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Offline AI Access routes
  app.get("/api/offline-access", async (req, res) => {
    try {
      const accesses = await storage.getOfflineAccesses();
      res.json(accesses);
    } catch (error) {
      console.error("Offline access fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/offline-access", async (req, res) => {
    try {
      const result = insertOfflineAiAccessSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const access = await storage.createOfflineAccess(result.data);
      res.status(201).json(access);
    } catch (error) {
      console.error("Offline access creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/offline-access/:id/tracking", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: "Enabled must be a boolean" });
      }
      
      const updatedAccess = await storage.updateTrackingStatus(id, enabled);
      if (!updatedAccess) {
        return res.status(404).json({ error: "Offline access case not found" });
      }
      
      res.json(updatedAccess);
    } catch (error) {
      console.error("Offline access tracking update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Copyright Complaint routes
  app.get("/api/copyright-complaints", async (req, res) => {
    try {
      const complaints = await storage.getCopyrightComplaints();
      res.json(complaints);
    } catch (error) {
      console.error("Copyright complaints fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/copyright-complaints", async (req, res) => {
    try {
      const result = insertCopyrightComplaintSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const complaint = await storage.createCopyrightComplaint(result.data);
      res.status(201).json(complaint);
    } catch (error) {
      console.error("Copyright complaint creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/copyright-complaints/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedComplaint = await storage.updateComplaintStatus(id, status);
      if (!updatedComplaint) {
        return res.status(404).json({ error: "Copyright complaint not found" });
      }
      
      res.json(updatedComplaint);
    } catch (error) {
      console.error("Copyright complaint status update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Copyright Reward routes
  app.get("/api/copyright-rewards", async (req, res) => {
    try {
      const rewards = await storage.getCopyrightRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Copyright rewards fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/copyright-rewards", async (req, res) => {
    try {
      const result = insertCopyrightRewardSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const reward = await storage.createCopyrightReward(result.data);
      res.status(201).json(reward);
    } catch (error) {
      console.error("Copyright reward creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/copyright-rewards/:id/payment", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedReward = await storage.updatePaymentStatus(id, status);
      if (!updatedReward) {
        return res.status(404).json({ error: "Copyright reward not found" });
      }
      
      res.json(updatedReward);
    } catch (error) {
      console.error("Copyright reward payment update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Advanced AI Theft Detection & Anti-Stalking Enforcement Suite routes
  app.get("/api/ai-fingerprint-detection", async (req, res) => {
    try {
      const detections = await storage.getAiFingerprintDetections();
      res.json(detections);
    } catch (error) {
      console.error("AI fingerprint detection fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-fingerprint-detection", async (req, res) => {
    try {
      const result = insertAiFingerprintDetectionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const detection = await storage.createAiFingerprintDetection(result.data);
      res.status(201).json(detection);
    } catch (error) {
      console.error("AI fingerprint detection creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/zero-knowledge-abuse-logs", async (req, res) => {
    try {
      const logs = await storage.getZeroKnowledgeAbuseLogs();
      res.json(logs);
    } catch (error) {
      console.error("Zero-knowledge abuse logs fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/zero-knowledge-abuse-logs", async (req, res) => {
    try {
      const result = insertZeroKnowledgeAbuseLogSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const log = await storage.createZeroKnowledgeAbuseLog(result.data);
      res.status(201).json(log);
    } catch (error) {
      console.error("Zero-knowledge abuse log creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/investor-dashboard-metrics", async (req, res) => {
    try {
      const metrics = await storage.getInvestorDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Investor dashboard metrics fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/investor-dashboard-metrics", async (req, res) => {
    try {
      const result = insertInvestorDashboardMetricsSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const metrics = await storage.createInvestorDashboardMetrics(result.data);
      res.status(201).json(metrics);
    } catch (error) {
      console.error("Investor dashboard metrics creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/community-watchdog", async (req, res) => {
    try {
      const watchdogs = await storage.getCommunityWatchdogModes();
      res.json(watchdogs);
    } catch (error) {
      console.error("Community watchdog fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/community-watchdog", async (req, res) => {
    try {
      const result = insertCommunityWatchdogModeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const watchdog = await storage.createCommunityWatchdogMode(result.data);
      res.status(201).json(watchdog);
    } catch (error) {
      console.error("Community watchdog creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/parallel-console-detection", async (req, res) => {
    try {
      const detections = await storage.getParallelConsoleDetections();
      res.json(detections);
    } catch (error) {
      console.error("Parallel console detection fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/parallel-console-detection", async (req, res) => {
    try {
      const result = insertParallelConsoleDetectionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const detection = await storage.createParallelConsoleDetection(result.data);
      res.status(201).json(detection);
    } catch (error) {
      console.error("Parallel console detection creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/reality-exploitation-monitor", async (req, res) => {
    try {
      const monitors = await storage.getRealityExploitationMonitors();
      res.json(monitors);
    } catch (error) {
      console.error("Reality exploitation monitor fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/reality-exploitation-monitor", async (req, res) => {
    try {
      const result = insertRealityExploitationMonitorSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const monitor = await storage.createRealityExploitationMonitor(result.data);
      res.status(201).json(monitor);
    } catch (error) {
      console.error("Reality exploitation monitor creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/blockchain-tamper-watch", async (req, res) => {
    try {
      const watches = await storage.getBlockchainTamperWatches();
      res.json(watches);
    } catch (error) {
      console.error("Blockchain tamper watch fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/blockchain-tamper-watch", async (req, res) => {
    try {
      const result = insertBlockchainTamperWatchSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const watch = await storage.createBlockchainTamperWatch(result.data);
      res.status(201).json(watch);
    } catch (error) {
      console.error("Blockchain tamper watch creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/fork-clone-self-destruct", async (req, res) => {
    try {
      const destructs = await storage.getForkCloneSelfDestructs();
      res.json(destructs);
    } catch (error) {
      console.error("Fork clone self-destruct fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/fork-clone-self-destruct", async (req, res) => {
    try {
      const result = insertForkCloneSelfDestructSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const destruct = await storage.createForkCloneSelfDestruct(result.data);
      res.status(201).json(destruct);
    } catch (error) {
      console.error("Fork clone self-destruct creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/government-inaction-database", async (req, res) => {
    try {
      const records = await storage.getGovernmentInactionDatabases();
      res.json(records);
    } catch (error) {
      console.error("Government inaction database fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/government-inaction-database", async (req, res) => {
    try {
      const result = insertGovernmentInactionDatabaseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error.errors });
      }
      
      const record = await storage.createGovernmentInactionDatabase(result.data);
      res.status(201).json(record);
    } catch (error) {
      console.error("Government inaction database creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
