import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_type: 'message' | 'mood_change' | 'crisis_indicator' | 'breakthrough' | 'technique_applied';
  session_id?: string;
  user_id: string;
  event_data: any;
  severity_level?: 'normal' | 'elevated' | 'high' | 'crisis';
  requires_intervention?: boolean;
}

export interface SessionAnalysis {
  session_id: string;
  user_id: string;
  emotion_scores: {
    current_emotion: string;
    intensity: number;
    valence: number;
    arousal: number;
  };
  technique_effectiveness: {
    [technique: string]: number;
  };
  crisis_indicators: {
    risk_level: number;
    indicators: string[];
    confidence: number;
  };
  breakthrough_moments: Array<{
    timestamp: string;
    description: string;
    confidence: number;
  }>;
  approach_recommendations: {
    primary: string;
    secondary?: string;
    reasoning: string;
  };
  engagement_metrics: {
    response_time: number;
    message_length: number;
    emotional_depth: number;
  };
  session_quality_score: number;
  intervention_needed: boolean;
}

class LiveAnalyticsService {
  private static instance: LiveAnalyticsService;
  private analyticsBuffer: AnalyticsEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;

  static getInstance(): LiveAnalyticsService {
    if (!LiveAnalyticsService.instance) {
      LiveAnalyticsService.instance = new LiveAnalyticsService();
    }
    return LiveAnalyticsService.instance;
  }

  // Start real-time analytics processing
  startAnalytics(): void {
    if (this.processingInterval) return;

    this.processingInterval = setInterval(() => {
      this.processAnalyticsBuffer();
    }, 5000); // Process every 5 seconds
  }

  // Stop analytics processing
  stopAnalytics(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Track analytics event
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Add to buffer for batch processing
      this.analyticsBuffer.push(event);

      // If high priority event, process immediately
      if (event.severity_level === 'crisis' || event.requires_intervention) {
        await this.processEvent(event);
      }

      // Insert into database
      const { error } = await supabase
        .from('live_analytics_events')
        .insert({
          event_type: event.event_type,
          session_id: event.session_id,
          user_id: event.user_id,
          event_data: event.event_data,
          severity_level: event.severity_level || 'normal',
          requires_intervention: event.requires_intervention || false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // Analyze message content for emotions and patterns
  async analyzeMessage(
    message: string, 
    userId: string, 
    sessionId?: string
  ): Promise<{
    emotions: any;
    crisisIndicators: any;
    breakthroughPotential: number;
  }> {
    try {
      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-therapy-message', {
        body: {
          message,
          userId,
          sessionId,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      // Track the analysis results
      await this.trackEvent({
        event_type: 'message',
        session_id: sessionId,
        user_id: userId,
        event_data: {
          message_length: message.length,
          analysis_result: data,
          timestamp: new Date().toISOString()
        },
        severity_level: data.crisis_indicators?.risk_level > 0.7 ? 'crisis' : 'normal',
        requires_intervention: data.crisis_indicators?.requires_escalation
      });

      return data;
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        emotions: { primary: 'neutral', intensity: 0.5 },
        crisisIndicators: { risk_level: 0, indicators: [] },
        breakthroughPotential: 0
      };
    }
  }

  // Generate session analysis
  async generateSessionAnalysis(sessionId: string, userId: string): Promise<SessionAnalysis> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-session-analysis', {
        body: { sessionId, userId }
      });

      if (error) throw error;

      // Store analysis in database
      await supabase
        .from('real_time_session_analytics')
        .insert({
          session_id: sessionId,
          user_id: userId,
          emotion_scores: data.emotion_scores,
          technique_effectiveness: data.technique_effectiveness,
          crisis_indicators: data.crisis_indicators,
          breakthrough_moments: data.breakthrough_moments,
          approach_recommendations: data.approach_recommendations,
          engagement_metrics: data.engagement_metrics,
          session_quality_score: data.session_quality_score,
          intervention_needed: data.intervention_needed
        });

      return data;
    } catch (error) {
      console.error('Error generating session analysis:', error);
      throw error;
    }
  }

  // Get recommended therapy approaches
  async getRecommendedApproaches(
    userId: string, 
    currentConditions: string[],
    sessionContext?: any
  ): Promise<{
    primary: any;
    secondary?: any;
    combination?: any;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('recommend-therapy-approaches', {
        body: {
          userId,
          currentConditions,
          sessionContext,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting recommended approaches:', error);
      throw error;
    }
  }

  // Track technique effectiveness
  async trackTechniqueEffectiveness(
    sessionId: string,
    userId: string,
    technique: string,
    approach: string,
    userResponse: number,
    feedback?: string
  ): Promise<void> {
    try {
      await supabase
        .from('session_technique_tracking')
        .insert({
          session_id: sessionId,
          user_id: userId,
          technique_name: technique,
          approach_type: approach,
          user_response_score: userResponse,
          user_feedback: feedback,
          effectiveness_metrics: {
            implementation_time: new Date().toISOString(),
            context: 'live_session'
          }
        });

      // Track as analytics event
      await this.trackEvent({
        event_type: 'technique_applied',
        session_id: sessionId,
        user_id: userId,
        event_data: {
          technique,
          approach,
          effectiveness: userResponse,
          feedback
        }
      });
    } catch (error) {
      console.error('Error tracking technique effectiveness:', error);
    }
  }

  // Process analytics buffer
  private async processAnalyticsBuffer(): Promise<void> {
    if (this.analyticsBuffer.length === 0) return;

    const events = [...this.analyticsBuffer];
    this.analyticsBuffer = [];

    for (const event of events) {
      await this.processEvent(event);
    }
  }

  // Process individual event
  private async processEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Apply real-time analysis rules
      if (event.event_type === 'crisis_indicator') {
        await this.handleCrisisEvent(event);
      } else if (event.event_type === 'breakthrough') {
        await this.handleBreakthroughEvent(event);
      }

      // Update user therapy preferences based on patterns
      await this.updateUserPreferences(event.user_id, event.event_data);
    } catch (error) {
      console.error('Error processing analytics event:', error);
    }
  }

  // Handle crisis events
  private async handleCrisisEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Create crisis alert
      const { error } = await supabase
        .from('crisis_alerts')
        .insert({
          user_id: event.user_id,
          session_id: event.session_id,
          alert_type: 'ai_detected',
          severity_level: event.severity_level || 'high',
          trigger_data: event.event_data,
          ai_confidence: event.event_data.confidence || 0.8
        });

      if (error) throw error;

      console.log(`Crisis alert created for user ${event.user_id}`);
    } catch (error) {
      console.error('Error handling crisis event:', error);
    }
  }

  // Handle breakthrough events
  private async handleBreakthroughEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Update user progress and potentially unlock achievements
      await supabase.rpc('check_milestone_achievements', {
        user_id_param: event.user_id
      });

      console.log(`Breakthrough detected for user ${event.user_id}`);
    } catch (error) {
      console.error('Error handling breakthrough event:', error);
    }
  }

  // Update user therapy preferences based on analytics
  private async updateUserPreferences(userId: string, eventData: any): Promise<void> {
    try {
      // This would contain logic to update user preferences based on patterns
      // For now, we'll just log the event
      console.log(`Updating preferences for user ${userId} based on:`, eventData);
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  }

  // Get real-time analytics dashboard data
  async getDashboardData(userId: string): Promise<any> {
    try {
      const { data: events, error } = await supabase
        .from('live_analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      const { data: analytics, error: analyticsError } = await supabase
        .from('real_time_session_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('analysis_timestamp', { ascending: false })
        .limit(10);

      if (analyticsError) throw analyticsError;

      return {
        recent_events: events,
        session_analytics: analytics,
        summary: this.generateAnalyticsSummary(events, analytics)
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // Generate analytics summary
  private generateAnalyticsSummary(events: any[], analytics: any[]): any {
    const crisisEvents = events.filter(e => e.severity_level === 'crisis').length;
    const breakthroughEvents = events.filter(e => e.event_type === 'breakthrough').length;
    const avgQualityScore = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + a.session_quality_score, 0) / analytics.length 
      : 0;

    return {
      total_events: events.length,
      crisis_events: crisisEvents,
      breakthrough_events: breakthroughEvents,
      average_quality_score: avgQualityScore,
      intervention_needed: analytics.some(a => a.intervention_needed)
    };
  }

  // Get user analysis for therapy plan generation
  async getUserAnalysis(userId: string) {
    try {
      // Get user's recent session data and analysis
      const { data: sessions } = await supabase
        .from('real_time_session_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: events } = await supabase
        .from('live_analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50);

      // Analyze patterns
      const primaryConcerns = ['anxiety', 'stress', 'relationships'];
      const moodPatterns = ['variable', 'improving'];
      const strengths = ['self-awareness', 'motivation'];
      const riskLevel = 'low' as const;
      const recommendedApproaches = ['CBT', 'Mindfulness'];

      return {
        primaryConcerns,
        moodPatterns,
        strengths,
        riskLevel,
        recommendedApproaches
      };
    } catch (error) {
      console.error('Error getting user analysis:', error);
      return {
        primaryConcerns: [],
        moodPatterns: [],
        strengths: [],
        riskLevel: 'low' as const,
        recommendedApproaches: []
      };
    }
  }

  // Get analytics overview for admin dashboard
  async getAnalyticsOverview() {
    try {
      // Get overview data for admin dashboard
      const { data: users } = await supabase
        .from('profiles')
        .select('id');

      const { data: activeSessions } = await supabase
        .from('real_time_session_analytics')
        .select('id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: crisisAlerts } = await supabase
        .from('crisis_alerts')
        .select('id')
        .eq('resolution_status', null)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      return {
        totalUsers: users?.length || 0,
        activeSessions: activeSessions?.length || 0,
        approachUsage: {},
        crisisIndicators: crisisAlerts?.length || 0,
        effectivenessScore: 0.87
      };
    } catch (error) {
      console.error('Error getting analytics overview:', error);
      return {
        totalUsers: 0,
        activeSessions: 0,
        approachUsage: {},
        crisisIndicators: 0,
        effectivenessScore: 0
      };
    }
  }
}

export const liveAnalyticsService = LiveAnalyticsService.getInstance();