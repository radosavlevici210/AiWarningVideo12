import { 
  reports, 
  quizQuestions, 
  quizResults, 
  educationalContent, 
  videoJobs,
  businessThreats,
  intellectualPropertyThefts,
  aiAgentMonitoring,
  truthVerification,
  type Report, 
  type InsertReport, 
  type QuizQuestion, 
  type QuizResult, 
  type InsertQuizResult, 
  type EducationalContent, 
  type VideoJob, 
  type InsertVideoJob,
  type BusinessThreat,
  type InsertBusinessThreat,
  type IntellectualPropertyTheft,
  type InsertIpTheft,
  type AiAgentMonitoring,
  type InsertAiAgentMonitoring,
  type TruthVerification,
  type InsertTruthVerification
} from "@shared/schema";

export interface IStorage {
  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
  
  // Quiz
  getQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  
  // Educational Content
  getEducationalContent(): Promise<EducationalContent[]>;
  
  // Video Jobs
  createVideoJob(job: InsertVideoJob): Promise<VideoJob>;
  getVideoJob(id: number): Promise<VideoJob | undefined>;
  updateVideoJob(id: number, updates: Partial<VideoJob>): Promise<VideoJob | undefined>;
  
  // Business Threats
  createBusinessThreat(threat: InsertBusinessThreat): Promise<BusinessThreat>;
  getBusinessThreats(): Promise<BusinessThreat[]>;
  updateBusinessThreat(id: number, updates: Partial<BusinessThreat>): Promise<BusinessThreat | undefined>;
  
  // IP Theft Detection
  createIpTheft(theft: InsertIpTheft): Promise<IntellectualPropertyTheft>;
  getIpThefts(): Promise<IntellectualPropertyTheft[]>;
  rollbackIpTheft(id: number): Promise<boolean>;
  
  // AI Agent Monitoring
  createAiAgentMonitoring(monitoring: InsertAiAgentMonitoring): Promise<AiAgentMonitoring>;
  getAiAgentMonitoring(): Promise<AiAgentMonitoring[]>;
  updateAgentMonitoring(id: number, updates: Partial<AiAgentMonitoring>): Promise<AiAgentMonitoring | undefined>;
  
  // Truth Verification
  createTruthVerification(verification: InsertTruthVerification): Promise<TruthVerification>;
  getTruthVerifications(): Promise<TruthVerification[]>;
  verifyContentIntegrity(contentId: number, currentHash: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private reports: Map<number, Report>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizResults: Map<number, QuizResult>;
  private educationalContent: Map<number, EducationalContent>;
  private videoJobs: Map<number, VideoJob>;
  private businessThreats: Map<number, BusinessThreat>;
  private ipThefts: Map<number, IntellectualPropertyTheft>;
  private aiAgentMonitoring: Map<number, AiAgentMonitoring>;
  private truthVerifications: Map<number, TruthVerification>;
  private currentId: number;

  constructor() {
    this.reports = new Map();
    this.quizQuestions = new Map();
    this.quizResults = new Map();
    this.educationalContent = new Map();
    this.videoJobs = new Map();
    this.businessThreats = new Map();
    this.ipThefts = new Map();
    this.aiAgentMonitoring = new Map();
    this.truthVerifications = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed educational content
    const educationalData: Omit<EducationalContent, 'id'>[] = [
      {
        title: "Deepfake Detection",
        category: "deepfake",
        description: "Learn to identify artificially generated faces and videos that scammers use to create fake identities.",
        content: "Deepfakes are AI-generated videos or images that replace a person's face with someone else's. They can be used to impersonate trusted individuals or create fake identities for scams.",
        iconClass: "fas fa-robot",
        keyPoints: ["Facial inconsistencies", "Lighting anomalies", "Unnatural expressions"]
      },
      {
        title: "Voice Cloning",
        category: "voice-clone",
        description: "Understand how scammers clone voices and impersonate trusted individuals for fraudulent calls.",
        content: "Voice cloning technology can replicate a person's voice using just a few audio samples. Scammers use this to impersonate family members, colleagues, or authority figures.",
        iconClass: "fas fa-microphone",
        keyPoints: ["Audio quality markers", "Speech pattern analysis", "Verification techniques"]
      },
      {
        title: "AI-Generated Text",
        category: "ai-text",
        description: "Spot artificially generated messages, emails, and social media posts used in scams.",
        content: "AI can generate convincing text for phishing emails, fake reviews, and social media posts. Learning to identify these can protect you from various scams.",
        iconClass: "fas fa-comment-dots",
        keyPoints: ["Pattern recognition", "Context analysis", "Source verification"]
      }
    ];

    educationalData.forEach(content => {
      const id = this.currentId++;
      this.educationalContent.set(id, { ...content, id });
    });

    // Seed quiz questions
    const quizData: Omit<QuizQuestion, 'id'>[] = [
      {
        question: "Look at this image carefully. Is this a real person or AI-generated?",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        correctAnswer: "real",
        explanation: "This is a real photograph. Look for natural lighting, consistent skin texture, and realistic eye reflections.",
        category: "deepfake"
      },
      {
        question: "Which of these audio clips sounds like it could be AI-generated?",
        imageUrl: "",
        correctAnswer: "ai",
        explanation: "AI-generated voices often lack emotional nuance and may have subtle robotic qualities.",
        category: "voice"
      },
      {
        question: "Does this email text pattern suggest AI generation?",
        imageUrl: "",
        correctAnswer: "ai",
        explanation: "AI-generated text often has repetitive patterns and may lack personal context.",
        category: "text"
      }
    ];

    quizData.forEach(question => {
      const id = this.currentId++;
      this.quizQuestions.set(id, { ...question, id });
    });

    // Seed business threats
    const businessThreatData: Omit<BusinessThreat, 'id' | 'status' | 'createdAt'>[] = [
      {
        threatType: "ceo-impersonation",
        companyName: "TechCorp Inc",
        targetedExecutive: "CEO John Smith",
        threatDescription: "Deepfake video call requesting emergency wire transfer of $500,000 to overseas account",
        evidenceUrls: ["https://example.com/evidence1.mp4"],
        impactLevel: "critical",
        detectionMethod: "voice-analysis",
        mitigationSteps: ["Verify through secondary channel", "Implement voice authentication", "Training for executives"],
        reportedBy: "CFO Office"
      },
      {
        threatType: "employee-impersonation",
        companyName: "DataSafe Corp",
        targetedExecutive: "HR Director",
        threatDescription: "AI-generated voice clone impersonating employee requesting sensitive HR data",
        evidenceUrls: ["https://example.com/evidence2.wav"],
        impactLevel: "high",
        detectionMethod: "behavioral-analysis",
        mitigationSteps: ["Multi-factor verification", "Voice biometric verification", "Policy updates"],
        reportedBy: "Security Team"
      }
    ];

    businessThreatData.forEach(threat => {
      const id = this.currentId++;
      this.businessThreats.set(id, { 
        ...threat, 
        id, 
        status: "active", 
        createdAt: new Date() 
      });
    });

    // Seed IP theft data
    const ipTheftData: Omit<IntellectualPropertyTheft, 'id' | 'detectedAt'>[] = [
      {
        theftType: "code-theft",
        originalOwner: "InnovateTech Solutions",
        stolenContent: "Proprietary AI algorithm for fraud detection",
        suspectedThief: "CompetitorCorp",
        evidenceHash: "sha256:a1b2c3d4e5f6...",
        copyrightStatus: "registered",
        aiDetectionScore: 95,
        rollbackCapability: true,
        originalTimestamp: new Date("2024-01-15")
      },
      {
        theftType: "model-theft",
        originalOwner: "ML Research Lab",
        stolenContent: "Neural network architecture for image recognition",
        suspectedThief: "Unknown Entity",
        evidenceHash: "sha256:f6e5d4c3b2a1...",
        copyrightStatus: "pending",
        aiDetectionScore: 87,
        rollbackCapability: false,
        originalTimestamp: new Date("2024-02-20")
      }
    ];

    ipTheftData.forEach(theft => {
      const id = this.currentId++;
      this.ipThefts.set(id, { 
        ...theft, 
        id, 
        detectedAt: new Date() 
      });
    });

    // Seed AI agent monitoring
    const agentMonitoringData: Omit<AiAgentMonitoring, 'id' | 'monitoringStatus' | 'detectedAt'>[] = [
      {
        agentType: "assistant",
        agentIdentifier: "ChatBot-3000",
        suspiciousActivity: "Unusual data extraction patterns and unauthorized API calls",
        dataAccessPatterns: ["Accessing user personal data", "Querying financial records", "Downloading contact lists"],
        truthScore: 45,
        manipulationIndicators: ["Inconsistent responses", "Evasive behavior", "Data harvesting"],
        userImpactLevel: "high",
        preventionMeasures: ["Rate limiting", "Access restrictions", "Enhanced monitoring"]
      },
      {
        agentType: "api",
        agentIdentifier: "DataSync-API-v2",
        suspiciousActivity: "Attempting to access restricted endpoints and bypass authentication",
        dataAccessPatterns: ["Failed authentication attempts", "Endpoint enumeration", "Privilege escalation"],
        truthScore: 23,
        manipulationIndicators: ["Authentication bypass attempts", "Unusual request patterns"],
        userImpactLevel: "medium",
        preventionMeasures: ["IP blocking", "Enhanced authentication", "Request throttling"]
      }
    ];

    agentMonitoringData.forEach(monitoring => {
      const id = this.currentId++;
      this.aiAgentMonitoring.set(id, { 
        ...monitoring, 
        id, 
        monitoringStatus: "active", 
        detectedAt: new Date() 
      });
    });

    // Seed truth verification
    const truthVerificationData: Omit<TruthVerification, 'id' | 'verificationTimestamp' | 'integrityStatus'>[] = [
      {
        contentType: "text",
        originalContent: "Official company announcement about merger",
        verificationMethod: "digital-signature",
        truthScore: 98,
        verifiedBy: "Corporate Communications",
        manipulationDetected: false,
        originalHash: "sha256:1a2b3c4d5e6f...",
        currentHash: "sha256:1a2b3c4d5e6f..."
      },
      {
        contentType: "video",
        originalContent: "CEO quarterly earnings call recording",
        verificationMethod: "blockchain",
        truthScore: 89,
        verifiedBy: "Digital Forensics Team",
        manipulationDetected: true,
        originalHash: "sha256:abcdef123456...",
        currentHash: "sha256:fedcba654321..."
      }
    ];

    truthVerificationData.forEach(verification => {
      const id = this.currentId++;
      this.truthVerifications.set(id, { 
        ...verification, 
        id, 
        verificationTimestamp: new Date(),
        integrityStatus: verification.manipulationDetected ? "modified" : "intact"
      });
    });
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentId++;
    const report: Report = {
      ...insertReport,
      id,
      status: "pending",
      createdAt: new Date(),
      reporterEmail: insertReport.reporterEmail || null,
      incidentDate: insertReport.incidentDate || null,
      evidence: insertReport.evidence || null
    };
    this.reports.set(id, report);
    return report;
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentId++;
    const result: QuizResult = {
      ...insertResult,
      id,
      completedAt: new Date()
    };
    this.quizResults.set(id, result);
    return result;
  }

  async getEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values());
  }

  async createVideoJob(insertJob: InsertVideoJob): Promise<VideoJob> {
    const id = this.currentId++;
    const job: VideoJob = {
      ...insertJob,
      id,
      status: "pending",
      videoUrl: null,
      duration: null,
      fileSize: null,
      createdAt: new Date()
    };
    this.videoJobs.set(id, job);
    return job;
  }

  async getVideoJob(id: number): Promise<VideoJob | undefined> {
    return this.videoJobs.get(id);
  }

  async updateVideoJob(id: number, updates: Partial<VideoJob>): Promise<VideoJob | undefined> {
    const job = this.videoJobs.get(id);
    if (job) {
      const updatedJob = { ...job, ...updates };
      this.videoJobs.set(id, updatedJob);
      return updatedJob;
    }
    return undefined;
  }

  // Business Threats
  async createBusinessThreat(insertThreat: InsertBusinessThreat): Promise<BusinessThreat> {
    const id = this.currentId++;
    const threat: BusinessThreat = {
      ...insertThreat,
      id,
      status: "active",
      createdAt: new Date(),
      targetedExecutive: insertThreat.targetedExecutive || null,
      evidenceUrls: insertThreat.evidenceUrls || null,
      mitigationSteps: insertThreat.mitigationSteps || null,
      reportedBy: insertThreat.reportedBy || null
    };
    this.businessThreats.set(id, threat);
    return threat;
  }

  async getBusinessThreats(): Promise<BusinessThreat[]> {
    return Array.from(this.businessThreats.values());
  }

  async updateBusinessThreat(id: number, updates: Partial<BusinessThreat>): Promise<BusinessThreat | undefined> {
    const threat = this.businessThreats.get(id);
    if (threat) {
      const updatedThreat = { ...threat, ...updates };
      this.businessThreats.set(id, updatedThreat);
      return updatedThreat;
    }
    return undefined;
  }

  // IP Theft Detection
  async createIpTheft(insertTheft: InsertIpTheft): Promise<IntellectualPropertyTheft> {
    const id = this.currentId++;
    const theft: IntellectualPropertyTheft = {
      ...insertTheft,
      id,
      detectedAt: new Date(),
      suspectedThief: insertTheft.suspectedThief || null,
      evidenceHash: insertTheft.evidenceHash || null,
      aiDetectionScore: insertTheft.aiDetectionScore || null,
      rollbackCapability: insertTheft.rollbackCapability ?? false
    };
    this.ipThefts.set(id, theft);
    return theft;
  }

  async getIpThefts(): Promise<IntellectualPropertyTheft[]> {
    return Array.from(this.ipThefts.values());
  }

  async rollbackIpTheft(id: number): Promise<boolean> {
    const theft = this.ipThefts.get(id);
    if (theft && theft.rollbackCapability) {
      // Simulate rollback process
      const updatedTheft = { ...theft, rollbackCapability: false };
      this.ipThefts.set(id, updatedTheft);
      return true;
    }
    return false;
  }

  // AI Agent Monitoring
  async createAiAgentMonitoring(insertMonitoring: InsertAiAgentMonitoring): Promise<AiAgentMonitoring> {
    const id = this.currentId++;
    const monitoring: AiAgentMonitoring = {
      ...insertMonitoring,
      id,
      monitoringStatus: "active",
      detectedAt: new Date(),
      dataAccessPatterns: insertMonitoring.dataAccessPatterns || null,
      truthScore: insertMonitoring.truthScore || null,
      manipulationIndicators: insertMonitoring.manipulationIndicators || null,
      preventionMeasures: insertMonitoring.preventionMeasures || null
    };
    this.aiAgentMonitoring.set(id, monitoring);
    return monitoring;
  }

  async getAiAgentMonitoring(): Promise<AiAgentMonitoring[]> {
    return Array.from(this.aiAgentMonitoring.values());
  }

  async updateAgentMonitoring(id: number, updates: Partial<AiAgentMonitoring>): Promise<AiAgentMonitoring | undefined> {
    const monitoring = this.aiAgentMonitoring.get(id);
    if (monitoring) {
      const updatedMonitoring = { ...monitoring, ...updates };
      this.aiAgentMonitoring.set(id, updatedMonitoring);
      return updatedMonitoring;
    }
    return undefined;
  }

  // Truth Verification
  async createTruthVerification(insertVerification: InsertTruthVerification): Promise<TruthVerification> {
    const id = this.currentId++;
    const verification: TruthVerification = {
      ...insertVerification,
      id,
      verificationTimestamp: new Date(),
      integrityStatus: insertVerification.manipulationDetected ? "modified" : "intact",
      verifiedBy: insertVerification.verifiedBy || null,
      manipulationDetected: insertVerification.manipulationDetected ?? false
    };
    this.truthVerifications.set(id, verification);
    return verification;
  }

  async getTruthVerifications(): Promise<TruthVerification[]> {
    return Array.from(this.truthVerifications.values());
  }

  async verifyContentIntegrity(contentId: number, currentHash: string): Promise<boolean> {
    const verification = this.truthVerifications.get(contentId);
    if (verification) {
      const isIntact = verification.originalHash === currentHash;
      const updatedVerification = {
        ...verification,
        currentHash,
        manipulationDetected: !isIntact,
        integrityStatus: isIntact ? "intact" : "modified"
      };
      this.truthVerifications.set(contentId, updatedVerification as TruthVerification);
      return isIntact;
    }
    return false;
  }
}

export const storage = new MemStorage();
