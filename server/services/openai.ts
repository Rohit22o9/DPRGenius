
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-demo'
});

export interface AnalysisResult {
  overallScore: number;
  completenessScore: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: Array<{
    category: string;
    description: string;
    level: 'low' | 'medium' | 'high';
    probability: number;
  }>;
  complianceIssues: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  analysisData: {
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
  };
}

export async function analyzeDprContent(extractedText: string, filename: string): Promise<AnalysisResult> {
  try {
    // If OpenAI API key is available, use OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-demo') {
      return await analyzeWithOpenAI(extractedText, filename);
    } else {
      // Fallback to local analysis
      console.log('Using local analysis system (no OpenAI API key provided)');
      return await analyzeLocally(extractedText, filename);
    }
  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

async function analyzeWithOpenAI(extractedText: string, filename: string): Promise<AnalysisResult> {
  const prompt = `
Analyze this DPR (Detailed Project Report) document and provide a comprehensive assessment:

Document: ${filename}
Content: ${extractedText.substring(0, 8000)} ${extractedText.length > 8000 ? '...(truncated)' : ''}

Please analyze and return a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "completenessScore": number (0-100),
  "complianceScore": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "riskFactors": [
    {
      "category": "string",
      "description": "string",
      "level": "low" | "medium" | "high",
      "probability": number (0-100)
    }
  ],
  "complianceIssues": [
    {
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "analysisData": {
    "sections": {
      "technicalSpecs": number (0-100),
      "budgetDetails": number (0-100),
      "timeline": number (0-100),
      "environmental": number (0-100),
      "safety": number (0-100),
      "legalCompliance": number (0-100)
    },
    "detailedFindings": ["string"],
    "recommendations": ["string"],
    "missingElements": ["string"]
  }
}

Focus on:
1. Technical specifications completeness
2. Budget and financial details
3. Project timeline and milestones
4. Environmental impact assessment
5. Safety protocols and measures
6. Legal and regulatory compliance
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert DPR (Detailed Project Report) analyst. Analyze documents thoroughly and provide detailed assessments in valid JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const result = JSON.parse(content);
    return validateAndNormalizeResult(result);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    throw new Error('Invalid response format from OpenAI');
  }
}

async function analyzeLocally(extractedText: string, filename: string): Promise<AnalysisResult> {
  // Local analysis implementation
  const text = extractedText.toLowerCase();
  const sections = {
    technicalSpecs: analyzeSection(text, ['technical', 'specification', 'design', 'architecture', 'system']),
    budgetDetails: analyzeSection(text, ['budget', 'cost', 'financial', 'expense', 'fund', 'money', 'price']),
    timeline: analyzeSection(text, ['timeline', 'schedule', 'deadline', 'milestone', 'phase', 'duration']),
    environmental: analyzeSection(text, ['environment', 'impact', 'sustainability', 'eco', 'green', 'pollution']),
    safety: analyzeSection(text, ['safety', 'security', 'risk', 'hazard', 'protection', 'precaution']),
    legalCompliance: analyzeSection(text, ['legal', 'compliance', 'regulation', 'law', 'policy', 'standard'])
  };

  const completenessScore = Object.values(sections).reduce((sum, score) => sum + score, 0) / Object.values(sections).length;
  const overallScore = Math.min(completenessScore + Math.random() * 10, 100);
  const complianceScore = sections.legalCompliance + Math.random() * 20;

  const riskLevel = overallScore >= 75 ? 'low' : overallScore >= 50 ? 'medium' : 'high';

  const riskFactors = [];
  const complianceIssues = [];
  const detailedFindings = [];
  const recommendations = [];
  const missingElements = [];

  // Generate findings based on section scores
  Object.entries(sections).forEach(([section, score]) => {
    if (score < 50) {
      missingElements.push(`${section} section needs improvement`);
      recommendations.push(`Enhance ${section} documentation`);
    } else if (score < 75) {
      detailedFindings.push(`${section} section is partially complete`);
    } else {
      detailedFindings.push(`${section} section is well documented`);
    }
  });

  // Add risk factors based on low scores
  if (sections.safety < 60) {
    riskFactors.push({
      category: 'Safety Concerns',
      description: 'Safety documentation appears incomplete',
      level: 'medium' as const,
      probability: 70
    });
  }

  if (sections.legalCompliance < 70) {
    complianceIssues.push({
      title: 'Compliance Documentation',
      description: 'Legal compliance section may need additional details',
      severity: 'medium' as const
    });
  }

  return {
    overallScore: Math.round(overallScore),
    completenessScore: Math.round(completenessScore),
    complianceScore: Math.round(complianceScore),
    riskLevel,
    riskFactors,
    complianceIssues,
    analysisData: {
      sections,
      detailedFindings,
      recommendations,
      missingElements
    }
  };
}

function analyzeSection(text: string, keywords: string[]): number {
  let score = 0;
  let keywordCount = 0;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) {
      keywordCount += matches.length;
    }
  });
  
  // Base score on keyword frequency and text length
  const textLength = text.length;
  const density = keywordCount / (textLength / 1000); // keywords per 1000 characters
  
  if (density > 5) score = 90 + Math.random() * 10;
  else if (density > 3) score = 70 + Math.random() * 20;
  else if (density > 1) score = 50 + Math.random() * 20;
  else if (density > 0.5) score = 30 + Math.random() * 20;
  else score = Math.random() * 30;
  
  return Math.min(Math.round(score), 100);
}

function validateAndNormalizeResult(result: any): AnalysisResult {
  // Ensure all required fields exist with default values
  return {
    overallScore: Math.min(Math.max(result.overallScore || 0, 0), 100),
    completenessScore: Math.min(Math.max(result.completenessScore || 0, 0), 100),
    complianceScore: Math.min(Math.max(result.complianceScore || 0, 0), 100),
    riskLevel: ['low', 'medium', 'high'].includes(result.riskLevel) ? result.riskLevel : 'medium',
    riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [],
    complianceIssues: Array.isArray(result.complianceIssues) ? result.complianceIssues : [],
    analysisData: {
      sections: {
        technicalSpecs: Math.min(Math.max(result.analysisData?.sections?.technicalSpecs || 0, 0), 100),
        budgetDetails: Math.min(Math.max(result.analysisData?.sections?.budgetDetails || 0, 0), 100),
        timeline: Math.min(Math.max(result.analysisData?.sections?.timeline || 0, 0), 100),
        environmental: Math.min(Math.max(result.analysisData?.sections?.environmental || 0, 0), 100),
        safety: Math.min(Math.max(result.analysisData?.sections?.safety || 0, 0), 100),
        legalCompliance: Math.min(Math.max(result.analysisData?.sections?.legalCompliance || 0, 0), 100)
      },
      detailedFindings: Array.isArray(result.analysisData?.detailedFindings) ? result.analysisData.detailedFindings : [],
      recommendations: Array.isArray(result.analysisData?.recommendations) ? result.analysisData.recommendations : [],
      missingElements: Array.isArray(result.analysisData?.missingElements) ? result.analysisData.missingElements : []
    }
  };
}
