import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'deepfake', 'voice-clone', 'generated-text', 'other'
  description: text("description").notNull(),
  reporterEmail: text("reporter_email"),
  incidentDate: text("incident_date"),
  evidence: json("evidence"), // Array of file paths or URLs
  status: text("status").notNull().default("pending"), // 'pending', 'reviewed', 'resolved'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  imageUrl: text("image_url"),
  correctAnswer: text("correct_answer").notNull(), // 'real', 'ai', 'unsure'
  explanation: text("explanation").notNull(),
  category: text("category").notNull(), // 'deepfake', 'voice', 'text'
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: json("answers").notNull(), // Array of user answers
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'deepfake', 'voice-clone', 'ai-text'
  description: text("description").notNull(),
  content: text("content").notNull(),
  iconClass: text("icon_class").notNull(),
  keyPoints: json("key_points").notNull(), // Array of strings
});

export const videoJobs = pgTable("video_jobs", {
  id: serial("id").primaryKey(),
  script: text("script").notNull(),
  voiceType: text("voice_type").notNull(), // 'male', 'female', 'neutral'
  voiceSpeed: text("voice_speed").notNull(), // 'normal', 'slow', 'fast'
  videoFormat: text("video_format").notNull(), // '1280x720', '1920x1080'
  backgroundStyle: text("background_style").notNull(), // 'dark', 'blue', 'warning'
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed'
  videoUrl: text("video_url"),
  duration: integer("duration"), // in seconds
  fileSize: integer("file_size"), // in bytes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businessThreats = pgTable("business_threats", {
  id: serial("id").primaryKey(),
  threatType: text("threat_type").notNull(), // 'ceo-impersonation', 'ip-theft', 'data-breach', 'employee-impersonation'
  companyName: text("company_name").notNull(),
  targetedExecutive: text("targeted_executive"), // CEO, CTO, etc.
  threatDescription: text("threat_description").notNull(),
  evidenceUrls: json("evidence_urls"), // Array of evidence URLs
  impactLevel: text("impact_level").notNull(), // 'low', 'medium', 'high', 'critical'
  detectionMethod: text("detection_method").notNull(), // 'voice-analysis', 'deepfake-detection', 'behavioral-analysis'
  mitigationSteps: json("mitigation_steps"), // Array of recommended actions
  status: text("status").notNull().default("active"), // 'active', 'mitigated', 'resolved'
  reportedBy: text("reported_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const intellectualPropertyThefts = pgTable("ip_thefts", {
  id: serial("id").primaryKey(),
  theftType: text("theft_type").notNull(), // 'code-theft', 'design-theft', 'data-theft', 'model-theft'
  originalOwner: text("original_owner").notNull(),
  stolenContent: text("stolen_content").notNull(),
  suspectedThief: text("suspected_thief"),
  evidenceHash: text("evidence_hash"), // Cryptographic hash for verification
  copyrightStatus: text("copyright_status").notNull(), // 'registered', 'pending', 'unregistered'
  aiDetectionScore: integer("ai_detection_score"), // 0-100 confidence score
  rollbackCapability: boolean("rollback_capability").notNull().default(false),
  originalTimestamp: timestamp("original_timestamp").notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const aiAgentMonitoring = pgTable("ai_agent_monitoring", {
  id: serial("id").primaryKey(),
  agentType: text("agent_type").notNull(), // 'assistant', 'chatbot', 'api', 'model'
  agentIdentifier: text("agent_identifier").notNull(),
  suspiciousActivity: text("suspicious_activity").notNull(),
  dataAccessPatterns: json("data_access_patterns"), // Unusual access patterns
  truthScore: integer("truth_score"), // 0-100 truth reliability score
  manipulationIndicators: json("manipulation_indicators"), // Signs of manipulation
  userImpactLevel: text("user_impact_level").notNull(), // 'none', 'low', 'medium', 'high'
  preventionMeasures: json("prevention_measures"), // Applied countermeasures
  monitoringStatus: text("monitoring_status").notNull().default("active"), // 'active', 'resolved', 'investigating'
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const truthVerification = pgTable("truth_verification", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'text', 'image', 'video', 'audio', 'code'
  originalContent: text("original_content").notNull(),
  verificationMethod: text("verification_method").notNull(), // 'blockchain', 'digital-signature', 'hash-verification'
  truthScore: integer("truth_score").notNull(), // 0-100 confidence in authenticity
  verificationTimestamp: timestamp("verification_timestamp").defaultNow().notNull(),
  verifiedBy: text("verified_by"), // Authority or system that verified
  manipulationDetected: boolean("manipulation_detected").notNull().default(false),
  originalHash: text("original_hash").notNull(),
  currentHash: text("current_hash").notNull(),
  integrityStatus: text("integrity_status").notNull().default("intact"), // 'intact', 'modified', 'corrupted'
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  completedAt: true,
});

export const insertVideoJobSchema = createInsertSchema(videoJobs).omit({
  id: true,
  status: true,
  videoUrl: true,
  duration: true,
  fileSize: true,
  createdAt: true,
});

export const insertBusinessThreatSchema = createInsertSchema(businessThreats).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertIpTheftSchema = createInsertSchema(intellectualPropertyThefts).omit({
  id: true,
  detectedAt: true,
});

export const insertAiAgentMonitoringSchema = createInsertSchema(aiAgentMonitoring).omit({
  id: true,
  monitoringStatus: true,
  detectedAt: true,
});

export const insertTruthVerificationSchema = createInsertSchema(truthVerification).omit({
  id: true,
  verificationTimestamp: true,
  integrityStatus: true,
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type VideoJob = typeof videoJobs.$inferSelect;
export type InsertVideoJob = z.infer<typeof insertVideoJobSchema>;
export type BusinessThreat = typeof businessThreats.$inferSelect;
export type InsertBusinessThreat = z.infer<typeof insertBusinessThreatSchema>;
export type IntellectualPropertyTheft = typeof intellectualPropertyThefts.$inferSelect;
export type InsertIpTheft = z.infer<typeof insertIpTheftSchema>;
export type AiAgentMonitoring = typeof aiAgentMonitoring.$inferSelect;
export type InsertAiAgentMonitoring = z.infer<typeof insertAiAgentMonitoringSchema>;
export type TruthVerification = typeof truthVerification.$inferSelect;
export type InsertTruthVerification = z.infer<typeof insertTruthVerificationSchema>;
