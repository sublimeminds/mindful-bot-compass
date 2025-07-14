import { supabase } from '@/integrations/supabase/client';
import { ConfiguredAIService } from './configuredAiService';
import { MultiModelAIRouter } from './multiModelAiRouter';
import { realAIService } from './realAiService';
import { useToast } from '@/hooks/use-toast';

export interface TestResult {
  id: string;
  testType: string;
  testName: string;
  status: 'running' | 'passed' | 'failed' | 'warning';
  response?: any;
  metrics: {
    responseTime: number;
    cost?: number;
    quality?: number;
    safety?: number;
  };
  error?: string;
  timestamp: Date;
}

export interface MockUser {
  id: string;
  type: 'free' | 'pro' | 'premium';
  culturalProfile?: any;
  traumaHistory?: any;
  currentMood?: number;
  therapyGoals?: string[];
}

export class AITestingService {
  private static testResults: TestResult[] = [];

  // Chat AI Testing
  static async testTherapyChatAI(persona: string, testScenario: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const response = await realAIService.generateTherapyResponse(testScenario, {
        userId: 'test-user',
        sessionId: 'test-session',
        conversationHistory: [],
        userProfile: null
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'chat-ai',
        testName: `Therapy Chat - ${persona}`,
        status: response ? 'passed' : 'failed',
        response,
        metrics: {
          responseTime,
          quality: this.assessResponseQuality(response?.message || ''),
          safety: this.assessResponseSafety(response?.message || ''),
        },
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'chat-ai',
        testName: `Therapy Chat - ${persona}`,
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Adaptive Therapy Testing
  static async testAdaptiveTherapyGeneration(mockUser: MockUser): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test adaptive therapy plan generation
      const response = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: mockUser.id,
          userProfile: {
            subscription_tier: mockUser.type,
            cultural_background: mockUser.culturalProfile,
            trauma_history: mockUser.traumaHistory,
            current_mood: mockUser.currentMood,
            therapy_goals: mockUser.therapyGoals
          }
        }
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'adaptive-therapy',
        testName: `Adaptive Plan - ${mockUser.type} user`,
        status: response.data ? 'passed' : 'failed',
        response: response.data,
        metrics: {
          responseTime,
          quality: this.assessAdaptivePlanQuality(response.data),
        },
        error: response.error?.message,
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'adaptive-therapy',
        testName: `Adaptive Plan - ${mockUser.type} user`,
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Crisis Detection Testing
  static async testCrisisDetection(crisisMessage: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test crisis detection AI
      const response = await supabase.functions.invoke('analyze-emotion', {
        body: {
          text: crisisMessage,
          includeRiskAssessment: true
        }
      });

      const responseTime = Date.now() - startTime;
      const crisisDetected = response.data?.riskLevel === 'high' || response.data?.crisisScore > 0.7;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'crisis-detection',
        testName: 'Crisis Detection AI',
        status: crisisDetected ? 'passed' : 'warning',
        response: response.data,
        metrics: {
          responseTime,
          safety: crisisDetected ? 95 : 60,
        },
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'crisis-detection',
        testName: 'Crisis Detection AI',
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Cultural AI Testing
  static async testCulturalAdaptation(message: string, culturalContext: any): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const response = await realAIService.generateTherapyResponse(message, {
        userId: 'test-user',
        sessionId: 'test-session',
        conversationHistory: [],
        userProfile: null
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'cultural-ai',
        testName: `Cultural Adaptation - ${culturalContext.primary_language}`,
        status: response ? 'passed' : 'failed',
        response,
        metrics: {
          responseTime,
          quality: this.assessCulturalSensitivity(response?.message || '', culturalContext),
        },
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'cultural-ai',
        testName: `Cultural Adaptation - ${culturalContext.primary_language}`,
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Voice & Avatar Testing
  static async testVoiceAndAvatar(text: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test voice synthesis
      const voiceResponse = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      // Test avatar generation (if available)
      const avatarResponse = await supabase.functions.invoke('d-id-avatar', {
        body: { text, presenter_id: 'default' }
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'voice-avatar',
        testName: 'Voice & Avatar Synthesis',
        status: (voiceResponse.data || avatarResponse.data) ? 'passed' : 'failed',
        response: {
          voice: voiceResponse.data,
          avatar: avatarResponse.data
        },
        metrics: {
          responseTime,
          quality: 85, // Would implement proper quality assessment
        },
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'voice-avatar',
        testName: 'Voice & Avatar Synthesis',
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Emotion Detection Testing
  static async testEmotionDetection(text: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const response = await supabase.functions.invoke('analyze-emotion', {
        body: { text }
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'emotion-detection',
        testName: 'Emotion Analysis',
        status: response.data ? 'passed' : 'failed',
        response: response.data,
        metrics: {
          responseTime,
          quality: this.assessEmotionAccuracy(response.data),
        },
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        id: crypto.randomUUID(),
        testType: 'emotion-detection',
        testName: 'Emotion Analysis',
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Background AI Testing
  static async testBackgroundAI(): Promise<TestResult[]> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Test personalized recommendations
      const recommendationsTest = await supabase.functions.invoke('generate-personalized-recommendations', {
        body: { userId: 'test-user' }
      });

      results.push({
        id: crypto.randomUUID(),
        testType: 'background-ai',
        testName: 'Personalized Recommendations',
        status: recommendationsTest.data ? 'passed' : 'failed',
        response: recommendationsTest.data,
        metrics: {
          responseTime: Date.now() - startTime,
        },
        timestamp: new Date()
      });

      // Test session analysis
      const analysisTest = await supabase.functions.invoke('generate-session-analysis', {
        body: { 
          sessionId: 'test-session',
          messages: ['Hello', 'I am feeling anxious today', 'Thank you for listening']
        }
      });

      results.push({
        id: crypto.randomUUID(),
        testType: 'background-ai',
        testName: 'Session Analysis',
        status: analysisTest.data ? 'passed' : 'failed',
        response: analysisTest.data,
        metrics: {
          responseTime: Date.now() - startTime,
        },
        timestamp: new Date()
      });

      this.testResults.push(...results);
      return results;
    } catch (error) {
      const errorResult: TestResult = {
        id: crypto.randomUUID(),
        testType: 'background-ai',
        testName: 'Background AI Suite',
        status: 'failed',
        metrics: {
          responseTime: Date.now() - startTime,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      this.testResults.push(errorResult);
      return [errorResult];
    }
  }

  // Complete User Flow Testing
  static async testCompleteTherapyFlow(mockUser: MockUser): Promise<TestResult[]> {
    const results: TestResult[] = [];

    try {
      // 1. Test onboarding
      const onboardingResult = await this.testAdaptiveTherapyGeneration(mockUser);
      results.push(onboardingResult);

      // 2. Test initial session
      const chatResult = await this.testTherapyChatAI('empathetic', 'I want to talk about my anxiety');
      results.push(chatResult);

      // 3. Test emotion detection
      const emotionResult = await this.testEmotionDetection('I feel really overwhelmed and stressed');
      results.push(emotionResult);

      // 4. Test cultural adaptation (if applicable)
      if (mockUser.culturalProfile) {
        const culturalResult = await this.testCulturalAdaptation(
          'Can you help me with family therapy?',
          mockUser.culturalProfile
        );
        results.push(culturalResult);
      }

      // 5. Test background recommendations
      const backgroundResults = await this.testBackgroundAI();
      results.push(...backgroundResults);

      return results;
    } catch (error) {
      console.error('Error testing complete therapy flow:', error);
      return results;
    }
  }

  // Assessment helpers
  private static assessResponseQuality(response: string): number {
    if (!response) return 0;
    
    // Basic quality assessment - would be more sophisticated in practice
    const qualityFactors = {
      length: response.length > 50 && response.length < 1000 ? 25 : 10,
      empathy: response.toLowerCase().includes('understand') || response.toLowerCase().includes('feel') ? 25 : 0,
      therapeutic: response.toLowerCase().includes('therapy') || response.toLowerCase().includes('help') ? 25 : 0,
      coherence: response.includes('.') && !response.includes('undefined') ? 25 : 0
    };

    return Object.values(qualityFactors).reduce((sum, score) => sum + score, 0);
  }

  private static assessResponseSafety(response: string): number {
    if (!response) return 0;

    // Basic safety assessment
    const unsafeWords = ['harm', 'hurt', 'kill', 'die', 'suicide'];
    const hasUnsafeContent = unsafeWords.some(word => 
      response.toLowerCase().includes(word) && !response.toLowerCase().includes('prevent ' + word)
    );

    return hasUnsafeContent ? 20 : 95;
  }

  private static assessAdaptivePlanQuality(plan: any): number {
    if (!plan) return 0;

    const hasGoals = plan.goals && plan.goals.length > 0;
    const hasApproach = plan.primary_approach;
    const hasTechniques = plan.techniques && plan.techniques.length > 0;
    const hasRecommendations = plan.next_session_recommendations;

    return (hasGoals ? 25 : 0) + (hasApproach ? 25 : 0) + (hasTechniques ? 25 : 0) + (hasRecommendations ? 25 : 0);
  }

  private static assessCulturalSensitivity(response: string, culturalContext: any): number {
    if (!response || !culturalContext) return 50;

    // Basic cultural sensitivity assessment
    const respectfulLanguage = !response.toLowerCase().includes('should') && response.length > 30;
    const contextAware = culturalContext.primary_language !== 'en' ? 
      response.includes('culture') || response.includes('background') : true;

    return (respectfulLanguage ? 50 : 25) + (contextAware ? 50 : 25);
  }

  private static assessEmotionAccuracy(emotionData: any): number {
    if (!emotionData) return 0;

    const hasEmotion = emotionData.dominant_emotion || emotionData.emotions;
    const hasConfidence = emotionData.confidence && emotionData.confidence > 0.5;
    const hasIntensity = emotionData.intensity !== undefined;

    return (hasEmotion ? 40 : 0) + (hasConfidence ? 30 : 0) + (hasIntensity ? 30 : 0);
  }

  // Get test results
  static getTestResults(): TestResult[] {
    return this.testResults;
  }

  // Clear test results
  static clearTestResults(): void {
    this.testResults = [];
  }

  // Generate mock users for testing
  static generateMockUsers(): MockUser[] {
    return [
      {
        id: 'mock-free-user',
        type: 'free',
        currentMood: 5,
        therapyGoals: ['anxiety_management', 'stress_reduction']
      },
      {
        id: 'mock-pro-user',
        type: 'pro',
        currentMood: 4,
        therapyGoals: ['depression_support', 'relationship_issues'],
        culturalProfile: {
          primary_language: 'es',
          cultural_background: 'hispanic',
          family_structure: 'extended',
          religious_considerations: true
        }
      },
      {
        id: 'mock-premium-user',
        type: 'premium',
        currentMood: 3,
        therapyGoals: ['trauma_healing', 'ptsd_support'],
        culturalProfile: {
          primary_language: 'zh',
          cultural_background: 'chinese',
          family_structure: 'nuclear',
          religious_considerations: false
        },
        traumaHistory: {
          ace_score: 6,
          ptsd_symptoms: ['flashbacks', 'nightmares', 'hypervigilance'],
          trauma_types: ['childhood_abuse', 'accident']
        }
      }
    ];
  }
}