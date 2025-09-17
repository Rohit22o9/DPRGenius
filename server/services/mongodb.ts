import { MongoClient, Db, Collection } from 'mongodb';
import { DprAnalysis, User } from '@shared/schema';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor() {
    const uri = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb+srv://<your_username>:<your_password>@cluster0.l4v0ldu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('MongoDB client not initialized');
      }
      
      await this.client.connect();
      this.db = this.client.db('mdoner_dpr_system');
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }

  private getCollection<T>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  // DPR Analysis operations
  async createDprAnalysis(analysis: Omit<DprAnalysis, 'id'>): Promise<DprAnalysis> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    const id = new Date().getTime().toString(); // Simple ID generation
    const document = { ...analysis, id };
    
    await collection.insertOne(document as any);
    return document;
  }

  async getDprAnalysis(id: string): Promise<DprAnalysis | null> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    return await collection.findOne({ id });
  }

  async updateDprAnalysis(id: string, updates: Partial<DprAnalysis>): Promise<DprAnalysis | null> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result;
  }

  async getRecentAnalyses(limit: number = 10): Promise<DprAnalysis[]> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    return await collection.find({})
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async deleteDprAnalysis(id: string): Promise<boolean> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async getAnalysesByStatus(status: string): Promise<DprAnalysis[]> {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    return await collection.find({ status }).toArray();
  }

  // Stats operations
  async getAnalyticsStats() {
    const collection = this.getCollection<DprAnalysis>('dpr_analyses');
    
    const totalAnalyzed = await collection.countDocuments({});
    const compliant = await collection.countDocuments({ complianceScore: { $gte: 80 } });
    const highRisk = await collection.countDocuments({ riskLevel: 'high' });
    
    // Calculate average score
    const avgScoreResult = await collection.aggregate([
      { $match: { overallScore: { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]).toArray();
    
    const avgScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    return {
      totalAnalyzed,
      compliant,
      highRisk,
      avgScore: Math.round(avgScore * 10) / 10
    };
  }
}

export const mongoService = new MongoDBService();
