import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzeDprContent } from "./services/openai";
import { extractTextFromFile, validateDprFile } from "./services/pdfParser";
import { insertDprAnalysisSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    try {
      validateDprFile(file.originalname, file.size || 0, file.mimetype);
      cb(null, true);
    } catch (error) {
      cb(error as Error, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const recentAnalyses = await storage.getRecentAnalyses(100);
      const totalAnalyzed = recentAnalyses.length;
      const compliant = recentAnalyses.filter(a => (a.complianceScore || 0) >= 80).length;
      const highRisk = recentAnalyses.filter(a => a.riskLevel === 'high').length;
      const avgScore = recentAnalyses.length > 0 
        ? recentAnalyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / recentAnalyses.length 
        : 0;

      res.json({
        totalAnalyzed,
        compliant,
        highRisk,
        avgScore: Math.round(avgScore * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Upload and analyze DPR
  app.post("/api/analyze", upload.single('dprFile'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { originalname, buffer, size, mimetype } = req.file;
      const language = req.body.language || 'en';

      // Validate file
      validateDprFile(originalname, size, mimetype);

      // Create initial analysis record
      const analysisData = {
        filename: originalname,
        fileType: mimetype,
        fileSize: size,
        status: 'processing',
        language
      };

      const analysis = await storage.createDprAnalysis(analysisData);

      // Start async analysis
      processAnalysis(analysis.id, buffer, originalname, mimetype)
        .catch(error => {
          console.error('Analysis processing failed:', error);
          storage.updateDprAnalysis(analysis.id, { 
            status: 'failed',
            analysisData: { 
              sections: { technicalSpecs: 0, budgetDetails: 0, timeline: 0, environmental: 0, safety: 0, legalCompliance: 0 },
              detailedFindings: [`Analysis failed: ${error.message}`],
              recommendations: [],
              missingElements: []
            }
          });
        });

      res.json({ 
        analysisId: analysis.id,
        message: 'File uploaded successfully. Analysis in progress.',
        status: 'processing'
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get analysis result
  app.get("/api/analysis/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getDprAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({ message: 'Failed to fetch analysis' });
    }
  });

  // Get recent analyses
  app.get("/api/recent", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getRecentAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      res.status(500).json({ message: 'Failed to fetch recent analyses' });
    }
  });

  // Delete analysis
  app.delete("/api/analysis/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDprAnalysis(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      res.json({ message: 'Analysis deleted successfully' });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      res.status(500).json({ message: 'Failed to delete analysis' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Async function to process the analysis
async function processAnalysis(analysisId: string, buffer: Buffer, filename: string, mimetype: string) {
  try {
    // Extract text from file
    const extractedText = await extractTextFromFile(buffer, mimetype);
    
    // Analyze with OpenAI
    const analysisResult = await analyzeDprContent(extractedText, filename);
    
    // Update analysis with results
    await storage.updateDprAnalysis(analysisId, {
      status: 'completed',
      analyzedAt: new Date(),
      extractedText,
      overallScore: analysisResult.overallScore,
      completenessScore: analysisResult.completenessScore,
      complianceScore: analysisResult.complianceScore,
      riskLevel: analysisResult.riskLevel,
      riskFactors: analysisResult.riskFactors,
      complianceIssues: analysisResult.complianceIssues,
      analysisData: analysisResult.analysisData
    });

    console.log(`Analysis completed for ${filename} (ID: ${analysisId})`);
  } catch (error) {
    console.error(`Analysis failed for ${filename}:`, error);
    await storage.updateDprAnalysis(analysisId, {
      status: 'failed',
      analysisData: {
        sections: { technicalSpecs: 0, budgetDetails: 0, timeline: 0, environmental: 0, safety: 0, legalCompliance: 0 },
        detailedFindings: [`Analysis failed: ${error.message}`],
        recommendations: [],
        missingElements: []
      }
    });
  }
}
