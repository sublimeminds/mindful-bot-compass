import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SessionAssessmentData {
  id: string;
  user_id: string;
  session_id?: string;
  assessment_type: string;
  current_mood?: number;
  energy_level?: number;
  stress_level?: number;
  sleep_quality?: number;
  main_concerns?: string[];
  session_goals?: string[];
  current_symptoms?: string[];
  medication_changes?: boolean;
  life_events?: string;
  session_helpfulness?: number;
  therapist_connection?: number;
  techniques_learned?: string[];
  homework_assigned?: string[];
  next_session_goals?: string[];
  overall_satisfaction?: number;
  would_recommend?: boolean;
  additional_feedback?: string;
  emotional_state?: string;
  confidence_level?: number;
  breakthrough_moments?: string;
  challenges_discussed?: string[];
  responses: any;
  assessment_score?: number;
  ai_insights?: string;
  completed_at: string;
  created_at: string;
}

export const useSessionAssessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<SessionAssessmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async (sessionId?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('session_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setAssessments(data || []);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  const getLastPreSessionAssessment = async (): Promise<SessionAssessmentData | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('session_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'pre_session')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching last pre-session assessment:', err);
      return null;
    }
  };

  const getAssessmentForSession = async (sessionId: string, type: 'pre_session' | 'post_session'): Promise<SessionAssessmentData | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('session_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .eq('assessment_type', type)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (err) {
      console.error(`Error fetching ${type} assessment:`, err);
      return null;
    }
  };

  const createSessionContinuity = async (data: {
    previous_session_id?: string;
    current_session_id?: string;
    carry_over_topics?: string[];
    unresolved_issues?: string[];
    session_plan?: string;
    priority_areas?: string[];
  }) => {
    if (!user) return null;
    
    try {
      const { data: continuity, error } = await supabase
        .from('therapy_session_continuity')
        .insert({
          user_id: user.id,
          ...data
        })
        .select()
        .single();

      if (error) throw error;
      
      return continuity;
    } catch (err) {
      console.error('Error creating session continuity:', err);
      toast({
        title: "Error",
        description: "Failed to create session continuity",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateSessionPlan = async (preAssessment: SessionAssessmentData | null): Promise<string> => {
    if (!preAssessment) {
      return "We'll focus on understanding your current needs and establishing a comfortable therapeutic environment.";
    }

    const mood = preAssessment.current_mood || 5;
    const stress = preAssessment.stress_level || 5;
    const energy = preAssessment.energy_level || 5;
    const concerns = preAssessment.main_concerns || [];
    const symptoms = preAssessment.current_symptoms || [];

    let plan = "Based on your pre-session assessment, ";

    if (mood <= 3) {
      plan += "we'll focus on mood stabilization and coping strategies. ";
    } else if (mood >= 7) {
      plan += "we'll build on your positive mood to work on deeper goals. ";
    }

    if (stress >= 7) {
      plan += "We'll prioritize stress reduction techniques and identify triggers. ";
    }

    if (energy <= 3) {
      plan += "We'll use gentle, energy-appropriate approaches and discuss sleep/rest patterns. ";
    }

    if (concerns.length > 0) {
      plan += `We'll address your main concerns: ${concerns.slice(0, 3).join(', ')}. `;
    }

    if (symptoms.length > 0) {
      plan += `We'll work on managing: ${symptoms.slice(0, 2).join(' and ')}. `;
    }

    return plan + "Our session will be tailored to your current state and needs.";
  };

  const getProgressInsights = (assessments: SessionAssessmentData[]): string[] => {
    const insights: string[] = [];
    
    if (assessments.length < 2) return insights;

    const recent = assessments.slice(0, 5);
    const preAssessments = recent.filter(a => a.assessment_type === 'pre_session');
    const postAssessments = recent.filter(a => a.assessment_type === 'post_session');

    if (preAssessments.length >= 2) {
      const moodTrend = preAssessments.slice(0, 2);
      const moodChange = (moodTrend[0].current_mood || 5) - (moodTrend[1].current_mood || 5);
      
      if (moodChange > 1) {
        insights.push("Your mood has been improving over recent sessions.");
      } else if (moodChange < -1) {
        insights.push("Your mood has been declining - let's focus on mood stabilization.");
      }

      const stressTrend = preAssessments.slice(0, 2);
      const stressChange = (stressTrend[1].stress_level || 5) - (stressTrend[0].stress_level || 5);
      
      if (stressChange > 1) {
        insights.push("Your stress levels have decreased - great progress!");
      } else if (stressChange < -1) {
        insights.push("Stress levels have increased - we should address this priority.");
      }
    }

    if (postAssessments.length >= 2) {
      const satisfactionAvg = postAssessments.reduce((sum, a) => sum + (a.overall_satisfaction || 5), 0) / postAssessments.length;
      
      if (satisfactionAvg >= 8) {
        insights.push("You're consistently satisfied with your therapy sessions.");
      } else if (satisfactionAvg <= 5) {
        insights.push("Let's discuss how to improve your therapy experience.");
      }
    }

    return insights;
  };

  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);

  return {
    assessments,
    loading,
    error,
    fetchAssessments,
    getLastPreSessionAssessment,
    getAssessmentForSession,
    createSessionContinuity,
    generateSessionPlan,
    getProgressInsights
  };
};