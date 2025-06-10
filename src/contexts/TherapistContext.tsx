
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { TherapistPersonality, TherapistMatchingService } from '@/services/therapistMatchingService';

interface TherapistContextType {
  currentTherapist: TherapistPersonality | null;
  availableTherapists: TherapistPersonality[];
  setCurrentTherapist: (therapist: TherapistPersonality | null) => void;
  loadTherapists: () => Promise<void>;
  loadUserTherapist: () => Promise<void>;
  getPersonalityPrompt: () => string;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);
  const [availableTherapists, setAvailableTherapists] = useState<TherapistPersonality[]>([]);
  const { user } = useAuth();

  const loadTherapists = async () => {
    try {
      const therapists = await TherapistMatchingService.getAllTherapists();
      setAvailableTherapists(therapists);
    } catch (error) {
      console.error('Error loading therapists:', error);
    }
  };

  const loadUserTherapist = async () => {
    if (!user) return;

    try {
      // Get user's latest assessment to find their selected therapist
      const assessment = await TherapistMatchingService.getLatestAssessment(user.id);
      
      if (assessment?.selected_therapist_id) {
        // Find the selected therapist from available therapists
        const therapists = await TherapistMatchingService.getAllTherapists();
        const selectedTherapist = therapists.find(t => t.id === assessment.selected_therapist_id);
        
        if (selectedTherapist) {
          setCurrentTherapist(selectedTherapist);
        }
      }
    } catch (error) {
      console.error('Error loading user therapist:', error);
    }
  };

  const getPersonalityPrompt = (): string => {
    if (!currentTherapist) {
      return "You are a helpful and empathetic AI therapist assistant.";
    }

    return `You are ${currentTherapist.name}, a ${currentTherapist.title}. 
    
Your approach: ${currentTherapist.approach}
Your specialties: ${currentTherapist.specialties.join(', ')}
Your communication style: ${currentTherapist.communication_style}

Description: ${currentTherapist.description}

Please respond in character as this therapist, maintaining their unique personality and approach while being helpful and therapeutic.`;
  };

  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserTherapist();
    }
  }, [user]);

  const value: TherapistContextType = {
    currentTherapist,
    availableTherapists,
    setCurrentTherapist,
    loadTherapists,
    loadUserTherapist,
    getPersonalityPrompt
  };

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};
