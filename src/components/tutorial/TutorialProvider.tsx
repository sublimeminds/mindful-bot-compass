
import React, { createContext, useContext, useState, useEffect } from 'react';
import InteractiveTutorial from './InteractiveTutorial';
import { useLocation } from 'react-router-dom';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
  illustration?: string;
}

interface TutorialContextType {
  startTutorial: (key: string) => void;
  completeTutorial: (key: string) => void;
  isTutorialCompleted: (key: string) => boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

const TUTORIAL_CONFIGS: Record<string, TutorialStep[]> = {
  dashboard: [
    {
      id: 'welcome',
      title: 'Welcome to Your Dashboard',
      description: 'This is your personal mental wellness hub where you can track your progress and access all features.',
      illustration: '🏠',
    },
    {
      id: 'mood_tracking',
      title: 'Track Your Mood',
      description: 'Use the mood widget to log how you\'re feeling throughout the day. This helps us understand your patterns.',
      action: 'Click on the mood tracking widget to log your current mood',
      illustration: '😊',
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      description: 'Create personalized wellness goals and track your progress towards achieving them.',
      action: 'Try clicking on the goals section to create your first goal',
      illustration: '🎯',
    },
    {
      id: 'ai_chat',
      title: 'Start AI Therapy',
      description: 'Access our AI-powered therapy chat anytime you need support or want to talk through something.',
      action: 'Click the "Start Session" button to begin your first AI therapy conversation',
      illustration: '🤖',
    },
  ],
  chat: [
    {
      id: 'chat_intro',
      title: 'AI Therapy Sessions',
      description: 'Welcome to your private space for AI-powered therapy. Everything you share here is confidential.',
      illustration: '💬',
    },
    {
      id: 'natural_conversation',
      title: 'Talk Naturally',
      description: 'Just type and send your message like you would in any chat. The AI will respond thoughtfully.',
      action: 'Try typing "Hello, I\'d like to talk about my day" in the message box',
      illustration: '💭',
    },
    {
      id: 'session_features',
      title: 'Session Features',
      description: 'You can end sessions anytime, rate your experience, and review session summaries later.',
      illustration: '⭐',
    },
  ],
  goals: [
    {
      id: 'goal_setting',
      title: 'Setting Meaningful Goals',
      description: 'Create specific, measurable goals that align with your mental wellness journey.',
      illustration: '🎯',
    },
    {
      id: 'progress_tracking',
      title: 'Track Your Progress',
      description: 'Update your progress regularly and celebrate your achievements along the way.',
      action: 'Try creating a simple goal like "Practice mindfulness for 5 minutes daily"',
      illustration: '📈',
    },
  ],
};

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider = ({ children }: TutorialProviderProps) => {
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Auto-start tutorials based on route
    const routeTutorialMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/chat': 'chat',
      '/goals': 'goals',
    };

    const tutorialKey = routeTutorialMap[location.pathname];
    if (tutorialKey && !isTutorialCompleted(tutorialKey)) {
      // Delay to allow page to load
      setTimeout(() => setActiveTutorial(tutorialKey), 1000);
    }
  }, [location.pathname]);

  const startTutorial = (key: string) => {
    setActiveTutorial(key);
  };

  const completeTutorial = (key: string) => {
    const completed = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    completed[key] = true;
    localStorage.setItem('completedTutorials', JSON.stringify(completed));
    setActiveTutorial(null);
  };

  const isTutorialCompleted = (key: string) => {
    const completed = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    return completed[key] === true;
  };

  const handleComplete = () => {
    if (activeTutorial) {
      completeTutorial(activeTutorial);
    }
  };

  const handleSkip = () => {
    setActiveTutorial(null);
  };

  return (
    <TutorialContext.Provider value={{ startTutorial, completeTutorial, isTutorialCompleted }}>
      {children}
      {activeTutorial && TUTORIAL_CONFIGS[activeTutorial] && (
        <InteractiveTutorial
          steps={TUTORIAL_CONFIGS[activeTutorial]}
          onComplete={handleComplete}
          onSkip={handleSkip}
          tutorialKey={activeTutorial}
        />
      )}
    </TutorialContext.Provider>
  );
};
