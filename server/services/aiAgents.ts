
interface AgentResponse {
  agentName: string;
  findings: string[];
  score: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface DPRContent {
  text: string;
  sections: {
    budget?: number;
    timeline?: number;
    specifications?: string;
    environmental?: string;
    safety?: string;
  };
}

export class MultiAgentSystem {
  private agents: AIAgent[];

  constructor() {
    this.agents = [
      new ComplianceAgent(),
      new FinancialAgent(),
      new RiskAgent(),
      new SummaryAgent()
    ];
  }

  async analyzeDPR(content: DPRContent): Promise<{
    agentResponses: AgentResponse[];
    overallAssessment: string;
    priorityActions: string[];
  }> {
    console.log('🤖 Multi-Agent Analysis Started');
    
    // Run agents in parallel for efficiency
    const agentPromises = this.agents.map(agent => 
      agent.analyze(content).catch(error => {
        console.error(`Agent ${agent.name} failed:`, error);
        return agent.getErrorResponse();
      })
    );

    const agentResponses = await Promise.all(agentPromises);
    
    // Agent coordination and consensus
    const consensus = this.buildConsensus(agentResponses);
    
    return {
      agentResponses,
      overallAssessment: consensus.assessment,
      priorityActions: consensus.actions
    };
  }

  private buildConsensus(responses: AgentResponse[]): {
    assessment: string;
    actions: string[];
  } {
    const highSeverityCount = responses.filter(r => r.severity === 'high').length;
    const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
    
    let assessment: string;
    if (highSeverityCount >= 2) {
      assessment = "🚨 CRITICAL: Multiple agents detected severe compliance issues. Immediate review required.";
    } else if (avgScore >= 80) {
      assessment = "✅ EXCELLENT: DPR meets high standards across all evaluation criteria.";
    } else if (avgScore >= 60) {
      assessment = "⚠️ ACCEPTABLE: DPR meets basic requirements but has areas for improvement.";
    } else {
      assessment = "❌ NEEDS REVISION: DPR requires significant improvements before approval.";
    }

    // Collect priority actions from all agents
    const allRecommendations = responses.flatMap(r => r.recommendations);
    const priorityActions = [...new Set(allRecommendations)].slice(0, 5);

    return { assessment, actions: priorityActions };
  }
}

abstract class AIAgent {
  abstract name: string;
  abstract analyze(content: DPRContent): Promise<AgentResponse>;
  
  getErrorResponse(): AgentResponse {
    return {
      agentName: this.name,
      findings: ['Analysis temporarily unavailable'],
      score: 50,
      severity: 'medium',
      recommendations: ['Manual review recommended']
    };
  }
}

class ComplianceAgent extends AIAgent {
  name = "Compliance Specialist";

  async analyze(content: DPRContent): Promise<AgentResponse> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 85;

    // Check for required sections
    if (!content.sections.environmental) {
      findings.push("Missing environmental impact assessment");
      recommendations.push("Include detailed environmental compliance documentation");
      score -= 15;
    }

    if (!content.sections.safety) {
      findings.push("Insufficient safety protocols documentation");
      recommendations.push("Add comprehensive safety management plan");
      score -= 10;
    }

    // Check for compliance keywords
    const complianceKeywords = ['approval', 'clearance', 'permit', 'authorization', 'compliance'];
    const keywordMatches = complianceKeywords.filter(keyword => 
      content.text.toLowerCase().includes(keyword)
    );

    if (keywordMatches.length < 3) {
      findings.push("Limited regulatory compliance documentation");
      score -= 8;
    }

    // Determine severity
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (score < 60) severity = 'high';
    else if (score < 75) severity = 'medium';

    if (findings.length === 0) {
      findings.push("All major compliance requirements appear to be addressed");
    }

    return {
      agentName: this.name,
      findings,
      score: Math.max(0, score),
      severity,
      recommendations
    };
  }
}

class FinancialAgent extends AIAgent {
  name = "Financial Analyst";

  async analyze(content: DPRContent): Promise<AgentResponse> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 80;

    const budget = content.sections.budget || 0;

    // Budget analysis
    if (!budget || budget <= 0) {
      findings.push("Budget information missing or incomplete");
      recommendations.push("Provide detailed budget breakdown with cost justifications");
      score -= 20;
    } else {
      // Check budget reasonableness
      if (budget > 10000000) { // 1 Crore
        findings.push("Budget exceeds typical project limits - requires special approval");
        recommendations.push("Include detailed cost-benefit analysis for high-value project");
        score -= 5;
      }

      if (budget < 100000) { // 1 Lakh
        findings.push("Budget appears unusually low for infrastructure project");
        recommendations.push("Verify all cost components are included");
        score -= 8;
      }
    }

    // Look for financial terms
    const financialTerms = ['cost', 'budget', 'expense', 'funding', 'allocation'];
    const termCount = financialTerms.filter(term => 
      content.text.toLowerCase().includes(term)
    ).length;

    if (termCount < 3) {
      findings.push("Limited financial documentation");
      score -= 10;
    }

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (score < 50) severity = 'high';
    else if (score < 70) severity = 'medium';

    if (findings.length === 0) {
      findings.push("Budget and financial planning appears adequate");
    }

    return {
      agentName: this.name,
      findings,
      score: Math.max(0, score),
      severity,
      recommendations
    };
  }
}

class RiskAgent extends AIAgent {
  name = "Risk Assessment Specialist";

  async analyze(content: DPRContent): Promise<AgentResponse> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 75;

    const timeline = content.sections.timeline || 0;

    // Timeline risk analysis
    if (timeline > 730) { // 2 years
      findings.push("Extended timeline increases project risk");
      recommendations.push("Consider phase-wise implementation to reduce timeline risks");
      score -= 10;
    }

    // Check for risk-related content
    const riskKeywords = ['risk', 'challenge', 'mitigation', 'contingency', 'delay'];
    const riskMentions = riskKeywords.filter(keyword => 
      content.text.toLowerCase().includes(keyword)
    );

    if (riskMentions.length < 2) {
      findings.push("Insufficient risk assessment documentation");
      recommendations.push("Include comprehensive risk analysis and mitigation strategies");
      score -= 15;
    }

    // Environmental risk factors
    const envRiskTerms = ['flood', 'earthquake', 'weather', 'monsoon', 'environmental'];
    const envRiskCount = envRiskTerms.filter(term => 
      content.text.toLowerCase().includes(term)
    ).length;

    if (envRiskCount === 0) {
      findings.push("Environmental risk factors not adequately addressed");
      recommendations.push("Include environmental risk assessment");
      score -= 8;
    }

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (score < 55) severity = 'high';
    else if (score < 70) severity = 'medium';

    if (findings.length === 0) {
      findings.push("Risk assessment appears comprehensive");
    }

    return {
      agentName: this.name,
      findings,
      score: Math.max(0, score),
      severity,
      recommendations
    };
  }
}

class SummaryAgent extends AIAgent {
  name = "Executive Summary Specialist";

  async analyze(content: DPRContent): Promise<AgentResponse> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 78;

    // Check document structure
    const sections = ['introduction', 'objective', 'scope', 'methodology', 'conclusion'];
    const foundSections = sections.filter(section => 
      content.text.toLowerCase().includes(section)
    );

    if (foundSections.length < 3) {
      findings.push("Document lacks clear organizational structure");
      recommendations.push("Include standard DPR sections: Introduction, Objectives, Scope, Implementation Plan");
      score -= 12;
    }

    // Check for executive summary
    if (!content.text.toLowerCase().includes('summary') && 
        !content.text.toLowerCase().includes('executive')) {
      findings.push("Missing executive summary section");
      recommendations.push("Add executive summary for quick decision-making reference");
      score -= 8;
    }

    // Document clarity check
    const wordCount = content.text.split(' ').length;
    if (wordCount < 500) {
      findings.push("Document appears too brief for comprehensive DPR");
      recommendations.push("Expand documentation with detailed project information");
      score -= 15;
    }

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (score < 60) severity = 'high';
    else if (score < 75) severity = 'medium';

    if (findings.length === 0) {
      findings.push("Document structure and presentation is well-organized");
    }

    return {
      agentName: this.name,
      findings,
      score: Math.max(0, score),
      severity,
      recommendations
    };
  }
}
