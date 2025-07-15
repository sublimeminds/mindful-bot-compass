import { useState, useEffect } from 'react';

const STORAGE_KEY = 'onboarding_progress';

export interface OnboardingProgress {
  currentStep: number;
  data: any;
  completedSteps: number[];
  lastSavedAt: string;
}

export const useOnboardingProgress = () => {
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    data: {
      culturalPreferences: {
        primaryLanguage: 'en',
        culturalBackground: '',
        familyStructure: 'individual',
        communicationStyle: 'direct',
        religiousConsiderations: false,
        therapyApproachPreferences: [],
        culturalSensitivities: []
      }
    },
    completedSteps: [],
    lastSavedAt: ''
  });

  // Load progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      }
    }
  }, []);

  const saveProgress = (stepData: any, stepNumber?: number) => {
    const newProgress = {
      ...progress,
      data: { ...progress.data, ...stepData },
      currentStep: stepNumber !== undefined ? stepNumber : progress.currentStep,
      completedSteps: stepNumber !== undefined && !progress.completedSteps.includes(stepNumber) 
        ? [...progress.completedSteps, stepNumber] 
        : progress.completedSteps,
      lastSavedAt: new Date().toISOString()
    };
    
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const updateStep = (stepNumber: number) => {
    const newProgress = {
      ...progress,
      currentStep: stepNumber,
      lastSavedAt: new Date().toISOString()
    };
    
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      currentStep: 0,
      data: {
        culturalPreferences: {
          primaryLanguage: 'en',
          culturalBackground: '',
          familyStructure: 'individual',
          communicationStyle: 'direct',
          religiousConsiderations: false,
          therapyApproachPreferences: [],
          culturalSensitivities: []
        }
      },
      completedSteps: [],
      lastSavedAt: ''
    });
  };

  const isStepCompleted = (stepNumber: number) => {
    return progress.completedSteps.includes(stepNumber);
  };

  return {
    progress,
    saveProgress,
    updateStep,
    clearProgress,
    isStepCompleted
  };
};