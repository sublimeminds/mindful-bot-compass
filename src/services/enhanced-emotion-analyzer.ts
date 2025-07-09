// Enhanced Emotion Analyzer with Advanced Detection
export interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  secondary?: string;
  valence: number; // -1 (negative) to 1 (positive)
  arousal: number; // 0 (calm) to 1 (energetic)
}

export interface EmotionContext {
  previousEmotion?: string;
  conversationTone?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDuration?: number;
}

export class EnhancedEmotionAnalyzer {
  private emotionPatterns = {
    happy: {
      keywords: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'delighted', 'thrilled', 'cheerful', 'optimistic', 'elated'],
      intensifiers: ['very', 'extremely', 'incredibly', 'absolutely', 'totally'],
      phrases: ['feel good', 'on top of the world', 'over the moon', 'bright side'],
      valence: 0.8,
      arousal: 0.7
    },
    sad: {
      keywords: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'miserable', 'devastated', 'heartbroken', 'gloomy', 'melancholy'],
      intensifiers: ['deeply', 'extremely', 'terribly', 'utterly', 'completely'],
      phrases: ['feel terrible', 'hit rock bottom', 'end of the world', 'nothing matters'],
      valence: -0.7,
      arousal: 0.3
    },
    anxious: {
      keywords: ['worried', 'anxious', 'nervous', 'scared', 'fear', 'panic', 'stressed', 'overwhelmed', 'tense', 'restless', 'uneasy'],
      intensifiers: ['really', 'extremely', 'incredibly', 'terribly', 'desperately'],
      phrases: ['can\'t handle', 'too much', 'falling apart', 'losing control'],
      valence: -0.5,
      arousal: 0.9
    },
    angry: {
      keywords: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'rage', 'livid', 'outraged', 'infuriated', 'annoyed'],
      intensifiers: ['really', 'extremely', 'absolutely', 'totally', 'completely'],
      phrases: ['fed up', 'had enough', 'last straw', 'boiling point'],
      valence: -0.6,
      arousal: 0.8
    },
    calm: {
      keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'composed', 'centered', 'balanced', 'zen'],
      intensifiers: ['very', 'completely', 'totally', 'perfectly', 'absolutely'],
      phrases: ['at peace', 'feeling centered', 'in control', 'no worries'],
      valence: 0.4,
      arousal: 0.1
    },
    confused: {
      keywords: ['confused', 'lost', 'unclear', 'puzzled', 'bewildered', 'perplexed', 'uncertain', 'unsure'],
      intensifiers: ['really', 'completely', 'totally', 'absolutely'],
      phrases: ['don\'t understand', 'no idea', 'can\'t figure out'],
      valence: -0.2,
      arousal: 0.4
    },
    grateful: {
      keywords: ['grateful', 'thankful', 'blessed', 'appreciated', 'fortunate', 'lucky'],
      intensifiers: ['so', 'very', 'extremely', 'incredibly'],
      phrases: ['thank you', 'appreciate it', 'means a lot'],
      valence: 0.7,
      arousal: 0.5
    }
  };

  private contextModifiers = {
    timeOfDay: {
      morning: { valence: 0.1, arousal: 0.2 },
      afternoon: { valence: 0, arousal: 0 },
      evening: { valence: -0.1, arousal: -0.1 },
      night: { valence: -0.2, arousal: -0.3 }
    },
    sessionDuration: {
      short: { valence: 0.1, arousal: 0.1 }, // < 10 minutes
      medium: { valence: 0, arousal: 0 }, // 10-30 minutes
      long: { valence: -0.1, arousal: -0.2 } // > 30 minutes
    }
  };

  analyze(text: string, context?: EmotionContext): EmotionResult {
    const lowerText = text.toLowerCase();
    const results: Array<{ emotion: string; score: number; data: any }> = [];

    // Analyze each emotion pattern
    for (const [emotion, pattern] of Object.entries(this.emotionPatterns)) {
      let score = 0;
      
      // Keyword matching with weights
      const keywordMatches = pattern.keywords.filter(keyword => 
        lowerText.includes(keyword)
      ).length;
      score += keywordMatches * 2;

      // Phrase matching (higher weight)
      const phraseMatches = pattern.phrases.filter(phrase => 
        lowerText.includes(phrase)
      ).length;
      score += phraseMatches * 3;

      // Intensifier detection
      const intensifierMatches = pattern.intensifiers.filter(intensifier => 
        lowerText.includes(intensifier)
      ).length;
      score += intensifierMatches * 1.5;

      // Negation detection (reduces score)
      const negationWords = ['not', 'never', 'no', 'don\'t', 'won\'t', 'can\'t'];
      const hasNegation = negationWords.some(neg => lowerText.includes(neg));
      if (hasNegation) score *= 0.3;

      // Question mark reduces emotional certainty
      if (lowerText.includes('?')) score *= 0.8;

      if (score > 0) {
        results.push({ emotion, score, data: pattern });
      }
    }

    // Default to neutral if no emotions detected
    if (results.length === 0) {
      return {
        emotion: 'neutral',
        confidence: 0.5,
        intensity: 0.3,
        valence: 0,
        arousal: 0.2
      };
    }

    // Sort by score and get primary emotion
    results.sort((a, b) => b.score - a.score);
    const primary = results[0];
    const secondary = results[1]?.emotion;

    // Calculate confidence based on score distribution
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const confidence = Math.min(primary.score / totalScore, 1);

    // Calculate intensity based on text length and repetition
    const textLength = text.length;
    const repetitionFactor = this.detectRepetition(lowerText);
    const intensity = Math.min((primary.score / 10) * (1 + repetitionFactor) * Math.min(textLength / 100, 1), 1);

    // Apply context modifiers
    let { valence, arousal } = primary.data;
    if (context) {
      const modifiers = this.applyContextModifiers(context);
      valence = Math.max(-1, Math.min(1, valence + modifiers.valence));
      arousal = Math.max(0, Math.min(1, arousal + modifiers.arousal));
    }

    return {
      emotion: primary.emotion,
      confidence,
      intensity,
      secondary,
      valence,
      arousal
    };
  }

  analyzeEmotionalJourney(texts: string[], context?: EmotionContext): EmotionResult[] {
    return texts.map((text, index) => {
      const updatedContext = {
        ...context,
        previousEmotion: index > 0 ? this.analyze(texts[index - 1], context).emotion : undefined
      };
      return this.analyze(text, updatedContext);
    });
  }

  getEmotionTransition(from: string, to: string): {
    transition: 'smooth' | 'abrupt' | 'gradual';
    intensity: number;
    naturalness: number;
  } {
    const emotionDistance = this.calculateEmotionDistance(from, to);
    
    if (emotionDistance < 0.3) {
      return { transition: 'smooth', intensity: 0.2, naturalness: 0.9 };
    } else if (emotionDistance < 0.7) {
      return { transition: 'gradual', intensity: 0.5, naturalness: 0.7 };
    } else {
      return { transition: 'abrupt', intensity: 0.9, naturalness: 0.3 };
    }
  }

  private detectRepetition(text: string): number {
    const words = text.split(' ');
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    const repetitions = Array.from(wordCount.values()).filter(count => count > 1);
    return repetitions.length / words.length;
  }

  private applyContextModifiers(context: EmotionContext): { valence: number; arousal: number } {
    let valenceMod = 0;
    let arousalMod = 0;

    if (context.timeOfDay) {
      const timeMod = this.contextModifiers.timeOfDay[context.timeOfDay];
      valenceMod += timeMod.valence;
      arousalMod += timeMod.arousal;
    }

    if (context.sessionDuration) {
      const durationCategory = context.sessionDuration < 600 ? 'short' : 
                             context.sessionDuration < 1800 ? 'medium' : 'long';
      const durationMod = this.contextModifiers.sessionDuration[durationCategory];
      valenceMod += durationMod.valence;
      arousalMod += durationMod.arousal;
    }

    return { valence: valenceMod, arousal: arousalMod };
  }

  private calculateEmotionDistance(emotion1: string, emotion2: string): number {
    if (emotion1 === emotion2) return 0;
    
    const getPattern = (emotion: string) => this.emotionPatterns[emotion as keyof typeof this.emotionPatterns];
    const pattern1 = getPattern(emotion1);
    const pattern2 = getPattern(emotion2);
    
    if (!pattern1 || !pattern2) return 1;
    
    const valenceDiff = Math.abs(pattern1.valence - pattern2.valence);
    const arousalDiff = Math.abs(pattern1.arousal - pattern2.arousal);
    
    return Math.sqrt(valenceDiff * valenceDiff + arousalDiff * arousalDiff) / Math.sqrt(2);
  }

  // Facial expression mapping for 3D avatars
  mapEmotionToFacialExpression(emotion: string, intensity: number): {
    eyebrows: number;
    eyes: number;
    mouth: number;
    cheeks: number;
  } {
    const baseExpressions = {
      happy: { eyebrows: 0.2, eyes: 0.8, mouth: 0.9, cheeks: 0.7 },
      sad: { eyebrows: -0.6, eyes: -0.4, mouth: -0.8, cheeks: -0.3 },
      angry: { eyebrows: -0.9, eyes: -0.2, mouth: -0.6, cheeks: 0.1 },
      anxious: { eyebrows: 0.4, eyes: 0.6, mouth: -0.2, cheeks: -0.1 },
      calm: { eyebrows: 0, eyes: 0.1, mouth: 0.2, cheeks: 0 },
      confused: { eyebrows: 0.3, eyes: 0.2, mouth: -0.1, cheeks: 0 },
      grateful: { eyebrows: 0.1, eyes: 0.6, mouth: 0.7, cheeks: 0.4 },
      neutral: { eyebrows: 0, eyes: 0, mouth: 0, cheeks: 0 }
    };

    const base = baseExpressions[emotion as keyof typeof baseExpressions] || baseExpressions.neutral;
    
    return {
      eyebrows: base.eyebrows * intensity,
      eyes: base.eyes * intensity,
      mouth: base.mouth * intensity,
      cheeks: base.cheeks * intensity
    };
  }
}