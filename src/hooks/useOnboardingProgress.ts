import { useState, useEffect, useCallback } from 'react';

interface OnboardingProgress {
  currentStep: number;
  data: any;
  lastUpdated: string;
  lastSavedAt: string;
  completed: boolean;
}

export const useOnboardingProgress = () => {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);

  const saveProgress = useCallback((stepData: any, stepNumber: number) => {
    const now = new Date().toISOString();
    const progressData: OnboardingProgress = {
      currentStep: stepNumber,
      data: stepData,
      lastUpdated: now,
      lastSavedAt: now,
      completed: false
    };
    
    localStorage.setItem('onboarding_progress', JSON.stringify(progressData));
    setProgress(progressData);
  }, []);

  const updateStep = useCallback((stepNumber: number) => {
    if (progress) {
      const updatedProgress = { ...progress, currentStep: stepNumber };
      localStorage.setItem('onboarding_progress', JSON.stringify(updatedProgress));
      setProgress(updatedProgress);
    }
  }, [progress]);

  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('onboarding_progress');
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingProgress;
        setProgress(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
    return null;
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem('onboarding_progress');
    setProgress(null);
  }, []);

  const markCompleted = useCallback(() => {
    if (progress) {
      const completedProgress = { ...progress, completed: true };
      localStorage.setItem('onboarding_progress', JSON.stringify(completedProgress));
      setProgress(completedProgress);
    }
  }, [progress]);

  const hasProgress = useCallback(() => {
    return !!progress && !progress.completed;
  }, [progress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    saveProgress,
    updateStep,
    loadProgress,
    clearProgress,
    markCompleted,
    hasProgress
  };
};