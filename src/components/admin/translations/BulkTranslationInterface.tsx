
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BulkTranslationService } from '@/services/bulkTranslationService';
import { Globe, Zap, Download, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface TranslationStats {
  totalItems: number;
  completed: number;
  status: string;
  categories: string[];
}

const BulkTranslationInterface = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const handleScanContent = useCallback(async () => {
    setIsScanning(true);
    try {
      const items = await BulkTranslationService.scanEnglishContent();
      
      setStats({
        totalItems: items.length,
        completed: 0,
        status: 'scanned',
        categories: [...new Set(items.map(item => item.category || 'general'))]
      });
      
      toast({
        title: "Content Scanned Successfully",
        description: `Found ${items.length} items needing German translation`,
      });
      
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const handleStartTranslation = useCallback(async () => {
    if (!stats) return;
    
    setIsTranslating(true);
    setProgress(0);
    
    try {
      // Scan content again to get latest items
      const items = await BulkTranslationService.scanEnglishContent();
      
      // Create translation job
      const jobId = await BulkTranslationService.createTranslationJob(items);
      setCurrentJobId(jobId);
      
      // Process translations with progress updates
      await BulkTranslationService.processTranslations(
        jobId,
        items,
        (completed, total) => {
          const progressPercent = Math.round((completed / total) * 100);
          setProgress(progressPercent);
          setStats(prev => prev ? { ...prev, completed, status: 'translating' } : null);
        }
      );
      
      setStats(prev => prev ? { ...prev, status: 'completed' } : null);
      
      toast({
        title: "Translation Completed!",
        description: `Successfully translated ${items.length} items to German`,
      });
      
    } catch (error) {
      console.error('Translation failed:', error);
      setStats(prev => prev ? { ...prev, status: 'failed' } : null);
      
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  }, [stats, toast]);

  const handleGenerateLanguageFile = useCallback(async () => {
    try {
      await BulkTranslationService.generateGermanLanguageFile();
      
      toast({
        title: "Language File Generated",
        description: "German language file has been updated with new translations",
      });
      
    } catch (error) {
      console.error('Language file generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'translating': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'scanned': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'translating': return <Zap className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">German Translation Project</h2>
          <p className="text-slate-400">AI-powered bulk translation of all English content to German</p>
        </div>
        <Badge variant="secondary" className="bg-therapy-500/10 text-therapy-400">
          <Globe className="h-3 w-3 mr-1" />
          EN → DE
        </Badge>
      </div>

      {/* Step 1: Content Scanning */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-therapy-500 text-white text-sm flex items-center justify-center font-bold">1</div>
                Content Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">
                Scan English content and identify items needing German translation
              </CardDescription>
            </div>
            <Button
              onClick={handleScanContent}
              disabled={isScanning}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              {isScanning ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Scan Content
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {stats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{stats.totalItems}</div>
                <div className="text-sm text-slate-400">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-400">{stats.completed}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{stats.categories.length}</div>
                <div className="text-sm text-slate-400">Categories</div>
              </div>
              <div className="text-center">
                <Badge className={getStatusColor(stats.status)} variant="secondary">
                  {getStatusIcon(stats.status)}
                  <span className="ml-1 capitalize">{stats.status}</span>
                </Badge>
              </div>
            </div>
            
            {stats.categories.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-slate-400 mb-2">Content Categories:</div>
                <div className="flex flex-wrap gap-2">
                  {stats.categories.map(category => (
                    <Badge key={category} variant="outline" className="border-slate-600 text-slate-300">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Step 2: AI Translation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-therapy-500 text-white text-sm flex items-center justify-center font-bold">2</div>
                AI Translation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Process all content through AI translation with therapeutic context
              </CardDescription>
            </div>
            <Button
              onClick={handleStartTranslation}
              disabled={!stats || isTranslating || stats.status === 'completed'}
              className="bg-green-600 hover:bg-green-700"
            >
              {isTranslating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Translating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Translation
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {isTranslating && (
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Translation Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="text-center text-slate-300">
                <Zap className="h-8 w-8 mx-auto mb-2 animate-pulse text-therapy-400" />
                <div className="text-sm">AI is translating content with therapeutic context...</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Step 3: Language File Generation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-therapy-500 text-white text-sm flex items-center justify-center font-bold">3</div>
                Language File Generation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Generate updated German language file with all translations
              </CardDescription>
            </div>
            <Button
              onClick={handleGenerateLanguageFile}
              disabled={!stats || stats.status !== 'completed'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate File
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {stats?.status === 'completed' && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400 mb-2">Translation Complete!</h3>
              <p className="text-slate-300">
                Successfully translated {stats.totalItems} items to German with therapeutic context.
                Your app now has comprehensive German language support.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkTranslationInterface;
