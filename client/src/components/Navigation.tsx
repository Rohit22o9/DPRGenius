
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Upload, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  History,
  Settings,
  User,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@/lib/i18n';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t, language, setLanguage } = useLanguage();

  const navigationItems = [
    { id: 'home', label: t('home'), icon: Home, badge: null },
    { id: 'upload', label: t('uploadDpr'), icon: Upload, badge: null },
    { id: 'results', label: t('analysisResults'), icon: BarChart3, badge: null },
    { id: 'risks', label: t('riskDashboard'), icon: AlertTriangle, badge: 'New' },
    { id: 'reports', label: t('reportsHistory'), icon: History, badge: null }
  ];

  return (
    <Card className="p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
                <SelectItem value="as">🇮🇳 অসমীয়া</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
            <User size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex flex-wrap gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                : "hover:bg-muted hover:scale-102"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>
    </Card>
  );
}
