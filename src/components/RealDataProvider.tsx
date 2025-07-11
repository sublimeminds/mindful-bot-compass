import React, { createContext, useContext } from 'react';
import { useRealSessionData } from '@/hooks/useRealSessionData';
import { useRealGoalsData } from '@/hooks/useRealGoalsData';
import { useRealMoodData } from '@/hooks/useRealMoodData';

interface RealDataContextType {
  sessions: ReturnType<typeof useRealSessionData>;
  goals: ReturnType<typeof useRealGoalsData>;
  moods: ReturnType<typeof useRealMoodData>;
}

const RealDataContext = createContext<RealDataContextType | null>(null);

export const RealDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessions = useRealSessionData();
  const goals = useRealGoalsData();
  const moods = useRealMoodData();

  return (
    <RealDataContext.Provider value={{ sessions, goals, moods }}>
      {children}
    </RealDataContext.Provider>
  );
};

export const useRealData = () => {
  const context = useContext(RealDataContext);
  if (!context) {
    throw new Error('useRealData must be used within a RealDataProvider');
  }
  return context;
};

// Helper function to replace mock data with real data
export const replaceWithRealData = (mockData: any[], realData: any[], fallbackCount = 5) => {
  if (realData && realData.length > 0) {
    return realData;
  }
  // Return a subset of mock data as fallback
  return mockData.slice(0, fallbackCount);
};