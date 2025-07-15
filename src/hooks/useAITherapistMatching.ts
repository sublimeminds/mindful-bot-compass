import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAITherapistMatchingReturn {
  isMatching: boolean;
  matchTherapists: (userAssessment: any, availableTherapists: any[]) => Promise<any>;
  error: string | null;
}

export const useAITherapistMatching = (): UseAITherapistMatchingReturn => {
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchTherapists = async (userAssessment: any, availableTherapists: any[]) => {
    setIsMatching(true);
    setError(null);

    try {
      console.log('🤖 Starting AI therapist matching...');
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'ai-therapist-matching',
        {
          body: {
            userAssessment,
            availableTherapists
          }
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to match therapists');
      }

      if (!data.success) {
        throw new Error(data.error || 'AI matching failed');
      }

      console.log('✅ AI therapist matching completed:', data.analysis);
      return data.analysis;

    } catch (err: any) {
      console.error('❌ AI therapist matching error:', err);
      const errorMessage = err.message || 'Failed to analyze therapist compatibility';
      setError(errorMessage);
      toast.error('Therapist Matching Failed', {
        description: errorMessage
      });
      return null;
    } finally {
      setIsMatching(false);
    }
  };

  return {
    isMatching,
    matchTherapists,
    error
  };
};