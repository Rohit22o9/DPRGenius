import { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadStart: (analysisId: string) => void;
}

export function FileUpload({ onUploadStart }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'text/plain'];

    if (file.size > maxSize) {
      toast({
        title: t('error'),
        description: 'File size exceeds 10MB limit',
        variant: 'destructive'
      });
      return false;
    }

    if (!allowedTypes.includes(file.type) && 
        !file.name.toLowerCase().endsWith('.pdf') && 
        !file.name.toLowerCase().endsWith('.txt')) {
      toast({
        title: t('error'),
        description: 'Only PDF and TXT files are supported',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('dprFile', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: t('success'),
        description: 'File uploaded successfully. Analysis in progress.',
      });

      onUploadStart(result.analysisId);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t('error'),
        description: error.message || 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Simulate progress for demo purposes
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isUploading]);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Upload className="mr-2 text-primary" size={20} />
        {t('uploadTitle')}
      </h2>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary hover:bg-primary/5",
          isUploading && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        data-testid="upload-zone"
      >
        <FileText className="mx-auto mb-4 text-4xl text-muted-foreground" size={48} />
        <h3 className="text-lg font-medium text-foreground mb-2">{t('dropFiles')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('clickToBrowse')}</p>
        <p className="text-xs text-muted-foreground">{t('supportedFiles')}</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handleFileChange}
          className="hidden"
          data-testid="file-input"
        />

        <Button 
          className="mt-4" 
          disabled={isUploading}
          data-testid="select-file-button"
        >
          {t('selectFile')}
        </Button>
      </div>

      {isUploading && (
        <div className="mt-6">
          <Card className="p-4 bg-muted">
            <div className="flex items-center mb-2">
              <div className="animate-spin mr-2">
                <AlertCircle className="text-primary" size={16} />
              </div>
              <span className="text-sm font-medium text-foreground">{t('processing')}</span>
            </div>
            <Progress value={uploadProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{t('analyzing')}</p>
          </Card>
        </div>
      )}
    </Card>
  );
}
