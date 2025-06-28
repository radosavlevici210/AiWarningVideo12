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

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type VideoJob = typeof videoJobs.$inferSelect;
export type InsertVideoJob = z.infer<typeof insertVideoJobSchema>;
