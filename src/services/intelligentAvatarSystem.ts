import { EmotionResult, EmotionType } from './advancedEmotionDetection';

export interface AvatarEmotionState {
  primary: EmotionType;
  secondary?: EmotionType;
  intensity: number; // 1-10
  microExpressions: string[];
  duration: number; // milliseconds
  blendWeight: number; // 0-1 for mixing emotions
}

export interface TherapeuticResponse {
  emotion: AvatarEmotionState;
  intervention?: {
    type: 'breathing' | 'grounding' | 'validation' | 'encouragement' | 'concern';
    message: string;
    priority: number;
  };
  bodyLanguage: {
    posture: 'forward_lean' | 'neutral' | 'relaxed' | 'alert';
    gestureIntensity: number; // 0-1
    eyeContact: number; // 0-1
    proximity: 'close' | 'normal' | 'distant';
  };
}

export class IntelligentAvatarSystem {
  private emotionHistory: EmotionResult[] = [];
  private currentAvatarState: AvatarEmotionState | null = null;
  private sessionContext: {
    phase: 'opening' | 'working' | 'closing';
    userEngagement: number; // 0-1
    emotionalIntensity: number; // 0-1
    crisisLevel: number; // 0-1
  } = {
    phase: 'opening',
    userEngagement: 0.5,
    emotionalIntensity: 0.3,
    crisisLevel: 0
  };

  updateUserEmotion(emotion: EmotionResult): TherapeuticResponse {
    this.emotionHistory.push(emotion);
    
    // Keep only last 50 emotions for analysis
    if (this.emotionHistory.length > 50) {
      this.emotionHistory = this.emotionHistory.slice(-50);
    }

    // Analyze emotional context
    const context = this.analyzeEmotionalContext();
    
    // Generate appropriate avatar response
    const response = this.generateTherapeuticResponse(emotion, context);
    
    // Update session context
    this.updateSessionContext(emotion);
    
    return response;
  }

  private analyzeEmotionalContext(): {
    trajectory: 'improving' | 'declining' | 'stable' | 'volatile';
    dominantEmotion: EmotionType;
    emotionalNeed: 'validation' | 'calming' | 'encouragement' | 'grounding' | 'celebration';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    if (this.emotionHistory.length < 3) {
      return {
        trajectory: 'stable',
        dominantEmotion: 'neutral',
        emotionalNeed: 'validation',
        riskLevel: 'low'
      };
    }

    const recent = this.emotionHistory.slice(-5);
    const valenceChange = this.calculateValenceTrajectory(recent);
    const arousalLevel = this.calculateAverageArousal(recent);
    const dominantEmotion = this.getDominantEmotion(recent);

    // Determine trajectory
    let trajectory: 'improving' | 'declining' | 'stable' | 'volatile' = 'stable';
    if (valenceChange > 0.2) trajectory = 'improving';
    else if (valenceChange < -0.2) trajectory = 'declining';
    else if (this.isVolatile(recent)) trajectory = 'volatile';

    // Determine emotional need
    let emotionalNeed: 'validation' | 'calming' | 'encouragement' | 'grounding' | 'celebration' = 'validation';
    
    if (arousalLevel > 0.7) emotionalNeed = 'calming';
    else if (trajectory === 'improving') emotionalNeed = 'celebration';
    else if (trajectory === 'declining') emotionalNeed = 'encouragement';
    else if (trajectory === 'volatile') emotionalNeed = 'grounding';

    // Assess risk level
    const riskLevel = this.assessRiskLevel(recent);

    return {
      trajectory,
      dominantEmotion,
      emotionalNeed,
      riskLevel
    };
  }

  private generateTherapeuticResponse(
    userEmotion: EmotionResult, 
    context: ReturnType<IntelligentAvatarSystem['analyzeEmotionalContext']>
  ): TherapeuticResponse {
    
    // Base avatar emotion response
    let avatarEmotion = this.determineAvatarEmotion(userEmotion.emotion, context);
    
    // Adjust intensity based on context
    avatarEmotion.intensity = this.calculateResponseIntensity(userEmotion, context);
    
    // Generate intervention if needed
    const intervention = this.generateIntervention(userEmotion, context);
    
    // Determine body language
    const bodyLanguage = this.generateBodyLanguage(userEmotion, context);

    this.currentAvatarState = avatarEmotion;

    return {
      emotion: avatarEmotion,
      intervention,
      bodyLanguage
    };
  }

  private determineAvatarEmotion(userEmotion: EmotionType, context: any): AvatarEmotionState {
    // Emotional response mapping for therapeutic context
    const responseMap: Record<EmotionType, { primary: EmotionType; secondary?: EmotionType }> = {
      // User shows vulnerability -> Avatar shows empathy + safety
      anxiety: { primary: 'empathy', secondary: 'safety' },
      panic: { primary: 'compassion', secondary: 'safety' },
      fear: { primary: 'understanding', secondary: 'support' },
      
      // User shows sadness -> Avatar shows validation + gentle hope
      sadness: { primary: 'validation', secondary: 'hope' },
      grief: { primary: 'compassion', secondary: 'acceptance' },
      melancholy: { primary: 'understanding', secondary: 'support' },
      
      // User shows anger -> Avatar shows patience + validation
      anger: { primary: 'understanding', secondary: 'acceptance' },
      frustration: { primary: 'validation', secondary: 'support' },
      irritation: { primary: 'empathy', secondary: 'acceptance' },
      
      // User shows positive emotions -> Avatar mirrors + celebrates
      joy: { primary: 'joy', secondary: 'validation' },
      excitement: { primary: 'encouragement', secondary: 'joy' },
      breakthrough: { primary: 'pride', secondary: 'celebration' },
      
      // User shows resistance -> Avatar shows patience + gentle persistence
      resistance: { primary: 'understanding', secondary: 'encouragement' },
      defensiveness: { primary: 'acceptance', secondary: 'safety' },
      withdrawal: { primary: 'compassion', secondary: 'invitation' },
      
      // Default responses
      neutral: { primary: 'empathy', secondary: 'encouragement' },
      confusion: { primary: 'understanding', secondary: 'clarity' }
    };

    // Handle unmapped emotions with defaults
    const response = responseMap[userEmotion] || { primary: 'empathy' as EmotionType };

    // Adjust based on context
    if (context.riskLevel === 'high') {
      response.primary = 'safety';
      response.secondary = 'support';
    } else if (context.trajectory === 'improving') {
      response.secondary = 'encouragement';
    }

    return {
      primary: response.primary,
      secondary: response.secondary,
      intensity: 6, // Will be adjusted later
      microExpressions: this.generateMicroExpressions(response.primary),
      duration: 3000, // 3 second default
      blendWeight: response.secondary ? 0.7 : 1.0
    };
  }

  private generateMicroExpressions(emotion: EmotionType): string[] {
    const microExpressionMap: Partial<Record<EmotionType, string[]>> = {
      empathy: ['gentle_eye_contact', 'slight_head_tilt', 'soft_brow'],
      compassion: ['warm_smile', 'open_posture', 'leaning_forward'],
      understanding: ['nodding', 'attentive_gaze', 'relaxed_features'],
      validation: ['affirming_nod', 'gentle_smile', 'open_expression'],
      safety: ['steady_gaze', 'calm_breathing', 'grounded_posture'],
      support: ['encouraging_smile', 'open_arms', 'forward_lean'],
      encouragement: ['bright_eyes', 'gentle_smile', 'upright_posture'],
      joy: ['genuine_smile', 'bright_eyes', 'animated_features'],
      acceptance: ['soft_features', 'open_expression', 'relaxed_posture'],
      hope: ['gentle_optimism', 'slight_smile', 'forward_gaze'],
      neutral: ['attentive_gaze', 'neutral_expression'],
      anxiety: ['concerned_brow', 'gentle_eyes'],
      sadness: ['soft_expression', 'gentle_concern'],
      anger: ['calm_presence', 'steady_gaze'],
      fear: ['reassuring_presence', 'safe_expression'],
      surprise: ['raised_eyebrows', 'alert_expression'],
      disgust: ['understanding_look', 'accepting_expression']
    };

    return microExpressionMap[emotion] || ['neutral_expression'];
  }

  private calculateResponseIntensity(userEmotion: EmotionResult, context: any): number {
    let baseIntensity = userEmotion.intensity * 0.6; // Start lower than user

    // Adjust based on context
    if (context.riskLevel === 'high') baseIntensity += 2;
    if (context.trajectory === 'declining') baseIntensity += 1;
    if (context.emotionalNeed === 'calming') baseIntensity = Math.min(baseIntensity, 4);
    if (context.emotionalNeed === 'celebration') baseIntensity += 2;

    return Math.max(1, Math.min(10, Math.round(baseIntensity)));
  }

  private generateIntervention(userEmotion: EmotionResult, context: any): TherapeuticResponse['intervention'] {
    if (context.riskLevel === 'high') {
      return {
        type: 'concern',
        message: "I notice you're experiencing intense emotions. Let's take this step by step together.",
        priority: 10
      };
    }

    if (userEmotion.arousal > 0.8) {
      return {
        type: 'breathing',
        message: "Let's take a moment to breathe together. I'll guide you through this.",
        priority: 8
      };
    }

    if (context.emotionalNeed === 'grounding') {
      return {
        type: 'grounding',
        message: "Let's ground ourselves in the present moment. Can you feel your feet on the floor?",
        priority: 7
      };
    }

    if (context.trajectory === 'improving') {
      return {
        type: 'validation',
        message: "I can see you're making progress. That takes real courage.",
        priority: 5
      };
    }

    return undefined; // No intervention needed
  }

  private generateBodyLanguage(userEmotion: EmotionResult, context: any): TherapeuticResponse['bodyLanguage'] {
    let posture: 'forward_lean' | 'neutral' | 'relaxed' | 'alert' = 'neutral';
    let gestureIntensity = 0.5;
    let eyeContact = 0.7;
    let proximity: 'close' | 'normal' | 'distant' = 'normal';

    // Adjust based on user emotion
    if (['anxiety', 'panic', 'fear'].includes(userEmotion.emotion)) {
      posture = 'forward_lean';
      gestureIntensity = 0.3; // Gentle movements
      eyeContact = 0.8;
      proximity = 'close'; // Show presence
    } else if (['anger', 'frustration', 'resistance'].includes(userEmotion.emotion)) {
      posture = 'neutral';
      gestureIntensity = 0.2; // Minimal movements
      eyeContact = 0.6; // Respectful distance
      proximity = 'normal';
    } else if (['joy', 'excitement', 'breakthrough'].includes(userEmotion.emotion)) {
      posture = 'alert';
      gestureIntensity = 0.8; // More animated
      eyeContact = 0.9;
      proximity = 'normal';
    } else if (['sadness', 'grief', 'melancholy'].includes(userEmotion.emotion)) {
      posture = 'forward_lean';
      gestureIntensity = 0.4;
      eyeContact = 0.7;
      proximity = 'close';
    }

    // Adjust based on context
    if (context.riskLevel === 'high') {
      posture = 'forward_lean';
      eyeContact = 0.9;
      proximity = 'close';
    }

    return {
      posture,
      gestureIntensity,
      eyeContact,
      proximity
    };
  }

  private updateSessionContext(emotion: EmotionResult): void {
    // Update engagement based on emotion intensity and eye contact
    this.sessionContext.userEngagement = Math.min(1, emotion.intensity / 10 * 0.8 + 0.2);
    
    // Update emotional intensity
    this.sessionContext.emotionalIntensity = emotion.arousal;
    
    // Update crisis level based on specific emotions and intensity
    const crisisEmotions = ['panic', 'rage', 'despair', 'suicidal'];
    if (crisisEmotions.includes(emotion.emotion) || emotion.intensity > 8) {
      this.sessionContext.crisisLevel = Math.min(1, this.sessionContext.crisisLevel + 0.2);
    } else {
      this.sessionContext.crisisLevel = Math.max(0, this.sessionContext.crisisLevel - 0.1);
    }
  }

  // Helper methods for analysis
  private calculateValenceTrajectory(emotions: EmotionResult[]): number {
    if (emotions.length < 2) return 0;
    
    const first = emotions[0].valence;
    const last = emotions[emotions.length - 1].valence;
    return last - first;
  }

  private calculateAverageArousal(emotions: EmotionResult[]): number {
    return emotions.reduce((sum, e) => sum + e.arousal, 0) / emotions.length;
  }

  private getDominantEmotion(emotions: EmotionResult[]): EmotionType {
    const emotionCounts = new Map<string, number>();
    emotions.forEach(e => {
      emotionCounts.set(e.emotion, (emotionCounts.get(e.emotion) || 0) + 1);
    });
    
    return Array.from(emotionCounts.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as EmotionType;
  }

  private isVolatile(emotions: EmotionResult[]): boolean {
    if (emotions.length < 3) return false;
    
    let changes = 0;
    for (let i = 1; i < emotions.length; i++) {
      const valenceDiff = Math.abs(emotions[i].valence - emotions[i-1].valence);
      if (valenceDiff > 0.3) changes++;
    }
    
    return changes / (emotions.length - 1) > 0.6;
  }

  private assessRiskLevel(emotions: EmotionResult[]): 'low' | 'medium' | 'high' {
    const highRiskEmotions = ['panic', 'rage', 'despair'];
    const mediumRiskEmotions = ['anxiety', 'anger', 'grief'];
    
    const recent = emotions.slice(-3);
    const hasHighRisk = recent.some(e => highRiskEmotions.includes(e.emotion) && e.intensity > 7);
    const hasMediumRisk = recent.some(e => mediumRiskEmotions.includes(e.emotion) && e.intensity > 6);
    const averageIntensity = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length;
    
    if (hasHighRisk || averageIntensity > 8) return 'high';
    if (hasMediumRisk || averageIntensity > 6) return 'medium';
    return 'low';
  }

  getCurrentAvatarState(): AvatarEmotionState | null {
    return this.currentAvatarState;
  }

  getSessionContext() {
    return { ...this.sessionContext };
  }
}

export const intelligentAvatarSystem = new IntelligentAvatarSystem();
