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

export const apiTheftMonitoring = pgTable("api_theft_monitoring", {
  id: serial("id").primaryKey(),
  apiOwner: text("api_owner").notNull(),
  apiEndpoint: text("api_endpoint").notNull(),
  stolenByEntity: text("stolen_by_entity"),
  theftMethod: text("theft_method").notNull(), // 'credential-theft', 'reverse-engineering', 'data-scraping', 'unauthorized-access'
  evidenceData: json("evidence_data"), // Logs, traces, and proof of theft
  impactAssessment: text("impact_assessment").notNull(), // 'minimal', 'moderate', 'severe', 'critical'
  financialLoss: integer("financial_loss"), // Estimated loss in USD
  userDataCompromised: boolean("user_data_compromised").notNull().default(false),
  blockchainTraceId: text("blockchain_trace_id"), // Blockchain verification ID
  recoveryStatus: text("recovery_status").notNull().default("investigating"), // 'investigating', 'legal-action', 'recovered', 'lost'
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const aiConsoleControl = pgTable("ai_console_control", {
  id: serial("id").primaryKey(),
  consoleType: text("console_type").notNull(), // 'admin', 'developer', 'monitoring', 'user'
  controlledEntity: text("controlled_entity").notNull(), // AI system being controlled
  controlMethod: text("control_method").notNull(), // 'remote-access', 'privilege-escalation', 'backdoor', 'social-engineering'
  unauthorizedActions: json("unauthorized_actions"), // List of actions performed
  privilegeLevel: text("privilege_level").notNull(), // 'user', 'admin', 'root', 'system'
  dataAccessLevel: text("data_access_level").notNull(), // 'public', 'internal', 'confidential', 'restricted'
  manipulationTechniques: json("manipulation_techniques"), // How the AI was manipulated
  victimUsers: json("victim_users"), // Users affected by the compromise
  controlDuration: integer("control_duration"), // Time in minutes the console was compromised
  preventionMeasures: json("prevention_measures"), // Countermeasures applied
  threatLevel: text("threat_level").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const userHarassmentDetection = pgTable("user_harassment_detection", {
  id: serial("id").primaryKey(),
  harassmentType: text("harassment_type").notNull(), // 'ai-impersonation', 'deepfake-harassment', 'voice-cloning', 'automated-stalking'
  victimIdentifier: text("victim_identifier").notNull(),
  perpetratorInfo: text("perpetrator_info"),
  aiToolsUsed: json("ai_tools_used"), // AI tools/services used for harassment
  harassmentContent: text("harassment_content").notNull(),
  platformsAffected: json("platforms_affected"), // Social media, messaging apps, etc.
  severityLevel: text("severity_level").notNull(), // 'low', 'medium', 'high', 'extreme'
  psychologicalImpact: text("psychological_impact"), // Assessment of victim impact
  evidenceLinks: json("evidence_links"), // URLs to evidence
  reportingSource: text("reporting_source"), // 'victim', 'witness', 'automated-detection', 'platform'
  actionsTaken: json("actions_taken"), // Responses and countermeasures
  legalStatus: text("legal_status").notNull().default("reported"), // 'reported', 'investigating', 'legal-action', 'resolved'
  blockchainEvidence: text("blockchain_evidence"), // Immutable evidence storage
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const blockchainAiIntegrity = pgTable("blockchain_ai_integrity", {
  id: serial("id").primaryKey(),
  blockchainNetwork: text("blockchain_network").notNull(), // 'ethereum', 'bitcoin', 'polygon', 'custom'
  contractAddress: text("contract_address"),
  aiSystemIdentifier: text("ai_system_identifier").notNull(),
  integrityHash: text("integrity_hash").notNull(),
  previousHash: text("previous_hash"),
  blockNumber: integer("block_number"),
  transactionId: text("transaction_id"),
  consensusStatus: text("consensus_status").notNull().default("pending"), // 'pending', 'confirmed', 'failed'
  validatorNodes: json("validator_nodes"), // Nodes that validated the integrity
  manipulationAttempts: json("manipulation_attempts"), // Detected tampering attempts
  integrityScore: integer("integrity_score").notNull(), // 0-100 blockchain-verified score
  smartContractEvents: json("smart_contract_events"), // Relevant contract events
  gasCost: integer("gas_cost"), // Cost of blockchain verification
  verificationProof: text("verification_proof"), // Cryptographic proof
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advancedThreatAnalysis = pgTable("advanced_threat_analysis", {
  id: serial("id").primaryKey(),
  threatCategory: text("threat_category").notNull(), // 'api-theft', 'console-hijacking', 'user-harassment', 'blockchain-manipulation'
  threatVector: text("threat_vector").notNull(),
  sophisticationLevel: text("sophistication_level").notNull(), // 'basic', 'intermediate', 'advanced', 'nation-state'
  attackPattern: json("attack_pattern"), // TTPs (Tactics, Techniques, Procedures)
  targetedAssets: json("targeted_assets"), // What was targeted
  geolocation: text("geolocation"), // Geographic origin of threat
  attributionConfidence: integer("attribution_confidence"), // 0-100 confidence in attribution
  predictiveIndicators: json("predictive_indicators"), // Early warning signs
  mitigationStrategies: json("mitigation_strategies"), // Recommended countermeasures
  businessImpact: text("business_impact").notNull(), // 'negligible', 'minor', 'moderate', 'major', 'catastrophic'
  recoveryTimeEstimate: integer("recovery_time_estimate"), // Hours to recover
  threatIntelligence: json("threat_intelligence"), // External threat data
  analysisConfidence: integer("analysis_confidence").notNull(), // 0-100 confidence in analysis
  analysisMethod: text("analysis_method").notNull(), // 'automated', 'manual', 'hybrid', 'ai-assisted'
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
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

export const insertApiTheftSchema = createInsertSchema(apiTheftMonitoring).omit({
  id: true,
  recoveryStatus: true,
  detectedAt: true,
});

export const insertAiConsoleControlSchema = createInsertSchema(aiConsoleControl).omit({
  id: true,
  threatLevel: true,
  detectedAt: true,
});

export const insertUserHarassmentSchema = createInsertSchema(userHarassmentDetection).omit({
  id: true,
  legalStatus: true,
  detectedAt: true,
});

export const insertBlockchainIntegritySchema = createInsertSchema(blockchainAiIntegrity).omit({
  id: true,
  consensusStatus: true,
  createdAt: true,
});

export const insertAdvancedThreatSchema = createInsertSchema(advancedThreatAnalysis).omit({
  id: true,
  analyzedAt: true,
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
export type ApiTheftMonitoring = typeof apiTheftMonitoring.$inferSelect;
export type InsertApiTheft = z.infer<typeof insertApiTheftSchema>;
export type AiConsoleControl = typeof aiConsoleControl.$inferSelect;
export type InsertAiConsoleControl = z.infer<typeof insertAiConsoleControlSchema>;
export type UserHarassmentDetection = typeof userHarassmentDetection.$inferSelect;
export type InsertUserHarassment = z.infer<typeof insertUserHarassmentSchema>;
export type BlockchainAiIntegrity = typeof blockchainAiIntegrity.$inferSelect;
export type InsertBlockchainIntegrity = z.infer<typeof insertBlockchainIntegritySchema>;
export type AdvancedThreatAnalysis = typeof advancedThreatAnalysis.$inferSelect;
export type InsertAdvancedThreat = z.infer<typeof insertAdvancedThreatSchema>;
