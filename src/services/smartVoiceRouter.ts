import { enhancedTherapyVoiceService, EmotionalContext } from './enhancedTherapyVoiceService';
import { supabase } from '@/integrations/supabase/client';

export interface VoiceUsageStats {
  providerId: 'elevenlabs' | 'hume' | 'browser';
  charactersUsed: number;
  costEstimate: number;
  qualityRating: number;
  timestamp: string;
}

export interface ContentAnalysis {
  textLength: number;
  estimatedDuration: number;
  complexity: 'simple' | 'moderate' | 'complex';
  emotionalIntensity: number;
  isEmergency: boolean;
  contentType: 'conversation' | 'meditation' | 'exercise' | 'crisis';
}

class SmartVoiceRouter {
  private usageHistory: VoiceUsageStats[] = [];
  private costThresholds = {
    elevenlabs: {
      perCharacter: 0.0003, // $0.30 per 1000 characters
      qualityScore: 9.5,
      maxDailyBudget: 10.00
    },
    hume: {
      perMinute: 0.05, // $3 per hour = $0.05 per minute
      qualityScore: 8.5,
      maxDailyBudget: 15.00
    },
    browser: {
      perCharacter: 0,
      qualityScore: 6.0,
      maxDailyBudget: 0
    }
  };

  // Analyze content to determine optimal voice service
  analyzeContent(text: string, context?: EmotionalContext): ContentAnalysis {
    const textLength = text.length;
    const wordsPerMinute = 150; // Average speaking rate
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / wordsPerMinute) * 60; // in seconds

    // Detect complexity based on sentence structure and vocabulary
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const complexity = avgSentenceLength > 100 ? 'complex' : avgSentenceLength > 50 ? 'moderate' : 'simple';

    // Emotional intensity from context or text analysis
    const emotionalIntensity = context?.intensity || this.detectEmotionalIntensity(text);
    
    // Emergency detection
    const emergencyKeywords = ['crisis', 'emergency', 'urgent', 'help', 'suicide', 'harm', 'danger'];
    const isEmergency = emergencyKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    ) || (context?.crisisLevel ?? false);

    // Content type detection
    const contentType = this.detectContentType(text);

    return {
      textLength,
      estimatedDuration,
      complexity,
      emotionalIntensity,
      isEmergency,
      contentType
    };
  }

  // Route voice request to optimal service
  async routeVoiceRequest(
    text: string,
    therapistId: string,
    emotionalContext?: EmotionalContext,
    qualityPreference: 'premium' | 'standard' | 'budget' = 'standard'
  ): Promise<{
    provider: 'elevenlabs' | 'hume' | 'browser';
    audioUrl?: string;
    reason: string;
    cost: number;
  }> {
    const analysis = this.analyzeContent(text, emotionalContext);
    const dailyUsage = this.getDailyUsage();

    console.log('Voice routing analysis:', { analysis, dailyUsage, qualityPreference });

    // Crisis situations always get premium voice
    if (analysis.isEmergency) {
      return await this.useElevenLabs(text, emotionalContext, 'Crisis situations require highest quality voice');
    }

    // Premium quality preference for short, important content
    if (qualityPreference === 'premium' && analysis.textLength < 500) {
      return await this.useElevenLabs(text, emotionalContext, 'Premium quality requested for short content');
    }

    // Long content (>2 minutes) routes to Hume AI for cost efficiency
    if (analysis.estimatedDuration > 120) {
      if (dailyUsage.hume.cost < this.costThresholds.hume.maxDailyBudget) {
        return await this.useHumeAI(text, emotionalContext, 'Long content routed to cost-efficient Hume AI');
      }
    }

    // Medium content with high emotional intensity uses ElevenLabs
    if (analysis.emotionalIntensity > 0.6 && analysis.textLength < 1000) {
      if (dailyUsage.elevenlabs.cost < this.costThresholds.elevenlabs.maxDailyBudget) {
        return await this.useElevenLabs(text, emotionalContext, 'High emotional intensity requires premium voice');
      }
    }

    // Budget exceeded - use browser TTS
    if (dailyUsage.elevenlabs.cost >= this.costThresholds.elevenlabs.maxDailyBudget) {
      return await this.useBrowserTTS(text, 'Daily budget exceeded, using browser TTS');
    }

    // Default routing logic
    if (analysis.textLength < 300 && qualityPreference !== 'budget') {
      return await this.useElevenLabs(text, emotionalContext, 'Short content with standard quality');
    } else if (analysis.estimatedDuration > 60) {
      return await this.useHumeAI(text, emotionalContext, 'Medium-long content cost optimization');
    } else {
      return await this.useBrowserTTS(text, 'Standard content using browser TTS');
    }
  }

  private async useElevenLabs(
    text: string, 
    emotionalContext?: EmotionalContext, 
    reason: string = ''
  ): Promise<any> {
    try {
      const audioUrl = await enhancedTherapyVoiceService.generateTherapeuticSpeech(
        text,
        emotionalContext || {
          primaryEmotion: 'neutral',
          intensity: 0.5,
          supportLevel: 'medium',
          crisisLevel: false
        }
      );

      const cost = text.length * this.costThresholds.elevenlabs.perCharacter;
      this.recordUsage('elevenlabs', text.length, cost, this.costThresholds.elevenlabs.qualityScore);

      return {
        provider: 'elevenlabs' as const,
        audioUrl,
        reason,
        cost
      };
    } catch (error) {
      console.error('ElevenLabs failed, falling back to browser TTS:', error);
      return this.useBrowserTTS(text, 'ElevenLabs failed, using browser fallback');
    }
  }

  private async useHumeAI(
    text: string, 
    emotionalContext?: EmotionalContext, 
    reason: string = ''
  ): Promise<any> {
    try {
      // Call Hume AI voice synthesis via edge function
      const response = await supabase.functions.invoke('hume-voice-synthesis', {
        body: {
          text,
          emotionalContext,
          model: 'hume-voice-v1',
          voice: 'professional-female'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const estimatedMinutes = this.analyzeContent(text).estimatedDuration / 60;
      const cost = estimatedMinutes * this.costThresholds.hume.perMinute;
      this.recordUsage('hume', text.length, cost, this.costThresholds.hume.qualityScore);

      return {
        provider: 'hume' as const,
        audioUrl: response.data.audioUrl,
        reason,
        cost
      };
    } catch (error) {
      console.error('Hume AI failed, falling back to browser TTS:', error);
      return this.useBrowserTTS(text, 'Hume AI failed, using browser fallback');
    }
  }

  private async useBrowserTTS(text: string, reason: string = ''): Promise<any> {
    // Use browser's built-in speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 0.8;

    // Get a professional-sounding voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Microsoft')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.recordUsage('browser', text.length, 0, this.costThresholds.browser.qualityScore);

    return new Promise((resolve) => {
      utterance.onend = () => {
        resolve({
          provider: 'browser' as const,
          audioUrl: null, // Browser TTS doesn't provide URLs
          reason,
          cost: 0
        });
      };
      
      speechSynthesis.speak(utterance);
    });
  }

  private detectEmotionalIntensity(text: string): number {
    const intensityWords = {
      high: ['urgent', 'crisis', 'panic', 'overwhelming', 'devastating', 'terrible', 'horrible'],
      medium: ['worried', 'anxious', 'sad', 'frustrated', 'concerned', 'upset'],
      low: ['okay', 'fine', 'calm', 'peaceful', 'content', 'happy']
    };

    const textLower = text.toLowerCase();
    
    if (intensityWords.high.some(word => textLower.includes(word))) return 0.9;
    if (intensityWords.medium.some(word => textLower.includes(word))) return 0.6;
    if (intensityWords.low.some(word => textLower.includes(word))) return 0.3;
    
    return 0.5; // neutral
  }

  private detectContentType(text: string): ContentAnalysis['contentType'] {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('breathe') || textLower.includes('meditat')) return 'meditation';
    if (textLower.includes('exercise') || textLower.includes('practice')) return 'exercise';
    if (textLower.includes('crisis') || textLower.includes('emergency')) return 'crisis';
    
    return 'conversation';
  }

  private recordUsage(
    provider: VoiceUsageStats['providerId'],
    characters: number,
    cost: number,
    quality: number
  ): void {
    const usage: VoiceUsageStats = {
      providerId: provider,
      charactersUsed: characters,
      costEstimate: cost,
      qualityRating: quality,
      timestamp: new Date().toISOString()
    };

    this.usageHistory.push(usage);
    
    // Keep only last 100 entries
    if (this.usageHistory.length > 100) {
      this.usageHistory = this.usageHistory.slice(-100);
    }

    // Store in localStorage for persistence
    localStorage.setItem('voice_usage_history', JSON.stringify(this.usageHistory));
  }

  private getDailyUsage() {
    const today = new Date().toDateString();
    const todayUsage = this.usageHistory.filter(
      usage => new Date(usage.timestamp).toDateString() === today
    );

    return {
      elevenlabs: {
        cost: todayUsage
          .filter(u => u.providerId === 'elevenlabs')
          .reduce((sum, u) => sum + u.costEstimate, 0),
        characters: todayUsage
          .filter(u => u.providerId === 'elevenlabs')
          .reduce((sum, u) => sum + u.charactersUsed, 0)
      },
      hume: {
        cost: todayUsage
          .filter(u => u.providerId === 'hume')
          .reduce((sum, u) => sum + u.costEstimate, 0),
        characters: todayUsage
          .filter(u => u.providerId === 'hume')
          .reduce((sum, u) => sum + u.charactersUsed, 0)
      },
      browser: {
        cost: 0,
        characters: todayUsage
          .filter(u => u.providerId === 'browser')
          .reduce((sum, u) => sum + u.charactersUsed, 0)
      }
    };
  }

  // Get usage analytics
  getUsageAnalytics() {
    const dailyUsage = this.getDailyUsage();
    const totalCost = Object.values(dailyUsage).reduce((sum, provider) => sum + provider.cost, 0);
    
    return {
      dailyUsage,
      totalDailyCost: totalCost,
      avgQuality: this.usageHistory.length > 0 
        ? this.usageHistory.reduce((sum, u) => sum + u.qualityRating, 0) / this.usageHistory.length 
        : 0,
      totalRequests: this.usageHistory.length,
      costSavings: this.calculateCostSavings()
    };
  }

  private calculateCostSavings(): number {
    // Calculate how much money saved by using smart routing vs always using ElevenLabs
    const totalCharacters = this.usageHistory.reduce((sum, u) => sum + u.charactersUsed, 0);
    const actualCost = this.usageHistory.reduce((sum, u) => sum + u.costEstimate, 0);
    const elevenLabsCost = totalCharacters * this.costThresholds.elevenlabs.perCharacter;
    
    return elevenLabsCost - actualCost;
  }
}

export const smartVoiceRouter = new SmartVoiceRouter();
