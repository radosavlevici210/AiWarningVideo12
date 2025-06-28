import { 
  reports, 
  quizQuestions, 
  quizResults, 
  educationalContent, 
  videoJobs,
  type Report, 
  type InsertReport, 
  type QuizQuestion, 
  type QuizResult, 
  type InsertQuizResult, 
  type EducationalContent, 
  type VideoJob, 
  type InsertVideoJob 
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
}

export class MemStorage implements IStorage {
  private reports: Map<number, Report>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizResults: Map<number, QuizResult>;
  private educationalContent: Map<number, EducationalContent>;
  private videoJobs: Map<number, VideoJob>;
  private currentId: number;

  constructor() {
    this.reports = new Map();
    this.quizQuestions = new Map();
    this.quizResults = new Map();
    this.educationalContent = new Map();
    this.videoJobs = new Map();
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
}

export const storage = new MemStorage();
