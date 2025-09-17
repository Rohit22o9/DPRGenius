
import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { RecentAnalyses } from '@/components/RecentAnalyses';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskIndicator } from '@/components/RiskIndicator';
import { useLanguage, LanguageContext, useLanguageProvider } from '@/hooks/useLanguage';
import { CheckCircle, AlertTriangle, TrendingUp, Upload, Activity, Shield, FileText, BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalAnalyzed: number;
  compliant: number;
  highRisk: number;
  avgScore: number;
}

// Home Overview Section
function HomeSection({ stats, isLoadingStats }: { stats: DashboardStats; isLoadingStats: boolean }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 border-0 shadow-xl">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome to {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered system for comprehensive DPR quality assessment, 
            compliance verification, and risk analysis for infrastructure projects.
          </p>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-xl mr-4">
              <Upload className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('totalAnalyzed')}</p>
              <p className="text-3xl font-bold text-foreground">
                {isLoadingStats ? '-' : stats.totalAnalyzed.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Documents processed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-xl mr-4">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('compliantDprs')}</p>
              <p className="text-3xl font-bold text-foreground">
                {isLoadingStats ? '-' : stats.compliant.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Meeting standards</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-warning">
          <div className="flex items-center">
            <div className="p-3 bg-warning/10 rounded-xl mr-4">
              <AlertTriangle className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('highRiskDprs')}</p>
              <p className="text-3xl font-bold text-foreground">
                {isLoadingStats ? '-' : stats.highRisk.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary">
          <div className="flex items-center">
            <div className="p-3 bg-secondary/10 rounded-xl mr-4">
              <TrendingUp className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('avgScore')}</p>
              <p className="text-3xl font-bold text-foreground">
                {isLoadingStats ? '-' : `${stats.avgScore}%`}
              </p>
              <p className="text-xs text-muted-foreground">Quality rating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Activity className="mr-2 text-primary" size={20} />
            {t('systemStatus')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="flex items-center text-sm font-medium">
                <Shield className="mr-2 text-primary" size={16} />
                {t('aiModel')}
              </span>
              <span className="flex items-center text-sm font-medium text-success">
                <RiskIndicator level="low" />
                {t('online')}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="flex items-center text-sm font-medium">
                <FileText className="mr-2 text-primary" size={16} />
                {t('database')}
              </span>
              <span className="flex items-center text-sm font-medium text-success">
                <RiskIndicator level="low" />
                {t('connected')}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="flex items-center text-sm font-medium">
                <BarChart3 className="mr-2 text-primary" size={16} />
                {t('apiStatus')}
              </span>
              <span className="flex items-center text-sm font-medium text-success">
                <RiskIndicator level="low" />
                {t('active')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New DPR analyzed</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System health check completed</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Compliance report generated</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Risk Dashboard Section
function RiskDashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Risk Assessment Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive risk analysis and monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <RiskIndicator level="low" />
                <span className="font-medium">Low Risk</span>
              </div>
              <span className="text-2xl font-bold text-green-600">65%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center">
                <RiskIndicator level="medium" />
                <span className="font-medium">Medium Risk</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">25%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center">
                <RiskIndicator level="high" />
                <span className="font-medium">High Risk</span>
              </div>
              <span className="text-2xl font-bold text-red-600">10%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Categories</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Environmental Compliance</span>
              <span className="text-sm text-warning font-semibold">Medium</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Budget Accuracy</span>
              <span className="text-sm text-success font-semibold">Low</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Technical Specifications</span>
              <span className="text-sm text-destructive font-semibold">High</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Legal Documentation</span>
              <span className="text-sm text-success font-semibold">Low</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalAnalyzed: 0, compliant: 0, highRisk: 0, avgScore: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleUploadStart = (analysisId: string) => {
    setCurrentAnalysisId(analysisId);
    setActiveTab('results');
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysisId(null);
    setActiveTab('upload');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection stats={stats} isLoadingStats={isLoadingStats} />;
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <FileUpload onUploadStart={handleUploadStart} />
          </div>
        );
      case 'results':
        return (
          <div className="max-w-6xl mx-auto">
            {currentAnalysisId ? (
              <AnalysisResults analysisId={currentAnalysisId} onNewAnalysis={handleNewAnalysis} />
            ) : (
              <Card className="p-8 text-center">
                <AlertTriangle className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-muted-foreground mb-4">Upload a DPR document to see analysis results</p>
                <Button onClick={() => setActiveTab('upload')}>Upload Document</Button>
              </Card>
            )}
          </div>
        );
      case 'risks':
        return <RiskDashboard />;
      case 'reports':
        return <RecentAnalyses />;
      default:
        return <HomeSection stats={stats} isLoadingStats={isLoadingStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="animate-fadeIn">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const languageProviderValue = useLanguageProvider();

  return (
    <LanguageContext.Provider value={languageProviderValue}>
      <DashboardContent />
    </LanguageContext.Provider>
  );
}
