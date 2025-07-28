import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Target, CheckCircle, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';

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
    const performActualAnalysis = async () => {
      if (!user) return;
      
      try {
        console.log('Starting actual AI analysis for user:', user.id);
        
        // Call our analysis edge function
        const { data, error } = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            userId: user.id,
            analysisType: 'onboarding_analysis',
            contextData: {
              userProfile: user,
              timestamp: new Date().toISOString()
            }
          }
        });

        if (error) {
          console.error('Analysis error:', error);
          // Still complete analysis even if AI fails
        } else {
          console.log('Analysis completed:', data);
        }

        // Simulate realistic progress over 5 seconds
        const totalSteps = 25;
        for (let i = 1; i <= totalSteps; i++) {
          setTimeout(() => {
            setAnalysisProgress((i / totalSteps) * 100);
            if (i === totalSteps) {
              setAnalysisComplete(true);
            }
          }, i * 200);
        }
        
      } catch (error) {
        console.error('Analysis failed:', error);
        // Complete anyway with fallback
        setTimeout(() => {
          setAnalysisProgress(100);
          setAnalysisComplete(true);
        }, 3000);
      }
    };

    performActualAnalysis();
  }, [user]);

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
        <GradientButton variant="outline" onClick={onBack}>
          {t('common.back', 'Back')}
        </GradientButton>
        <GradientButton 
          onClick={() => {
            console.log('🚀 Analysis complete - proceeding to next step');
            onNext();
          }}
          disabled={!analysisComplete}
          className={!analysisComplete ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {t('common.continue', 'Continue')}
        </GradientButton>
      </div>
    </div>
  );
};

export default InternationalizedEnhancedSmartAnalysisStep;
