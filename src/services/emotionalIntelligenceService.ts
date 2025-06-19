import { supabase } from '@/integrations/supabase/client';

export interface EmotionalState {
  primary: string;
  secondary?: string;
  intensity: number; // 0-1
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0-1 (calm to excited)
  confidence: number; // 0-1
  timestamp: Date;
}

export interface EmotionalPattern {
  userId: string;
  dominantEmotions: string[];
  triggerWords: string[];
  positiveIndicators: string[];
  emotionalBaseline: EmotionalState;
  adaptationRules: AdaptationRule[];
}

export interface AdaptationRule {
  condition: string;
  action: string;
  priority: number;
}

export class EmotionalIntelligenceService {
  private static emotionCache = new Map<string, EmotionalState[]>();
  private static patterns = new Map<string, EmotionalPattern>();

  // Advanced emotion detection from text
  static async analyzeEmotionalState(text: string, context?: any): Promise<EmotionalState> {
    try {
      // Call our enhanced emotion analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: {
          text,
          context: context || {},
          includeIntensity: true,
          includeValenceArousal: true
        }
      });

      if (error) throw error;

      return {
        primary: data.primary_emotion || 'neutral',
        secondary: data.secondary_emotion,
        intensity: data.intensity || 0.5,
        valence: data.valence || 0,
        arousal: data.arousal || 0.5,
        confidence: data.confidence || 0.8,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing emotional state:', error);
      
      // Fallback emotion analysis
      return this.fallbackEmotionAnalysis(text);
    }
  }

  // Real-time emotion tracking during conversations
  static async trackEmotionalJourney(userId: string, emotion: EmotionalState): Promise<void> {
    try {
      // Store in cache for real-time access
      const userEmotions = this.emotionCache.get(userId) || [];
      userEmotions.push(emotion);
      
      // Keep only last 50 emotions for performance
      if (userEmotions.length > 50) {
        userEmotions.shift();
      }
      
      this.emotionCache.set(userId, userEmotions);

      // Persist to database
      await supabase
        .from('emotional_states')
        .insert({
          user_id: userId,
          primary_emotion: emotion.primary,
          secondary_emotion: emotion.secondary,
          intensity: emotion.intensity,
          valence: emotion.valence,
          arousal: emotion.arousal,
          confidence: emotion.confidence,
          timestamp: emotion.timestamp.toISOString()
        });

      // Check for emotional pattern updates
      await this.updateEmotionalPatterns(userId);
    } catch (error) {
      console.error('Error tracking emotional journey:', error);
    }
  }

  // Generate adaptive therapy responses based on emotional state
  static async generateAdaptiveResponse(
    userMessage: string,
    emotionalState: EmotionalState,
    userId: string
  ): Promise<{
    response: string;
    technique: string;
    adaptations: string[];
  }> {
    try {
      const patterns = await this.getEmotionalPatterns(userId);
      const recentEmotions = this.emotionCache.get(userId) || [];

      const { data, error } = await supabase.functions.invoke('adaptive-therapy-response', {
        body: {
          userMessage,
          emotionalState,
          patterns,
          recentEmotions: recentEmotions.slice(-10), // Last 10 emotions
          userId
        }
      });

      if (error) throw error;

      return {
        response: data.response,
        technique: data.technique,
        adaptations: data.adaptations || []
      };
    } catch (error) {
      console.error('Error generating adaptive response:', error);
      return this.fallbackAdaptiveResponse(emotionalState);
    }
  }

  // Predict emotional trajectory and intervention needs
  static async predictEmotionalTrajectory(userId: string): Promise<{
    prediction: EmotionalState;
    confidence: number;
    interventionNeeded: boolean;
    suggestedInterventions: string[];
    timeframe: string;
  }> {
    try {
      const recentEmotions = this.emotionCache.get(userId) || [];
      const patterns = await this.getEmotionalPatterns(userId);

      const { data, error } = await supabase.functions.invoke('predict-emotional-trajectory', {
        body: {
          userId,
          recentEmotions,
          patterns,
          predictionHours: 24
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error predicting emotional trajectory:', error);
      return {
        prediction: { primary: 'neutral', intensity: 0.5, valence: 0, arousal: 0.5, confidence: 0.5, timestamp: new Date() },
        confidence: 0.3,
        interventionNeeded: false,
        suggestedInterventions: [],
        timeframe: '24 hours'
      };
    }
  }

  // Get emotional patterns for a user
  private static async getEmotionalPatterns(userId: string): Promise<EmotionalPattern | null> {
    try {
      if (this.patterns.has(userId)) {
        return this.patterns.get(userId)!;
      }

      const { data, error } = await supabase
        .from('emotional_patterns')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      const pattern: EmotionalPattern = {
        userId,
        dominantEmotions: data.dominant_emotions || [],
        triggerWords: data.trigger_words || [],
        positiveIndicators: data.positive_indicators || [],
        emotionalBaseline: data.emotional_baseline || { primary: 'neutral', intensity: 0.5, valence: 0, arousal: 0.5, confidence: 0.8, timestamp: new Date() },
        adaptationRules: data.adaptation_rules || []
      };

      this.patterns.set(userId, pattern);
      return pattern;
    } catch (error) {
      console.error('Error getting emotional patterns:', error);
      return null;
    }
  }

  // Update emotional patterns based on recent interactions
  private static async updateEmotionalPatterns(userId: string): Promise<void> {
    try {
      const recentEmotions = this.emotionCache.get(userId) || [];
      if (recentEmotions.length < 10) return; // Need enough data

      // Analyze patterns in recent emotions
      const dominantEmotions = this.findDominantEmotions(recentEmotions);
      const baseline = this.calculateEmotionalBaseline(recentEmotions);

      await supabase
        .from('emotional_patterns')
        .upsert({
          user_id: userId,
          dominant_emotions: dominantEmotions,
          emotional_baseline: baseline,
          updated_at: new Date().toISOString()
        });

      // Update cache
      const existingPattern = this.patterns.get(userId);
      if (existingPattern) {
        existingPattern.dominantEmotions = dominantEmotions;
        existingPattern.emotionalBaseline = baseline;
        this.patterns.set(userId, existingPattern);
      }
    } catch (error) {
      console.error('Error updating emotional patterns:', error);
    }
  }

  // Helper methods
  private static fallbackEmotionAnalysis(text: string): EmotionalState {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based emotion detection
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      return { primary: 'joy', intensity: 0.7, valence: 0.8, arousal: 0.6, confidence: 0.6, timestamp: new Date() };
    }
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) {
      return { primary: 'sadness', intensity: 0.6, valence: -0.7, arousal: 0.3, confidence: 0.6, timestamp: new Date() };
    }
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      return { primary: 'anger', intensity: 0.7, valence: -0.6, arousal: 0.8, confidence: 0.6, timestamp: new Date() };
    }
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      return { primary: 'anxiety', intensity: 0.6, valence: -0.5, arousal: 0.7, confidence: 0.6, timestamp: new Date() };
    }
    
    return { primary: 'neutral', intensity: 0.4, valence: 0, arousal: 0.4, confidence: 0.5, timestamp: new Date() };
  }

  private static fallbackAdaptiveResponse(emotionalState: EmotionalState): {
    response: string;
    technique: string;
    adaptations: string[];
  } {
    const responses = {
      joy: "I can sense the positivity in your message! This is a great moment to build on these positive feelings.",
      sadness: "I hear the sadness in your words. It's completely valid to feel this way, and I'm here to support you through this.",
      anger: "I can feel the intensity of your emotions. Let's work together to understand what's driving these feelings.",
      anxiety: "I notice some worry in your message. Take a deep breath with me - you're safe here.",
      neutral: "Thank you for sharing with me. I'm here to listen and support you."
    };

    return {
      response: responses[emotionalState.primary as keyof typeof responses] || responses.neutral,
      technique: 'Emotional Validation',
      adaptations: ['tone-matching', 'empathy-focus']
    };
  }

  private static findDominantEmotions(emotions: EmotionalState[]): string[] {
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion.primary] = (acc[emotion.primary] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);
  }

  private static calculateEmotionalBaseline(emotions: EmotionalState[]): EmotionalState {
    const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
    const avgValence = emotions.reduce((sum, e) => sum + e.valence, 0) / emotions.length;
    const avgArousal = emotions.reduce((sum, e) => sum + e.arousal, 0) / emotions.length;

    return {
      primary: 'baseline',
      intensity: avgIntensity,
      valence: avgValence,
      arousal: avgArousal,
      confidence: 0.8,
      timestamp: new Date()
    };
  }
}
