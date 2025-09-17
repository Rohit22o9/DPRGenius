import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { RecentAnalyses } from '@/components/RecentAnalyses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskIndicator } from '@/components/RiskIndicator';
import { useLanguage, LanguageContext, useLanguageProvider } from '@/hooks/useLanguage';
import { Language } from '@/lib/i18n';
import { Upload, CheckCircle, AlertTriangle, TrendingUp, History, Download, Settings, User } from 'lucide-react';

interface DashboardStats {
  totalAnalyzed: number;
  compliant: number;
  highRisk: number;
  avgScore: number;
}

function DashboardContent() {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalAnalyzed: 0, compliant: 0, highRisk: 0, avgScore: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { t, language, setLanguage } = useLanguage();

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
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysisId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground" data-testid="app-title">
                  {t('title')}
                </h1>
                <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-32" data-testid="language-selector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="as">অসমীয়া</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User size={16} />
                <span>Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="text-2xl text-primary" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('totalAnalyzed')}</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="stat-total-analyzed">
                  {isLoadingStats ? '-' : stats.totalAnalyzed.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="text-2xl text-success" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('compliantDprs')}</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="stat-compliant">
                  {isLoadingStats ? '-' : stats.compliant.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-2xl text-warning" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('highRiskDprs')}</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="stat-high-risk">
                  {isLoadingStats ? '-' : stats.highRisk.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="text-2xl text-accent" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('avgScore')}</p>
                <p className="text-2xl font-semibold text-foreground" data-testid="stat-avg-score">
                  {isLoadingStats ? '-' : `${stats.avgScore}%`}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-2">
            {!currentAnalysisId ? (
              <FileUpload onUploadStart={handleUploadStart} />
            ) : (
              <AnalysisResults analysisId={currentAnalysisId} onNewAnalysis={handleNewAnalysis} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('quickActions')}</h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-start" 
                  data-testid="recent-reports-button"
                >
                  <History className="mr-3" size={16} />
                  {t('recentReports')}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start" 
                  data-testid="export-data-button"
                >
                  <Download className="mr-3" size={16} />
                  {t('exportData')}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start" 
                  data-testid="settings-button"
                >
                  <Settings className="mr-3" size={16} />
                  {t('settings')}
                </Button>
              </div>
            </Card>
            
            {/* System Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('systemStatus')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('aiModel')}</span>
                  <span className="flex items-center text-sm font-medium text-success">
                    <RiskIndicator level="low" />
                    {t('online')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('database')}</span>
                  <span className="flex items-center text-sm font-medium text-success">
                    <RiskIndicator level="low" />
                    {t('connected')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('apiStatus')}</span>
                  <span className="flex items-center text-sm font-medium text-success">
                    <RiskIndicator level="low" />
                    {t('active')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="mt-8">
          <RecentAnalyses />
        </div>
      </main>
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
