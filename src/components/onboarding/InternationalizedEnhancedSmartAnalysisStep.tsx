import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Target, CheckCircle, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface EnhancedSmartAnalysisStepProps {
  onNext: () => void;
  onBack: () => void;
}

const InternationalizedEnhancedSmartAnalysisStep: React.FC<EnhancedSmartAnalysisStepProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { user } = useSimpleApp();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (analysisProgress < 100) {
      const timer = setTimeout(() => {
        setAnalysisProgress((prevProgress) => Math.min(prevProgress + 20, 100));
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAnalysisComplete(true);
    }
  }, [analysisProgress]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {t('onboarding.analysis.title', 'Enhanced Smart Analysis')}
        </h2>
        <p className="text-muted-foreground">
          {t('onboarding.analysis.description', 'Analyzing your profile to provide personalized recommendations.')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            {t('onboarding.analysis.cardTitle', 'Analyzing Your Data')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{t('onboarding.analysis.progressLabel', 'Profile Analysis')}</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} />
            {analysisComplete ? (
              <div className="flex items-center space-x-2 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>{t('onboarding.analysis.completeMessage', 'Analysis Complete!')}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-blue-500">
                <Clock className="h-4 w-4 animate-spin" />
                <span>{t('onboarding.analysis.analyzingMessage', 'Analyzing your data...')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {t('common.back', 'Back')}
        </Button>
        <Button onClick={onNext} disabled={!analysisComplete}>
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
};

export default InternationalizedEnhancedSmartAnalysisStep;
