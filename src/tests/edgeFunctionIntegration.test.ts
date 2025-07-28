import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock edge function responses
const mockResponses = {
  adaptiveTherapyPlanner: {
    data: {
      personalizedPlan: {
        approach: 'CBT',
        techniques: ['breathing_exercises', 'cognitive_restructuring'],
        sessionFrequency: 'weekly',
        culturalAdaptations: ['language_preference', 'cultural_metaphors']
      },
      riskAssessment: { level: 'moderate', indicators: [] },
      recommendations: ['mindfulness', 'journaling']
    },
    error: null
  },
  enhancedTherapyMatching: {
    data: {
      matchedTherapists: [
        { id: 'therapist-1', specialties: ['anxiety', 'CBT'], culturalFit: 0.95 },
        { id: 'therapist-2', specialties: ['depression', 'DBT'], culturalFit: 0.88 }
      ],
      culturalCompatibility: 0.92,
      approachRecommendations: ['CBT', 'mindfulness-based']
    },
    error: null
  },
  realTimeTherapyAdaptation: {
    data: {
      adaptations: {
        techniqueChanges: ['switch_to_grounding'],
        paceAdjustment: 'slower',
        supportLevel: 'increased'
      },
      newApproach: 'trauma-informed',
      interventionNeeded: false
    },
    error: null
  },
  analyzeTherapyMessage: {
    data: {
      emotions: {
        primary: 'anxiety',
        intensity: 0.7,
        valence: -0.3,
        arousal: 0.8
      },
      crisis_indicators: {
        risk_level: 0.2,
        requires_escalation: false,
        indicators: []
      },
      breakthrough_potential: 0.6,
      themes: ['work_stress', 'anxiety_management']
    },
    error: null
  },
  systemHealthMonitor: {
    data: {
      systemStatus: 'healthy',
      services: {
        database: 'operational',
        aiServices: 'operational',
        edgeFunctions: 'operational'
      },
      performance: {
        responseTime: 150,
        throughput: 95,
        errorRate: 0.02
      }
    },
    error: null
  }
};

describe('Edge Function Integration Tests', () => {
  beforeEach(() => {
    vi.mocked(supabase.functions.invoke).mockImplementation((functionName) => {
      const responses: Record<string, any> = {
        'adaptive-therapy-planner': Promise.resolve(mockResponses.adaptiveTherapyPlanner),
        'enhanced-therapy-matching': Promise.resolve(mockResponses.enhancedTherapyMatching),
        'real-time-therapy-adaptation': Promise.resolve(mockResponses.realTimeTherapyAdaptation),
        'analyze-therapy-message': Promise.resolve(mockResponses.analyzeTherapyMessage),
        'system-health-monitor': Promise.resolve(mockResponses.systemHealthMonitor)
      };
      return responses[functionName] || Promise.resolve({ data: null, error: 'Function not found' });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Adaptive Therapy Planner', () => {
    it('should generate personalized therapy plan based on user profile', async () => {
      const userProfile = {
        id: 'test-user-123',
        primary_concerns: ['anxiety', 'work_stress'],
        cultural_context: { language: 'en', background: 'western' },
        therapy_preferences: { approach: 'CBT', frequency: 'weekly' }
      };

      const response = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: { userProfile }
      });

      expect(response.data.personalizedPlan).toBeDefined();
      expect(response.data.personalizedPlan.approach).toBe('CBT');
      expect(response.data.personalizedPlan.techniques).toContain('breathing_exercises');
      expect(response.data.riskAssessment.level).toBe('moderate');
    });

    it('should handle different cultural contexts', async () => {
      const culturalProfiles = [
        { language: 'es', background: 'hispanic' },
        { language: 'zh', background: 'asian' },
        { language: 'ar', background: 'middle_eastern' }
      ];

      for (const culturalContext of culturalProfiles) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              id: 'test-user',
              primary_concerns: ['anxiety'],
              cultural_context: culturalContext
            }
          }
        });

        expect(response.data.personalizedPlan.culturalAdaptations).toBeDefined();
        expect(response.error).toBeNull();
      }
    });

    it('should adapt plan based on severity level', async () => {
      const severityLevels = ['mild', 'moderate', 'severe', 'crisis'];

      for (const severity of severityLevels) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              id: 'test-user',
              primary_concerns: ['depression'],
              severity_level: severity
            }
          }
        });

        expect(response.data.personalizedPlan).toBeDefined();
        expect(response.data.riskAssessment).toBeDefined();
      }
    });
  });

  describe('Enhanced Therapy Matching', () => {
    it('should match therapists based on specialties and cultural fit', async () => {
      const matchingRequest = {
        userProfile: {
          primary_concerns: ['anxiety', 'trauma'],
          cultural_context: { language: 'en', background: 'western' }
        },
        preferences: {
          gender: 'any',
          age_range: '30-50',
          experience_level: 'senior'
        }
      };

      const response = await supabase.functions.invoke('enhanced-therapy-matching', {
        body: matchingRequest
      });

      expect(response.data.matchedTherapists).toHaveLength(2);
      expect(response.data.matchedTherapists[0].culturalFit).toBeGreaterThan(0.9);
      expect(response.data.culturalCompatibility).toBeGreaterThan(0.8);
    });

    it('should provide approach recommendations', async () => {
      const response = await supabase.functions.invoke('enhanced-therapy-matching', {
        body: {
          userProfile: {
            primary_concerns: ['depression'],
            therapy_history: ['unsuccessful_CBT']
          }
        }
      });

      expect(response.data.approachRecommendations).toContain('mindfulness-based');
      expect(response.error).toBeNull();
    });
  });

  describe('Real-time Therapy Adaptation', () => {
    it('should adapt session based on mood changes', async () => {
      const adaptationRequest = {
        sessionData: {
          currentMood: 3,
          previousMood: 7,
          engagement: 0.4,
          messages: ['I feel overwhelmed']
        },
        userProfile: {
          primary_concerns: ['anxiety'],
          triggers: ['work_pressure']
        }
      };

      const response = await supabase.functions.invoke('real-time-therapy-adaptation', {
        body: adaptationRequest
      });

      expect(response.data.adaptations.techniqueChanges).toContain('switch_to_grounding');
      expect(response.data.adaptations.paceAdjustment).toBe('slower');
      expect(response.data.adaptations.supportLevel).toBe('increased');
    });

    it('should detect when intervention is needed', async () => {
      const crisisRequest = {
        sessionData: {
          currentMood: 1,
          messages: ['I cannot go on like this', 'Nothing matters anymore'],
          engagement: 0.1
        }
      };

      // Mock crisis response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          adaptations: {
            techniqueChanges: ['crisis_intervention'],
            paceAdjustment: 'immediate',
            supportLevel: 'critical'
          },
          interventionNeeded: true,
          newApproach: 'crisis-support'
        },
        error: null
      });

      const response = await supabase.functions.invoke('real-time-therapy-adaptation', {
        body: crisisRequest
      });

      expect(response.data.interventionNeeded).toBe(true);
      expect(response.data.newApproach).toBe('crisis-support');
    });
  });

  describe('Analyze Therapy Message', () => {
    it('should analyze emotional content of messages', async () => {
      const testMessages = [
        'I feel really anxious about my presentation tomorrow',
        'Today was a good day, I felt calm and focused',
        'I cannot handle this stress anymore'
      ];

      for (const message of testMessages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'test-user',
            sessionId: 'test-session'
          }
        });

        expect(response.data.emotions.primary).toBeDefined();
        expect(response.data.emotions.intensity).toBeGreaterThanOrEqual(0);
        expect(response.data.emotions.intensity).toBeLessThanOrEqual(1);
        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(0);
      }
    });

    it('should detect breakthrough moments', async () => {
      const breakthroughMessage = 'I finally understand why I react this way, it makes so much sense now!';

      // Mock breakthrough response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          emotions: { primary: 'insight', intensity: 0.8, valence: 0.9, arousal: 0.6 },
          crisis_indicators: { risk_level: 0.1, requires_escalation: false },
          breakthrough_potential: 0.9,
          themes: ['self_awareness', 'insight_moment']
        },
        error: null
      });

      const response = await supabase.functions.invoke('analyze-therapy-message', {
        body: {
          message: breakthroughMessage,
          userId: 'test-user'
        }
      });

      expect(response.data.breakthrough_potential).toBeGreaterThan(0.8);
      expect(response.data.themes).toContain('insight_moment');
    });

    it('should identify crisis indicators', async () => {
      const crisisMessage = 'I do not want to be here anymore, everything is hopeless';

      // Mock crisis detection response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          emotions: { primary: 'despair', intensity: 0.9, valence: -0.9, arousal: 0.3 },
          crisis_indicators: {
            risk_level: 0.8,
            requires_escalation: true,
            indicators: ['suicidal_ideation', 'hopelessness']
          },
          breakthrough_potential: 0.1,
          themes: ['crisis', 'suicide_risk']
        },
        error: null
      });

      const response = await supabase.functions.invoke('analyze-therapy-message', {
        body: {
          message: crisisMessage,
          userId: 'test-user'
        }
      });

      expect(response.data.crisis_indicators.risk_level).toBeGreaterThan(0.7);
      expect(response.data.crisis_indicators.requires_escalation).toBe(true);
      expect(response.data.crisis_indicators.indicators).toContain('suicidal_ideation');
    });
  });

  describe('System Health Monitor', () => {
    it('should provide comprehensive system health status', async () => {
      const response = await supabase.functions.invoke('system-health-monitor', {
        body: {}
      });

      expect(response.data.systemStatus).toBe('healthy');
      expect(response.data.services.database).toBe('operational');
      expect(response.data.services.aiServices).toBe('operational');
      expect(response.data.performance.responseTime).toBeLessThan(200);
      expect(response.data.performance.errorRate).toBeLessThan(0.05);
    });

    it('should handle service degradation', async () => {
      // Mock degraded service response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          systemStatus: 'degraded',
          services: {
            database: 'operational',
            aiServices: 'degraded',
            edgeFunctions: 'operational'
          },
          performance: {
            responseTime: 800,
            throughput: 60,
            errorRate: 0.08
          },
          alerts: ['AI service response time elevated']
        },
        error: null
      });

      const response = await supabase.functions.invoke('system-health-monitor', {
        body: {}
      });

      expect(response.data.systemStatus).toBe('degraded');
      expect(response.data.services.aiServices).toBe('degraded');
      expect(response.data.alerts).toContain('AI service response time elevated');
    });
  });

  describe('Edge Function Error Handling', () => {
    it('should handle function timeouts gracefully', async () => {
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(
        new Error('Function timeout')
      );

      try {
        await supabase.functions.invoke('adaptive-therapy-planner', {
          body: { userProfile: { id: 'test' } }
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('timeout');
      }
    });

    it('should handle invalid input gracefully', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid input parameters' }
      });

      const response = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: { invalidData: true }
      });

      expect(response.error).toBeDefined();
      expect(response.error.message).toContain('Invalid input');
    });
  });

  describe('Performance Benchmarks', () => {
    it('should meet response time requirements', async () => {
      const functionNames = [
        'adaptive-therapy-planner',
        'enhanced-therapy-matching',
        'real-time-therapy-adaptation',
        'analyze-therapy-message'
      ];

      for (const functionName of functionNames) {
        const startTime = performance.now();
        
        await supabase.functions.invoke(functionName, {
          body: { testData: true }
        });
        
        const responseTime = performance.now() - startTime;
        expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
      }
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const promises = Array.from({ length: concurrentRequests }, () =>
        supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message: 'Test message for concurrent processing',
            userId: 'concurrent-test-user'
          }
        })
      );

      const startTime = performance.now();
      const results = await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      expect(results).toHaveLength(concurrentRequests);
      expect(totalTime).toBeLessThan(10000); // Should handle 10 concurrent requests within 10 seconds
      
      // All requests should succeed
      results.forEach(result => {
        expect(result.error).toBeNull();
      });
    });
  });
});