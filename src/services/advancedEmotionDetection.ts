import { pipeline, env } from '@huggingface/transformers';

// Configure to run locally
env.allowRemoteModels = false;
env.allowLocalModels = true;

export interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  intensity: number; // 1-10 scale
  timestamp: Date;
  microExpressions?: string[];
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
}

export interface FacialLandmarks {
  leftEye: { x: number; y: number }[];
  rightEye: { x: number; y: number }[];
  mouth: { x: number; y: number }[];
  eyebrows: { x: number; y: number }[];
  nose: { x: number; y: number }[];
}

export type EmotionType = 
  // Primary emotions
  | 'joy' | 'excitement' | 'contentment' | 'love' | 'pride'
  | 'sadness' | 'grief' | 'melancholy' | 'disappointment'
  | 'anger' | 'frustration' | 'irritation' | 'rage'
  | 'fear' | 'anxiety' | 'panic' | 'worry' | 'nervousness'
  | 'surprise' | 'amazement' | 'confusion' | 'curiosity'
  | 'disgust' | 'contempt' | 'shame' | 'guilt'
  // Therapeutic emotions
  | 'trust' | 'safety' | 'acceptance' | 'empathy' | 'compassion'
  | 'understanding' | 'validation' | 'encouragement' | 'support'
  | 'motivation' | 'hope' | 'vulnerability' | 'openness'
  | 'breakthrough' | 'insight' | 'clarity' | 'resistance'
  | 'defensiveness' | 'reluctance' | 'withdrawal'
  // Basic avatar emotions (for compatibility)
  | 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'
  // Additional therapeutic states
  | 'calm' | 'celebration' | 'invitation' | 'terror' | 'apprehension'
  | 'shock' | 'wonder' | 'bewilderment' | 'perplexity' | 'revulsion'
  | 'disdain' | 'security' | 'rawness' | 'exposure' | 'realization';

export class AdvancedEmotionDetection {
  private emotionClassifier: any = null;
  private faceDetector: any = null;
  private isInitialized = false;
  private emotionHistory: EmotionResult[] = [];

  async initialize(): Promise<void> {
    try {
      // Initialize emotion classification model
      this.emotionClassifier = await pipeline(
        'text-classification',
        'j-hartmann/emotion-english-distilroberta-base',
        { device: 'webgpu' }
      );

      this.isInitialized = true;
      console.log('Advanced emotion detection initialized');
    } catch (error) {
      console.warn('Failed to initialize ML models, falling back to heuristics:', error);
      this.isInitialized = false;
    }
  }

  async detectFromCamera(videoElement: HTMLVideoElement): Promise<EmotionResult | null> {
    if (!videoElement || videoElement.videoWidth === 0) return null;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0);

      // Extract facial features and analyze
      const landmarks = await this.extractFacialLandmarks(canvas);
      const emotion = await this.analyzeImageForEmotion(canvas, landmarks);

      // Add to history for temporal analysis
      if (emotion) {
        this.emotionHistory.push(emotion);
        // Keep only last 30 seconds of history
        const cutoff = new Date(Date.now() - 30000);
        this.emotionHistory = this.emotionHistory.filter(e => e.timestamp > cutoff);
      }

      return emotion;
    } catch (error) {
      console.error('Camera emotion detection error:', error);
      return null;
    }
  }

  async detectFromText(text: string): Promise<EmotionResult | null> {
    if (!text.trim()) return null;

    try {
      if (this.isInitialized && this.emotionClassifier) {
        // Use ML model for text analysis
        const results = await this.emotionClassifier(text);
        const topResult = results[0];
        
        return {
          emotion: this.mapMLEmotionToTherapeutic(topResult.label),
          confidence: topResult.score,
          intensity: Math.ceil(topResult.score * 10),
          timestamp: new Date(),
          valence: this.calculateValence(topResult.label),
          arousal: this.calculateArousal(topResult.label)
        };
      } else {
        // Fallback to enhanced keyword analysis
        return this.analyzeTextWithKeywords(text);
      }
    } catch (error) {
      console.error('Text emotion detection error:', error);
      return this.analyzeTextWithKeywords(text);
    }
  }

  async detectFromVoice(audioData: Float32Array): Promise<EmotionResult | null> {
    try {
      // Analyze voice tone characteristics
      const pitch = this.analyzePitch(audioData);
      const energy = this.analyzeEnergy(audioData);
      const tempo = this.analyzeTempo(audioData);

      // Map audio features to emotions
      const emotion = this.mapAudioFeaturesToEmotion(pitch, energy, tempo);
      
      return {
        emotion,
        confidence: 0.7, // Voice analysis confidence
        intensity: Math.ceil(energy * 10),
        timestamp: new Date(),
        valence: this.getEmotionValence(emotion),
        arousal: energy
      };
    } catch (error) {
      console.error('Voice emotion detection error:', error);
      return null;
    }
  }

  fuseMultiModalEmotions(
    cameraEmotion: EmotionResult | null,
    textEmotion: EmotionResult | null,
    voiceEmotion: EmotionResult | null
  ): EmotionResult | null {
    const emotions = [cameraEmotion, textEmotion, voiceEmotion].filter(Boolean) as EmotionResult[];
    
    if (emotions.length === 0) return null;
    if (emotions.length === 1) return emotions[0];

    // Weight different modalities
    const weights = {
      camera: 0.4,
      text: 0.4,
      voice: 0.2
    };

    // Simple weighted average for now
    let totalConfidence = 0;
    let totalIntensity = 0;
    let totalValence = 0;
    let totalArousal = 0;
    let weightSum = 0;

    emotions.forEach((emotion, index) => {
      const weight = index === 0 ? weights.camera : index === 1 ? weights.text : weights.voice;
      totalConfidence += emotion.confidence * weight;
      totalIntensity += emotion.intensity * weight;
      totalValence += emotion.valence * weight;
      totalArousal += emotion.arousal * weight;
      weightSum += weight;
    });

    // Choose the emotion with highest confidence
    const primaryEmotion = emotions.reduce((prev, current) => 
      current.confidence > prev.confidence ? current : prev
    );

    return {
      emotion: primaryEmotion.emotion,
      confidence: totalConfidence / weightSum,
      intensity: Math.round(totalIntensity / weightSum),
      timestamp: new Date(),
      valence: totalValence / weightSum,
      arousal: totalArousal / weightSum,
      microExpressions: emotions.flatMap(e => e.microExpressions || [])
    };
  }

  getEmotionalTrajectory(): EmotionResult[] {
    return this.emotionHistory.slice(-10); // Last 10 emotions
  }

  getAverageEmotionOverTime(timeWindowMs: number = 10000): EmotionResult | null {
    const cutoff = new Date(Date.now() - timeWindowMs);
    const recentEmotions = this.emotionHistory.filter(e => e.timestamp > cutoff);
    
    if (recentEmotions.length === 0) return null;

    // Calculate averages
    const avgConfidence = recentEmotions.reduce((sum, e) => sum + e.confidence, 0) / recentEmotions.length;
    const avgIntensity = recentEmotions.reduce((sum, e) => sum + e.intensity, 0) / recentEmotions.length;
    const avgValence = recentEmotions.reduce((sum, e) => sum + e.valence, 0) / recentEmotions.length;
    const avgArousal = recentEmotions.reduce((sum, e) => sum + e.arousal, 0) / recentEmotions.length;

    // Most frequent emotion
    const emotionCounts = new Map<string, number>();
    recentEmotions.forEach(e => {
      emotionCounts.set(e.emotion, (emotionCounts.get(e.emotion) || 0) + 1);
    });
    
    const mostFrequentEmotion = Array.from(emotionCounts.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
      emotion: mostFrequentEmotion as EmotionType,
      confidence: avgConfidence,
      intensity: Math.round(avgIntensity),
      timestamp: new Date(),
      valence: avgValence,
      arousal: avgArousal
    };
  }

  // Private helper methods
  private async extractFacialLandmarks(canvas: HTMLCanvasElement): Promise<FacialLandmarks | null> {
    // Placeholder for facial landmark detection
    // In production, would use MediaPipe or similar
    return null;
  }

  private async analyzeImageForEmotion(canvas: HTMLCanvasElement, landmarks: FacialLandmarks | null): Promise<EmotionResult | null> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Enhanced heuristic analysis
    const brightness = this.calculateBrightness(imageData);
    const colorfulness = this.calculateColorfulness(imageData);
    const contrast = this.calculateContrast(imageData);

    return this.mapVisualFeaturesToEmotion(brightness, colorfulness, contrast);
  }

  private analyzeTextWithKeywords(text: string): EmotionResult {
    const emotionKeywords = {
      joy: ['happy', 'joyful', 'delighted', 'elated', 'cheerful', 'glad'],
      excitement: ['excited', 'thrilled', 'exhilarated', 'energized', 'pumped'],
      sadness: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'dejected'],
      anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'apprehensive'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'enraged'],
      fear: ['scared', 'afraid', 'terrified', 'frightened', 'panicked'],
      surprise: ['surprised', 'amazed', 'shocked', 'astonished', 'stunned'],
      disgust: ['disgusted', 'revolted', 'repulsed', 'sickened'],
      trust: ['trust', 'confident', 'secure', 'safe', 'comfortable'],
      anticipation: ['hopeful', 'optimistic', 'expectant', 'eager'],
      shame: ['ashamed', 'guilty', 'embarrassed', 'remorseful'],
      vulnerability: ['vulnerable', 'exposed', 'raw', 'open'],
      breakthrough: ['breakthrough', 'insight', 'realization', 'clarity', 'understanding']
    };

    const lowerText = text.toLowerCase();
    let bestMatch = { emotion: 'neutral' as EmotionType, score: 0 };

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > bestMatch.score) {
        bestMatch = { emotion: emotion as EmotionType, score: matches };
      }
    });

    const confidence = Math.min(bestMatch.score * 0.3, 0.9);
    return {
      emotion: bestMatch.emotion,
      confidence,
      intensity: Math.ceil(confidence * 10),
      timestamp: new Date(),
      valence: this.getEmotionValence(bestMatch.emotion),
      arousal: this.getEmotionArousal(bestMatch.emotion)
    };
  }

  private mapMLEmotionToTherapeutic(mlEmotion: string): EmotionType {
    const mapping: Record<string, EmotionType> = {
      'joy': 'joy',
      'sadness': 'sadness',
      'anger': 'anger',
      'fear': 'fear',
      'surprise': 'surprise',
      'disgust': 'disgust',
      'neutral': 'neutral'
    };
    return mapping[mlEmotion.toLowerCase()] || 'neutral';
  }

  private calculateBrightness(imageData: ImageData): number {
    const data = imageData.data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return sum / (data.length / 4) / 255;
  }

  private calculateColorfulness(imageData: ImageData): number {
    const data = imageData.data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      sum += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
    }
    return sum / (data.length / 4) / 255;
  }

  private calculateContrast(imageData: ImageData): number {
    // Simplified contrast calculation
    const data = imageData.data;
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      min = Math.min(min, brightness);
      max = Math.max(max, brightness);
    }
    return (max - min) / 255;
  }

  private mapVisualFeaturesToEmotion(brightness: number, colorfulness: number, contrast: number): EmotionResult {
    let emotion: EmotionType = 'neutral';
    let confidence = 0.5;

    if (brightness > 0.7 && colorfulness > 0.3) {
      emotion = 'joy';
      confidence = 0.7;
    } else if (brightness < 0.3) {
      emotion = 'sadness';
      confidence = 0.6;
    } else if (colorfulness > 0.6 && contrast > 0.4) {
      emotion = 'excitement';
      confidence = 0.6;
    } else if (contrast < 0.2) {
      emotion = 'calm';
      confidence = 0.5;
    }

    return {
      emotion,
      confidence,
      intensity: Math.ceil(confidence * 10),
      timestamp: new Date(),
      valence: this.getEmotionValence(emotion),
      arousal: this.getEmotionArousal(emotion)
    };
  }

  private analyzePitch(audioData: Float32Array): number {
    // Simplified pitch analysis
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += Math.abs(audioData[i]);
    }
    return Math.min(sum / audioData.length, 1);
  }

  private analyzeEnergy(audioData: Float32Array): number {
    let energy = 0;
    for (let i = 0; i < audioData.length; i++) {
      energy += audioData[i] * audioData[i];
    }
    return Math.min(Math.sqrt(energy / audioData.length), 1);
  }

  private analyzeTempo(audioData: Float32Array): number {
    // Simplified tempo analysis
    return 0.5; // Placeholder
  }

  private mapAudioFeaturesToEmotion(pitch: number, energy: number, tempo: number): EmotionType {
    if (energy > 0.7 && pitch > 0.6) return 'excitement';
    if (energy < 0.3 && pitch < 0.4) return 'sadness';
    if (energy > 0.6 && pitch < 0.3) return 'anger';
    if (energy < 0.4 && pitch > 0.7) return 'fear';
    return 'neutral';
  }

  private calculateValence(emotion: string): number {
    const valenceMap: Record<string, number> = {
      joy: 0.8, excitement: 0.7, contentment: 0.6, love: 0.9, pride: 0.7,
      sadness: -0.6, grief: -0.8, melancholy: -0.4, disappointment: -0.5,
      anger: -0.3, frustration: -0.4, irritation: -0.2, rage: -0.8,
      fear: -0.5, anxiety: -0.4, panic: -0.7, worry: -0.3, nervousness: -0.2,
      surprise: 0.1, amazement: 0.4, confusion: -0.1, curiosity: 0.3,
      disgust: -0.6, contempt: -0.5, shame: -0.7, guilt: -0.6,
      trust: 0.5, safety: 0.6, acceptance: 0.4, empathy: 0.3, compassion: 0.5,
      neutral: 0
    };
    return valenceMap[emotion] || 0;
  }

  private calculateArousal(emotion: string): number {
    const arousalMap: Record<string, number> = {
      joy: 0.6, excitement: 0.9, contentment: 0.3, love: 0.5, pride: 0.6,
      sadness: 0.3, grief: 0.5, melancholy: 0.2, disappointment: 0.4,
      anger: 0.8, frustration: 0.7, irritation: 0.5, rage: 0.9,
      fear: 0.8, anxiety: 0.7, panic: 0.9, worry: 0.6, nervousness: 0.5,
      surprise: 0.8, amazement: 0.7, confusion: 0.4, curiosity: 0.6,
      disgust: 0.6, contempt: 0.4, shame: 0.5, guilt: 0.5,
      trust: 0.3, safety: 0.2, acceptance: 0.3, empathy: 0.4, compassion: 0.4,
      neutral: 0.3
    };
    return arousalMap[emotion] || 0.3;
  }

  private getEmotionValence(emotion: EmotionType): number {
    return this.calculateValence(emotion);
  }

  private getEmotionArousal(emotion: EmotionType): number {
    return this.calculateArousal(emotion);
  }
}

export const emotionDetector = new AdvancedEmotionDetection();
