import { supabase } from '@/integrations/supabase/client';
import { crisisDetectionService } from './crisisDetectionService';

export interface ActiveSession {
  id: string;
  user_id: string;
  therapist_id: string;
  session_type: string;
  status: 'active' | 'paused' | 'completed' | 'terminated';
  start_time: string;
  last_activity: string;
  session_data: Record<string, any>;
  crisis_indicators: Record<string, any>;
  mood_tracking: Record<string, any>;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: string;
}

export interface SessionAnalytics {
  id: string;
  session_id: string;
  effectiveness_score: number;
  session_rating?: number;
  key_breakthrough?: string;
  techniques_effectiveness: Record<string, any>;
  created_at: string;
}

class ActiveSessionService {
  async startSession(
    userId: string,
    therapistId: string,
    sessionType: string,
    initialData: Record<string, any> = {}
  ): Promise<ActiveSession> {
    try {
      // End any existing active sessions
      await this.endExistingActiveSessions(userId);

      const sessionData = {
        user_id: userId,
        therapist_id: therapistId,
        session_type: sessionType,
        status: 'active' as const,
        session_data: {
          start_mood: initialData.mood || 5,
          goals: initialData.goals || [],
          preferences: initialData.preferences || {},
          ...initialData
        },
        crisis_indicators: {},
        mood_tracking: {
          start_mood: initialData.mood || 5,
          mood_checks: []
        }
      };

      const { data: session, error } = await supabase
        .from('active_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      // Create corresponding therapy session record
      await this.createTherapySessionRecord(session);

      return session as ActiveSession;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  async addMessage(
    sessionId: string,
    content: string,
    sender: 'user' | 'assistant',
    emotion?: string
  ): Promise<SessionMessage> {
    try {
      // Save message
      const messageData = {
        session_id: sessionId,
        sender,
        content,
        emotion
      };

      const { data: message, error } = await supabase
        .from('session_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Update session activity
      await this.updateSessionActivity(sessionId);

      // Check for crisis indicators if user message
      if (sender === 'user') {
        await this.checkCrisisIndicators(sessionId, content);
      }

      return message as SessionMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async updateMoodTracking(
    sessionId: string,
    moodData: Record<string, any>
  ): Promise<void> {
    try {
      const { data: session, error: fetchError } = await supabase
        .from('active_sessions')
        .select('mood_tracking')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      const currentTracking = (session.mood_tracking as any) || {};
      const updatedMoodTracking = {
        ...currentTracking,
        mood_checks: [
          ...(currentTracking.mood_checks || []),
          {
            timestamp: new Date().toISOString(),
            ...moodData
          }
        ],
        current_mood: moodData.overall || moodData.current_mood
      };

      const { error: updateError } = await supabase
        .from('active_sessions')
        .update({ mood_tracking: updatedMoodTracking })
        .eq('id', sessionId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating mood tracking:', error);
    }
  }

  async pauseSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ status: 'paused' })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error pausing session:', error);
      throw error;
    }
  }

  async resumeSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ 
          status: 'active',
          last_activity: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resuming session:', error);
      throw error;
    }
  }

  async endSession(
    sessionId: string,
    sessionRating?: number,
    keyBreakthrough?: string,
    finalMood?: number
  ): Promise<SessionAnalytics> {
    try {
      // Update session status
      const { error: updateError } = await supabase
        .from('active_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      // Get session data for analytics
      const { data: session, error: sessionError } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Get session messages
      const { data: messages } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      // Calculate session analytics
      const analytics = this.calculateSessionAnalytics(
        session as ActiveSession,
        (messages || []) as SessionMessage[],
        sessionRating,
        keyBreakthrough,
        finalMood
      );

      // Save analytics
      const { data: sessionAnalytics, error: analyticsError } = await supabase
        .from('session_analytics')
        .insert(analytics)
        .select()
        .single();

      if (analyticsError) throw analyticsError;

      // Update therapy session record
      await this.updateTherapySessionRecord(session as ActiveSession, sessionAnalytics as SessionAnalytics);

      return sessionAnalytics as SessionAnalytics;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  async getActiveSession(userId: string): Promise<ActiveSession | null> {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as ActiveSession;
    } catch (error) {
      console.error('Error fetching active session:', error);
      return null;
    }
  }

  async getSessionMessages(sessionId: string): Promise<SessionMessage[]> {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return (data || []) as SessionMessage[];
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  }

  private async endExistingActiveSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ status: 'terminated' })
        .eq('user_id', userId)
        .in('status', ['active', 'paused']);

      if (error) throw error;
    } catch (error) {
      console.error('Error ending existing sessions:', error);
    }
  }

  private async createTherapySessionRecord(session: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .insert({
          id: session.id,
          user_id: session.user_id,
          therapist_id: session.therapist_id,
          session_type: session.session_type,
          start_time: session.start_time,
          status: 'in_progress'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating therapy session record:', error);
    }
  }

  private async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  private async checkCrisisIndicators(sessionId: string, content: string): Promise<void> {
    try {
      const { data: session } = await supabase
        .from('active_sessions')
        .select('user_id, mood_tracking')
        .eq('id', sessionId)
        .single();

      if (!session) return;

      // Get recent messages for context
      const { data: recentMessages } = await supabase
        .from('session_messages')
        .select('content')
        .eq('session_id', sessionId)
        .eq('sender', 'user')
        .order('timestamp', { ascending: false })
        .limit(5);

      const messages = [content, ...(recentMessages?.map(m => m.content) || [])];
      
      const indicators = await crisisDetectionService.detectCrisisRisk(
        session.user_id,
        sessionId,
        messages,
        (session.mood_tracking && typeof session.mood_tracking === 'object') ? session.mood_tracking as Record<string, any> : {}
      );

      // Update session with crisis indicators
      const { error } = await supabase
        .from('active_sessions')
        .update({ 
          crisis_indicators: {
            crisis_score: indicators.crisis_score,
            indicators: indicators.indicators,
            confidence: indicators.confidence,
            requires_escalation: indicators.requires_escalation
          }
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error checking crisis indicators:', error);
    }
  }

  private calculateSessionAnalytics(
    session: ActiveSession,
    messages: SessionMessage[],
    sessionRating?: number,
    keyBreakthrough?: string,
    finalMood?: number
  ): any {
    const startMood = session.mood_tracking?.start_mood || 5;
    const endMood = finalMood || session.mood_tracking?.current_mood || startMood;
    
    // Calculate effectiveness based on mood improvement and engagement
    const moodImprovement = endMood - startMood;
    const messageCount = messages.length;
    const userMessages = messages.filter(m => m.sender === 'user').length;
    
    let effectivenessScore = 0.5; // Base score
    
    // Mood improvement factor (0.3 weight)
    effectivenessScore += (moodImprovement / 10) * 0.3;
    
    // Engagement factor (0.2 weight)
    if (userMessages > 5) effectivenessScore += 0.2;
    else if (userMessages > 2) effectivenessScore += 0.1;
    
    // Session rating factor (0.3 weight)
    if (sessionRating) {
      effectivenessScore += ((sessionRating - 5) / 5) * 0.3;
    }
    
    // Breakthrough factor (0.2 weight)
    if (keyBreakthrough) {
      effectivenessScore += 0.2;
    }
    
    effectivenessScore = Math.max(0, Math.min(1, effectivenessScore));

    return {
      session_id: session.id,
      effectiveness_score: effectivenessScore,
      session_rating: sessionRating,
      key_breakthrough: keyBreakthrough,
      techniques_effectiveness: {
        mood_improvement: moodImprovement,
        engagement_level: userMessages / Math.max(1, messageCount / 2),
        session_duration: this.calculateSessionDuration(session),
        crisis_indicators: session.crisis_indicators
      }
    };
  }

  private calculateSessionDuration(session: ActiveSession): number {
    const start = new Date(session.start_time);
    const end = new Date(session.last_activity);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minutes
  }

  private async updateTherapySessionRecord(
    session: ActiveSession,
    analytics: SessionAnalytics
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          effectiveness_score: analytics.effectiveness_score,
          session_notes: analytics.key_breakthrough
        })
        .eq('id', session.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating therapy session record:', error);
    }
  }
}

export const activeSessionService = new ActiveSessionService();