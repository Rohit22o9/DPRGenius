import OpenAI from "openai";
import { AnalysisData, RiskFactor, ComplianceIssue } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY || "your_api_key_here" 
});

export interface DprAnalysisResult {
  overallScore: number;
  completenessScore: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: RiskFactor[];
  complianceIssues: ComplianceIssue[];
  analysisData: AnalysisData;
}

// Fallback analysis when OpenAI is unavailable
function createFallbackAnalysis(text: string, filename: string): DprAnalysisResult {
  // Basic analysis based on text content
  const hasbudget = /budget|cost|financial|amount|rs|rupees|\$|money/i.test(text);
  const hasTimeline = /timeline|schedule|phase|month|year|duration|time/i.test(text);
  const hasTechnical = /technical|specification|engineering|design|material/i.test(text);
  const hasEnvironmental = /environment|clearance|forest|ecology|green|pollution/i.test(text);
  const hasSafety = /safety|security|risk|emergency|protocol/i.test(text);
  const hasLegal = /legal|compliance|approval|permit|clearance|authority/i.test(text);
  
  const sections = {
    technicalSpecs: hasTechnical ? 75 : 45,
    budgetDetails: hasbudget ? 80 : 35,
    timeline: hasTimeline ? 70 : 40,
    environmental: hasEnvironmental ? 85 : 25,
    safety: hasSafety ? 70 : 30,
    legalCompliance: hasLegal ? 75 : 35
  };
  
  const overallScore = Math.round(Object.values(sections).reduce((a, b) => a + b, 0) / 6);
  const completenessScore = Math.min(95, overallScore + 10);
  const complianceScore = sections.legalCompliance;
  
  const riskFactors: RiskFactor[] = [];
  const complianceIssues: ComplianceIssue[] = [];
  
  if (!hasbudget) {
    riskFactors.push({
      category: "Budget Analysis",
      description: "Limited budget information detected",
      level: "medium",
      probability: 60,
      impact: "May require additional financial verification"
    });
  }
  
  if (!hasTimeline) {
    complianceIssues.push({
      title: "Timeline Documentation",
      description: "Project timeline information appears incomplete",
      severity: "medium",
      section: "Project Planning",
      recommendation: "Include detailed project phases and milestones"
    });
  }
  
  if (!hasEnvironmental) {
    complianceIssues.push({
      title: "Environmental Clearance",
      description: "Environmental impact assessment not clearly documented",
      severity: "high",
      section: "Environmental Compliance",
      recommendation: "Ensure environmental clearance documentation is complete"
    });
  }
  
  return {
    overallScore,
    completenessScore,
    complianceScore,
    riskLevel: overallScore >= 70 ? 'low' : overallScore >= 50 ? 'medium' : 'high',
    riskFactors,
    complianceIssues,
    analysisData: {
      sections,
      detailedFindings: [
        `Document contains ${text.length} characters of content`,
        `Analysis completed using fallback system`,
        hasbudget ? "Budget information detected" : "Limited budget details found",
        hasTimeline ? "Timeline information present" : "Timeline details may need enhancement"
      ],
      recommendations: [
        "Consider adding more detailed technical specifications",
        "Ensure all regulatory approvals are documented",
        "Include comprehensive risk mitigation strategies"
      ],
      missingElements: [
        ...(!hasbudget ? ["Detailed budget breakdown"] : []),
        ...(!hasEnvironmental ? ["Environmental impact assessment"] : []),
        ...(!hasSafety ? ["Safety protocols and procedures"] : [])
      ]
    }
  };
}

export async function analyzeDprContent(text: string, filename: string): Promise<DprAnalysisResult> {
  try {
    const prompt = `
You are an expert DPR (Detailed Project Report) analyst for the Ministry of Development of North Eastern Region (MDoNER). 
Analyze the following DPR content and provide a comprehensive assessment.

DOCUMENT: ${filename}
CONTENT: ${text}

Please analyze this DPR and return a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "completenessScore": number (0-100), 
  "complianceScore": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "riskFactors": [
    {
      "category": string,
      "description": string,
      "level": "low" | "medium" | "high",
      "probability": number (0-100),
      "impact": string
    }
  ],
  "complianceIssues": [
    {
      "title": string,
      "description": string,
      "severity": "low" | "medium" | "high",
      "section": string,
      "recommendation": string
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
    "detailedFindings": [string],
    "recommendations": [string],
    "missingElements": [string]
  }
}

Evaluation Criteria:
1. Technical Specifications: Check for detailed engineering specifications, design parameters, material requirements
2. Budget Details: Verify cost breakdown, financial projections, funding sources
3. Timeline: Assess project phases, milestones, realistic timeframes
4. Environmental Impact: Look for environmental clearances, impact assessments
5. Safety Measures: Check safety protocols, risk mitigation plans
6. Legal Compliance: Verify regulatory approvals, statutory requirements

Risk Assessment:
- Budget variance risks (cost overruns)
- Timeline feasibility (delays)
- Resource availability
- Environmental compliance
- Technical complexity
- Regulatory approvals

Compliance Issues:
- Missing mandatory sections
- Incomplete documentation
- Regulatory non-compliance
- Budget discrepancies
- Timeline inconsistencies
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert DPR analyst. Provide detailed, accurate analysis in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize the response
    return {
      overallScore: Math.max(0, Math.min(100, result.overallScore || 0)),
      completenessScore: Math.max(0, Math.min(100, result.completenessScore || 0)),
      complianceScore: Math.max(0, Math.min(100, result.complianceScore || 0)),
      riskLevel: ['low', 'medium', 'high'].includes(result.riskLevel) ? result.riskLevel : 'medium',
      riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [],
      complianceIssues: Array.isArray(result.complianceIssues) ? result.complianceIssues : [],
      analysisData: {
        sections: {
          technicalSpecs: Math.max(0, Math.min(100, result.analysisData?.sections?.technicalSpecs || 0)),
          budgetDetails: Math.max(0, Math.min(100, result.analysisData?.sections?.budgetDetails || 0)),
          timeline: Math.max(0, Math.min(100, result.analysisData?.sections?.timeline || 0)),
          environmental: Math.max(0, Math.min(100, result.analysisData?.sections?.environmental || 0)),
          safety: Math.max(0, Math.min(100, result.analysisData?.sections?.safety || 0)),
          legalCompliance: Math.max(0, Math.min(100, result.analysisData?.sections?.legalCompliance || 0)),
        },
        detailedFindings: Array.isArray(result.analysisData?.detailedFindings) ? result.analysisData.detailedFindings : [],
        recommendations: Array.isArray(result.analysisData?.recommendations) ? result.analysisData.recommendations : [],
        missingElements: Array.isArray(result.analysisData?.missingElements) ? result.analysisData.missingElements : [],
      }
    };
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    console.log('Falling back to local analysis system...');
    
    // Return fallback analysis instead of throwing error
    return createFallbackAnalysis(text, filename);
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage === 'hi' ? 'Hindi' : targetLanguage === 'as' ? 'Assamese' : 'English'}. Maintain technical terminology accuracy.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1,
    });

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Return original text if translation fails
  }
}
