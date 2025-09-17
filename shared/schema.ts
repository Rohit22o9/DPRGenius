import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dprAnalyses = pgTable("dpr_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  analyzedAt: timestamp("analyzed_at"),
  status: text("status").notNull().default('processing'), // processing, completed, failed
  
  // Analysis results
  overallScore: integer("overall_score"),
  completenessScore: integer("completeness_score"),
  complianceScore: integer("compliance_score"),
  
  // Risk assessment
  riskLevel: text("risk_level"), // low, medium, high
  riskFactors: jsonb("risk_factors").$type<RiskFactor[]>(),
  complianceIssues: jsonb("compliance_issues").$type<ComplianceIssue[]>(),
  
  // Raw analysis data
  extractedText: text("extracted_text"),
  analysisData: jsonb("analysis_data").$type<AnalysisData>(),
  
  // Metadata
  language: text("language").default('en'),
  createdBy: varchar("created_by").references(() => users.id),
});

export interface RiskFactor {
  category: string;
  description: string;
  level: 'low' | 'medium' | 'high';
  probability: number;
  impact: string;
}

export interface ComplianceIssue {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  section: string;
  recommendation: string;
}

export interface AnalysisData {
  sections: {
    technicalSpecs: number;
    budgetDetails: number;
    timeline: number;
    environmental: number;
    safety: number;
    legalCompliance: number;
  };
  detailedFindings: string[];
  recommendations: string[];
  missingElements: string[];
}

export const insertDprAnalysisSchema = createInsertSchema(dprAnalyses).omit({
  id: true,
  uploadedAt: true,
  analyzedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertDprAnalysis = z.infer<typeof insertDprAnalysisSchema>;
export type DprAnalysis = typeof dprAnalyses.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
