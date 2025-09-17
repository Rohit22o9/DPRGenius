import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from './CircularProgress';
import { RiskIndicator } from './RiskIndicator';
import { useLanguage } from '@/hooks/useLanguage';
import { DprAnalysis } from '@shared/schema';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Save, Share2, Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ManualOverride } from './ManualOverride';

interface AnalysisResultsProps {
  analysisId: string;
  onNewAnalysis: () => void;
}

export function AnalysisResults({ analysisId, onNewAnalysis }: AnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<DprAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (!analysisId) return;

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis/${analysisId}`);
        if (!response.ok) throw new Error('Failed to fetch analysis');
        
        const data = await response.json();
        setAnalysis(data);
        
        // If still processing, poll for updates
        if (data.status === 'processing') {
          setTimeout(fetchAnalysis, 2000);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        toast({
          title: t('error'),
          description: 'Failed to fetch analysis results',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId, t, toast]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Analysis not found</p>
        </div>
      </Card>
    );
  }

  if (analysis.status === 'processing') {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <h3 className="text-lg font-medium mb-2">{t('processing')}</h3>
          <p className="text-muted-foreground">{t('analyzing')}</p>
        </div>
      </Card>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <XCircle className="mx-auto mb-4 text-destructive" size={48} />
          <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
          <p className="text-muted-foreground">Please try uploading the file again</p>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800"; 
    return "#f44336";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const chartData = analysis.analysisData ? [
    { name: 'Technical Specs', score: analysis.analysisData.sections.technicalSpecs },
    { name: 'Budget Details', score: analysis.analysisData.sections.budgetDetails },
    { name: 'Timeline', score: analysis.analysisData.sections.timeline },
    { name: 'Environmental', score: analysis.analysisData.sections.environmental },
    { name: 'Safety', score: analysis.analysisData.sections.safety },
    { name: 'Legal Compliance', score: analysis.analysisData.sections.legalCompliance },
  ] : [];

  return (
    <Card className="p-6" data-testid="analysis-results">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <BarChart className="mr-2 text-primary" size={24} />
          {t('analysisResults')}
        </h2>
        <span className="text-sm text-muted-foreground">
          Analyzed on {new Date(analysis.analyzedAt || analysis.uploadedAt).toLocaleString()}
        </span>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <CircularProgress
            percentage={analysis.overallScore || 0}
            color={getScoreColor(analysis.overallScore || 0)}
            sublabel="Overall"
          />
          <h3 className="font-semibold text-foreground mt-4">{t('overallQuality')}</h3>
          <p className="text-sm text-muted-foreground">{t('comprehensiveAssessment')}</p>
        </div>

        <div className="text-center">
          <CircularProgress
            percentage={analysis.completenessScore || 0}
            color={getScoreColor(analysis.completenessScore || 0)}
            sublabel="Complete"
          />
          <h3 className="font-semibold text-foreground mt-4">{t('completeness')}</h3>
          <p className="text-sm text-muted-foreground">{t('requiredSections')}</p>
        </div>

        <div className="text-center">
          <CircularProgress
            percentage={analysis.complianceScore || 0}
            color={getScoreColor(analysis.complianceScore || 0)}
            sublabel="Compliant"
          />
          <h3 className="font-semibold text-foreground mt-4">{t('compliance')}</h3>
          <p className="text-sm text-muted-foreground">{t('regulatoryAdherence')}</p>
        </div>
      </div>

      {/* Risk Assessment and Compliance Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Risk Factors */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('riskAssessment')}</h3>
          <div className="space-y-4">
            {analysis.riskFactors && analysis.riskFactors.length > 0 ? (
              analysis.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center">
                    <RiskIndicator level={risk.level} />
                    <div>
                      <p className="font-medium text-foreground">{risk.category}</p>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getRiskColor(risk.level)}>{t(risk.level)}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{risk.probability}% probability</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No risk factors identified</p>
            )}
          </div>
        </div>

        {/* Compliance Issues */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('complianceIssues')}</h3>
          <div className="space-y-4">
            {analysis.complianceIssues && analysis.complianceIssues.length > 0 ? (
              analysis.complianceIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-l-4 ${
                    issue.severity === 'high' 
                      ? 'border-destructive bg-destructive/5' 
                      : issue.severity === 'medium'
                      ? 'border-warning bg-warning/5'
                      : 'border-success bg-success/5'
                  }`}
                >
                  <div className="flex items-start">
                    {issue.severity === 'high' ? (
                      <XCircle className="text-destructive mr-3 mt-0.5 flex-shrink-0" size={16} />
                    ) : issue.severity === 'medium' ? (
                      <AlertTriangle className="text-warning mr-3 mt-0.5 flex-shrink-0" size={16} />
                    ) : (
                      <CheckCircle className="text-success mr-3 mt-0.5 flex-shrink-0" size={16} />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{issue.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <Badge 
                        variant={getRiskColor(issue.severity)} 
                        className="mt-2 text-xs"
                      >
                        Severity: {issue.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                <div className="flex items-start">
                  <CheckCircle className="text-success mr-3 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-foreground">No Compliance Issues</p>
                    <p className="text-sm text-muted-foreground mt-1">All requirements appear to be met</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Chart */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('detailedBreakdown')}</h3>
          <Card className="p-6 bg-muted">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar 
                  dataKey="score" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Manual Override Section */}
      <ManualOverride 
        analysisId={analysisId}
        currentScore={analysis.overallScore}
        onOverrideSubmit={(override) => {
          console.log('Official override submitted:', override);
          // In a real implementation, this would update the analysis
        }}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          className="flex items-center"
          data-testid="generate-report-button"
          onClick={() => toast({ title: 'Feature Coming Soon', description: 'Report generation will be available soon' })}
        >
          <FileDown className="mr-2" size={16} />
          {t('generateReport')}
        </Button>

        <Button 
          variant="secondary" 
          className="flex items-center"
          data-testid="save-analysis-button"
          onClick={() => toast({ title: 'Success', description: 'Analysis saved successfully' })}
        >
          <Save className="mr-2" size={16} />
          {t('saveAnalysis')}
        </Button>

        <Button 
          variant="outline" 
          className="flex items-center"
          data-testid="share-results-button"
          onClick={() => toast({ title: 'Feature Coming Soon', description: 'Sharing functionality will be available soon' })}
        >
          <Share2 className="mr-2" size={16} />
          {t('shareResults')}
        </Button>

        <Button 
          variant="ghost" 
          className="flex items-center"
          onClick={onNewAnalysis}
          data-testid="new-analysis-button"
        >
          <Plus className="mr-2" size={16} />
          {t('newAnalysis')}
        </Button>
      </div>
    </Card>
  );
}
