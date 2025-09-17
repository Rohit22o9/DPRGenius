import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskIndicator } from './RiskIndicator';
import { useLanguage } from '@/hooks/useLanguage';
import { DprAnalysis } from '@shared/schema';
import { History, Eye, Download, Trash2, FileText, FileIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<DprAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch('/api/recent?limit=5');
      if (!response.ok) throw new Error('Failed to fetch analyses');
      
      const data = await response.json();
      setAnalyses(data);
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      toast({
        title: t('error'),
        description: 'Failed to fetch recent analyses',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete analysis');
      
      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast({
        title: t('success'),
        description: 'Analysis deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: t('error'),
        description: 'Failed to delete analysis',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">{t('completed')}</Badge>;
      case 'processing':
        return <Badge variant="secondary">{t('processing')}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{t('failed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.toLowerCase().endsWith('.pdf')) {
      return <FileText className="text-red-500 mr-2" size={16} />;
    }
    return <FileIcon className="text-muted-foreground mr-2" size={16} />;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="recent-analyses">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <History className="mr-2 text-primary" size={24} />
          {t('recentAnalyses')}
        </h2>
        <Button variant="link" className="text-primary hover:text-primary/80">
          {t('viewAll')} →
        </Button>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No analyses found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('document')}</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('date')}</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('score')}</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('riskLevel')}</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('status')}</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr 
                  key={analysis.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                  data-testid={`analysis-row-${analysis.id}`}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      {getFileIcon(analysis.filename)}
                      <span className="font-medium text-foreground truncate max-w-xs" title={analysis.filename}>
                        {analysis.filename}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(analysis.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-medium text-foreground">
                      {analysis.overallScore ? `${analysis.overallScore}%` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {analysis.riskLevel ? (
                      <span className="flex items-center">
                        <RiskIndicator level={analysis.riskLevel} />
                        <span className={`font-medium ${
                          analysis.riskLevel === 'low' ? 'text-success' :
                          analysis.riskLevel === 'medium' ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {t(analysis.riskLevel)}
                        </span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {getStatusBadge(analysis.status)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        data-testid={`view-analysis-${analysis.id}`}
                        onClick={() => toast({ title: 'Feature Coming Soon', description: 'Detailed view will be available soon' })}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        data-testid={`download-analysis-${analysis.id}`}
                        onClick={() => toast({ title: 'Feature Coming Soon', description: 'Download will be available soon' })}
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(analysis.id)}
                        data-testid={`delete-analysis-${analysis.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
