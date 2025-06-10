import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { TherapistPersonality, TherapistMatchingService, TherapistMatch } from '@/services/therapistMatchingService';
import { useToast } from '@/hooks/use-toast';

interface TherapistContextType {
  currentTherapist: TherapistPersonality | null;
  availableTherapists: TherapistPersonality[];
  setCurrentTherapist: (therapist: TherapistPersonality | null) => void;
  loadTherapists: () => Promise<void>;
  loadUserTherapist: () => Promise<void>;
  selectTherapist: (therapistId: string) => Promise<void>;
  getPersonalityPrompt: () => string;
  isLoading: boolean;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);
  const [availableTherapists, setAvailableTherapists] = useState<TherapistPersonality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadTherapists = async () => {
    try {
      const therapists = await TherapistMatchingService.getAllTherapists();
      setAvailableTherapists(therapists);
    } catch (error) {
      console.error('Error loading therapists:', error);
    }
  };

  const loadUserTherapist = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Get user's latest assessment to find their selected therapist
      const assessment = await TherapistMatchingService.getLatestAssessment(user.id);
      
      if (assessment?.selected_therapist_id) {
        // Find the selected therapist from available therapists
        const therapists = await TherapistMatchingService.getAllTherapists();
        const selectedTherapist = therapists.find(t => t.id === assessment.selected_therapist_id);
        
        if (selectedTherapist) {
          setCurrentTherapist(selectedTherapist);
          console.log('Loaded user therapist:', selectedTherapist.name);
        } else {
          console.log('Selected therapist not found in available therapists');
        }
      } else {
        console.log('No therapist selected in assessment');
      }
    } catch (error) {
      console.error('Error loading user therapist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTherapist = async (therapistId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to select a therapist.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the therapist
      const therapist = availableTherapists.find(t => t.id === therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      // Get the latest assessment or create a basic one
      let assessment = await TherapistMatchingService.getLatestAssessment(user.id);
      
      if (!assessment) {
        // Create a basic assessment record if none exists
        await TherapistMatchingService.saveAssessment(
          user.id,
          [], // Empty responses for manual selection
          [], // Empty matches for manual selection
          therapistId
        );
      } else {
        // Parse recommended therapists safely with proper type handling
        let recommendedTherapists: TherapistMatch[] = [];
        if (assessment.recommended_therapists) {
          try {
            if (typeof assessment.recommended_therapists === 'string') {
              recommendedTherapists = JSON.parse(assessment.recommended_therapists);
            } else if (Array.isArray(assessment.recommended_therapists)) {
              // Use type assertion with proper validation
              recommendedTherapists = assessment.recommended_therapists as unknown as TherapistMatch[];
            }
          } catch (error) {
            console.error('Error parsing recommended therapists:', error);
            recommendedTherapists = [];
          }
        }

        // Update existing assessment with new therapist selection
        await TherapistMatchingService.saveAssessment(
          user.id,
          Object.entries(assessment.responses).map(([questionId, value]) => ({ questionId, value })),
          recommendedTherapists,
          therapistId
        );
      }

      setCurrentTherapist(therapist);
      
      toast({
        title: "Therapist Selected",
        description: `You've selected ${therapist.name} as your AI therapist.`,
      });
    } catch (error) {
      console.error('Error selecting therapist:', error);
      toast({
        title: "Error",
        description: "Failed to select therapist. Please try again.",
        variant: "destructive",
      });
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
    } else {
      setCurrentTherapist(null);
      setIsLoading(false);
    }
  }, [user]);

  const value: TherapistContextType = {
    currentTherapist,
    availableTherapists,
    setCurrentTherapist,
    loadTherapists,
    loadUserTherapist,
    selectTherapist,
    getPersonalityPrompt,
    isLoading
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

export default TherapistProvider;
