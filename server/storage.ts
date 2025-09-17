import { type User, type InsertUser, type DprAnalysis, type InsertDprAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // DPR Analysis methods
  createDprAnalysis(analysis: InsertDprAnalysis): Promise<DprAnalysis>;
  getDprAnalysis(id: string): Promise<DprAnalysis | undefined>;
  updateDprAnalysis(id: string, analysis: Partial<DprAnalysis>): Promise<DprAnalysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<DprAnalysis[]>;
  deleteDprAnalysis(id: string): Promise<boolean>;
  getAnalysesByStatus(status: string): Promise<DprAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dprAnalyses: Map<string, DprAnalysis>;

  constructor() {
    this.users = new Map();
    this.dprAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDprAnalysis(insertAnalysis: InsertDprAnalysis): Promise<DprAnalysis> {
    const id = randomUUID();
    const analysis: DprAnalysis = {
      ...insertAnalysis,
      id,
      status: insertAnalysis.status || 'processing',
      uploadedAt: new Date(),
      analyzedAt: null,
      overallScore: null,
      completenessScore: null,
      complianceScore: null,
      riskLevel: null,
      riskFactors: null,
      complianceIssues: null,
      extractedText: null,
      analysisData: null,
      language: insertAnalysis.language || 'en',
      createdBy: null,
    };
    this.dprAnalyses.set(id, analysis);
    return analysis;
  }

  async getDprAnalysis(id: string): Promise<DprAnalysis | undefined> {
    return this.dprAnalyses.get(id);
  }

  async updateDprAnalysis(id: string, updates: Partial<DprAnalysis>): Promise<DprAnalysis | undefined> {
    const existing = this.dprAnalyses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.dprAnalyses.set(id, updated);
    return updated;
  }

  async getRecentAnalyses(limit: number = 10): Promise<DprAnalysis[]> {
    return Array.from(this.dprAnalyses.values())
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, limit);
  }

  async deleteDprAnalysis(id: string): Promise<boolean> {
    return this.dprAnalyses.delete(id);
  }

  async getAnalysesByStatus(status: string): Promise<DprAnalysis[]> {
    return Array.from(this.dprAnalyses.values())
      .filter(analysis => analysis.status === status);
  }
}

export const storage = new MemStorage();
