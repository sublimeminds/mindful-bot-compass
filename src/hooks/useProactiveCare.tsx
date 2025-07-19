import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MoodPulseCheck {
  id: string;
  check_type: 'daily' | 'weekly' | 'situational' | 'followup';
  mood_score?: number;
  emotional_state: any;
  context_notes?: string;
  ai_followup_needed: boolean;
  human_escalation_needed: boolean;
  responded_at?: string;
  created_at: string;
}

export const useProactiveCare = () => {
  const { user } = useAuth();
  const [pendingChecks, setPendingChecks] = useState<MoodPulseCheck[]>([]);
  const [loading, setLoading] = useState(false);

  const createMoodCheck = async (
    type: MoodPulseCheck['check_type'],
    contextNotes?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mood_pulse_checks')
        .insert({
          user_id: user.id,
          check_type: type,
          emotional_state: {},
          context_notes: contextNotes,
          ai_followup_needed: false,
          human_escalation_needed: false
        })
        .select()
        .single();

      if (error) throw error;
      
      setPendingChecks(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating mood check:', error);
      return null;
    }
  };

  const respondToMoodCheck = async (
    checkId: string,
    moodScore: number,
    emotionalState: any,
    contextNotes?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('mood_pulse_checks')
        .update({
          mood_score: moodScore,
          emotional_state: emotionalState,
          context_notes: contextNotes,
          responded_at: new Date().toISOString(),
          ai_followup_needed: moodScore <= 4,
          human_escalation_needed: moodScore <= 2
        })
        .eq('id', checkId)
        .select()
        .single();

      if (error) throw error;

      setPendingChecks(prev => 
        prev.map(check => 
          check.id === checkId ? data : check
        )
      );

      return data;
    } catch (error) {
      console.error('Error responding to mood check:', error);
      return null;
    }
  };

  const generateCareMessage = (moodScore: number, emotionalState: any) => {
    if (moodScore <= 2) {
      return "I'm really concerned about how you're feeling right now. You don't have to go through this alone. Would you like to talk about what's happening?";
    } else if (moodScore <= 4) {
      return "I notice you're having a tough time today. That's completely okay - we all have difficult days. I'm here if you need support.";
    } else if (moodScore <= 6) {
      return "It sounds like you're doing okay, but maybe there's something on your mind? I'm here to listen if you'd like to share.";
    } else if (moodScore <= 8) {
      return "I'm glad to hear you're doing well today! Is there anything particular that's contributing to your positive mood?";
    } else {
      return "It's wonderful to see you feeling so good! I'd love to hear what's going well for you today.";
    }
  };

  const shouldTriggerDailyCheck = () => {
    const now = new Date();
    const today = now.toDateString();
    
    return !pendingChecks.some(check => 
      check.check_type === 'daily' && 
      new Date(check.created_at).toDateString() === today &&
      check.responded_at
    );
  };

  const createProactiveTrigger = async (
    triggerType: 'anniversary' | 'seasonal' | 'mood_pattern' | 'milestone' | 'inactivity' | 'crisis_followup',
    careAction: string,
    messageTemplate: string,
    triggerDate?: Date,
    triggerCondition = {}
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('proactive_care_triggers')
        .insert({
          user_id: user.id,
          trigger_type: triggerType,
          trigger_date: triggerDate?.toISOString().split('T')[0],
          trigger_condition: triggerCondition,
          care_action: careAction,
          message_template: messageTemplate,
          priority_level: 5,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating proactive trigger:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      // Load pending mood checks
      const loadPendingChecks = async () => {
        const { data, error } = await supabase
          .from('mood_pulse_checks')
          .select('*')
          .eq('user_id', user.id)
          .is('responded_at', null)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPendingChecks(data);
        }
      };

      loadPendingChecks();
    }
  }, [user]);

  return {
    pendingChecks,
    loading,
    createMoodCheck,
    respondToMoodCheck,
    generateCareMessage,
    shouldTriggerDailyCheck,
    createProactiveTrigger
  };
};