import { MultiModelAIRouter } from '@/services/multiModelAiRouter';
import { TherapyContextManager } from '@/services/therapyContextManager';
import { SessionAnalyticsService } from '@/services/sessionAnalyticsService';
import { MoodAnalyticsService } from '@/services/moodAnalyticsService';

// Mock Supabase for integration tests
const mockSupabase = {
  functions: {
    invoke: jest.fn()
  },
  from: jest.fn()
};

jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('Integration Tests - AI System End-to-End', () => {
  let contextManager: TherapyContextManager;

  beforeEach(() => {
    jest.clearAllMocks();
    contextManager = TherapyContextManager.getInstance();
  });

  describe('Complete Therapy Session Flow', () => {
    test('should handle full therapy session with context and analytics', async () => {
      const userId = 'test-user-id';
      const sessionId = 'test-session-id';

      // Step 1: Create therapy context
      const mockContextData = {
        id: 'context-id',
        user_id: userId,
        session_id: sessionId,
        current_ai_model: 'claude-opus-4-20250514',
        current_voice_id: 'voice-1',
        current_avatar_state: 'empathetic',
        cultural_profile: { language: 'en', region: 'US' },
        emotional_state: { mood: 'anxious', energy: 0.4 },
        context_data: { sessionType: 'crisis', previousSessions: 3 }
      };

      mockSupabase.from
        .mockReturnValueOnce({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ 
                data: mockContextData, 
                error: null 
              }))
            }))
          }))
        })
        // Step 5: Log mood entry
        .mockReturnValueOnce({
          insert: jest.fn(() => Promise.resolve({ error: null }))
        })
        // Step 6: Analytics queries
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: [
                    {
                      id: sessionId,
                      user_id: userId,
                      start_time: '2024-01-01T10:00:00Z',
                      end_time: '2024-01-01T10:45:00Z',
                      mood_before: 3,
                      mood_after: 7,
                      techniques: ['crisis-intervention', 'grounding']
                    }
                  ], 
                  error: null 
                }))
              }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: [
                    {
                      id: '1',
                      user_id: userId,
                      overall: 7,
                      energy: 6,
                      anxiety: 3,
                      notes: 'Feeling better after session',
                      triggers: ['therapy'],
                      created_at: '2024-01-01T11:00:00Z'
                    }
                  ], 
                  error: null 
                }))
              }))
            }))
          }))
        });

      // Create context
      const contextId = await contextManager.createContext({
        userId,
        sessionId,
        currentAiModel: 'claude-opus-4-20250514',
        currentVoiceId: 'voice-1',
        currentAvatarState: 'empathetic',
        culturalProfile: { language: 'en', region: 'US' },
        emotionalState: { mood: 'anxious', energy: 0.4 },
        contextData: { sessionType: 'crisis', previousSessions: 3 }
      });

      expect(contextId).toBe('context-id');

      // Step 2: AI Model Selection for crisis
      const selectedModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'crisis',
        urgency: 'critical',
        complexity: 'complex',
        culturalContext: 'US',
        userTier: 'premium'
      });

      expect(selectedModel.id).toBe('claude-opus-4-20250514');
      expect(selectedModel.capabilities).toContain('crisis');

      // Step 3: Route crisis message
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          message: 'I understand you\'re going through a difficult time. Let\'s work through this together.',
          confidence: 0.95,
          technique: 'crisis-intervention',
          emotion: 'supportive',
          recommendations: ['grounding-exercise', 'breathing-technique']
        },
        error: null
      });

      const aiResponse = await MultiModelAIRouter.routeMessage(
        'I\'m having a panic attack and don\'t know what to do',
        {
          userId,
          sessionId,
          systemPrompt: 'You are a crisis-trained AI therapist.',
          culturalContext: { language: 'en', region: 'US' },
          emotionalState: { mood: 'anxious', energy: 0.4 }
        },
        {
          taskType: 'crisis',
          urgency: 'critical',
          complexity: 'complex',
          userTier: 'premium'
        }
      );

      expect(aiResponse.message).toContain('difficult time');
      expect(aiResponse.modelUsed).toBe('Claude Opus 4');
      expect(aiResponse.technique).toBe('crisis-intervention');

      // Step 4: Update context with session results
      const updateResult = await contextManager.updateContext(contextId, {
        emotionalState: { mood: 'calmer', energy: 0.6 },
        contextData: { 
          sessionType: 'crisis',
          previousSessions: 3,
          lastResponse: aiResponse.technique,
          moodImprovement: true
        }
      });

      expect(updateResult).toBe(true);

      // Step 5: Log mood improvement
      const moodLogResult = await MoodAnalyticsService.logMoodEntry(userId, {
        overall: 7,
        energy: 6,
        anxiety: 3,
        notes: 'Feeling better after session',
        factors: ['therapy']
      });

      expect(moodLogResult).toBe(true);

      // Step 6: Verify analytics capture session impact
      const sessionAnalytics = await SessionAnalyticsService.getSessionAnalytics(userId);
      const moodEntries = await MoodAnalyticsService.getMoodEntries(userId, 1);

      expect(sessionAnalytics.totalSessions).toBe(1);
      expect(sessionAnalytics.moodImprovement).toBeGreaterThan(0);
      expect(moodEntries).toHaveLength(1);
      expect(moodEntries[0].overall).toBe(7);
    });
  });

  describe('Multi-Session Context Continuity', () => {
    test('should maintain context across multiple sessions', async () => {
      const userId = 'test-user-id';
      
      // Setup context fetch mock
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: {
                id: 'context-id',
                user_id: userId,
                session_id: 'session-1',
                current_ai_model: 'claude-sonnet-4-20250514',
                cultural_profile: { language: 'en', communicationStyle: 'direct' },
                emotional_state: { mood: 'improving', energy: 0.7 },
                context_data: { 
                  previousSessions: 5,
                  preferredTechniques: ['cbt', 'mindfulness'],
                  triggerPatterns: ['work-stress', 'sleep-issues']
                }
              },
              error: null
            }))
          }))
        }))
      });

      // Fetch previous context
      const previousContext = await contextManager.getContext('context-id');
      
      expect(previousContext).toBeDefined();
      expect(previousContext?.contextData.previousSessions).toBe(5);
      expect(previousContext?.contextData.preferredTechniques).toContain('cbt');

      // Select model based on historical context
      const modelName = await contextManager.selectOptimalModel(
        'daily-therapy',
        previousContext?.culturalProfile,
        'premium'
      );

      expect(modelName).toBe('claude-opus-4-20250514'); // Cultural-aware model

      // Verify context influences AI response preparation
      expect(previousContext?.emotionalState.mood).toBe('improving');
      expect(previousContext?.contextData.triggerPatterns).toContain('work-stress');
    });
  });

  describe('Cultural Context Integration', () => {
    test('should adapt AI responses based on cultural context', async () => {
      const culturalContext = {
        language: 'es',
        region: 'MX',
        culturalBackground: 'hispanic',
        familyStructure: 'extended',
        communicationStyle: 'indirect'
      };

      // Create culturally-aware context
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: {
                id: 'cultural-context-id',
                user_id: 'cultural-user',
                current_ai_model: 'claude-opus-4-20250514',
                cultural_profile: culturalContext,
                emotional_state: { mood: 'neutral' },
                context_data: {}
              },
              error: null
            }))
          }))
        }))
      });

      const contextId = await contextManager.createContext({
        userId: 'cultural-user',
        currentAiModel: 'claude-opus-4-20250514',
        culturalProfile: culturalContext,
        emotionalState: { mood: 'neutral' },
        contextData: {}
      });

      // Verify cultural model selection
      const selectedModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'cultural',
        urgency: 'medium',
        complexity: 'moderate',
        culturalContext: 'hispanic',
        userTier: 'premium'
      });

      expect(selectedModel.capabilities).toContain('cultural');
      expect(selectedModel.id).toBe('claude-opus-4-20250514');

      // Mock culturally-adapted response
      mockSupabase.functions.invoke.mockResolvedValue({
        data: {
          message: 'Entiendo que la familia es muy importante para ti. Hablemos de cómo podemos incluir a tu familia en tu proceso de sanación.',
          confidence: 0.92,
          culturalAdaptations: ['family-centric', 'indirect-communication'],
          technique: 'family-systems-therapy'
        },
        error: null
      });

      const response = await MultiModelAIRouter.routeMessage(
        'Estoy preocupado por mi familia',
        {
          userId: 'cultural-user',
          culturalContext,
          systemPrompt: 'You are a culturally-sensitive AI therapist specializing in Hispanic family dynamics.'
        },
        {
          taskType: 'cultural',
          urgency: 'medium',
          complexity: 'moderate',
          userTier: 'premium'
        }
      );

      expect(response.culturalAdaptations).toContain('family-centric');
      expect(response.technique).toBe('family-systems-therapy');
    });
  });

  describe('Performance Monitoring Integration', () => {
    test('should track performance metrics across the system', async () => {
      const userId = 'perf-test-user';
      
      // Mock performance logging
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => Promise.resolve({ error: null }))
      });

      // Log model performance
      await contextManager.logModelPerformance(
        'claude-opus-4-20250514',
        'crisis',
        1200, // response time
        0.95, // quality score
        4.8,  // user satisfaction
        0.015, // cost
        'emergency-intervention'
      );

      // Mock performance metrics retrieval
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => Promise.resolve({
                data: [
                  {
                    model_name: 'claude-opus-4-20250514',
                    task_type: 'crisis',
                    response_time_ms: 1200,
                    quality_score: 0.95,
                    user_satisfaction_score: 4.8,
                    cost_per_request: 0.015,
                    cultural_context: 'emergency-intervention',
                    success_rate: 95.0
                  }
                ],
                error: null
              }))
            }))
          }))
        }))
      });

      const metrics = await contextManager.getPerformanceMetrics('claude-opus-4-20250514', 'crisis');

      expect(metrics).toHaveLength(1);
      expect(metrics[0].quality_score).toBe(0.95);
      expect(metrics[0].success_rate).toBe(95.0);
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should handle cascading failures gracefully', async () => {
      const userId = 'error-test-user';

      // Simulate context creation failure
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: new Error('Context creation failed')
            }))
          }))
        }))
      });

      const contextId = await contextManager.createContext({
        userId,
        currentAiModel: 'claude-opus-4-20250514',
        culturalProfile: {},
        emotionalState: {},
        contextData: {}
      });

      expect(contextId).toBeNull();

      // System should still function with fallback model selection
      const selectedModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'chat',
        urgency: 'medium',
        complexity: 'simple',
        userTier: 'free'
      });

      expect(selectedModel).toBeDefined();
      expect(selectedModel.available).toBe(true);

      // Simulate AI service failure with fallback
      mockSupabase.functions.invoke
        .mockRejectedValueOnce(new Error('Primary model failed'))
        .mockRejectedValueOnce(new Error('Fallback model failed'));

      const response = await MultiModelAIRouter.routeMessage(
        'Hello',
        { userId },
        {
          taskType: 'chat',
          urgency: 'medium',
          complexity: 'simple',
          userTier: 'free'
        }
      );

      // Should provide ultimate fallback
      expect(response.message).toContain('technical difficulties');
      expect(response.confidence).toBe(0.5);
    });
  });

  describe('Real-Time Analytics Integration', () => {
    test('should provide real-time insights during active sessions', async () => {
      const userId = 'realtime-user';
      
      // Mock real-time mood tracking
      const moodProgression = [
        { overall: 3, anxiety: 8, timestamp: '10:00' },
        { overall: 5, anxiety: 6, timestamp: '10:15' },
        { overall: 7, anxiety: 4, timestamp: '10:30' }
      ];

      for (const [index, mood] of moodProgression.entries()) {
        mockSupabase.from.mockReturnValueOnce({
          insert: jest.fn(() => Promise.resolve({ error: null }))
        });

        await MoodAnalyticsService.logMoodEntry(userId, {
          overall: mood.overall,
          anxiety: mood.anxiety,
          notes: `Session progress at ${mood.timestamp}`
        });
      }

      // Mock insights generation
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({
                data: moodProgression.map((mood, i) => ({
                  id: `${i + 1}`,
                  user_id: userId,
                  overall: mood.overall,
                  anxiety: mood.anxiety,
                  created_at: `2024-01-01T${mood.timestamp}:00Z`
                })),
                error: null
              }))
            }))
          }))
        }))
      });

      const insights = await MoodAnalyticsService.getMoodInsights(userId);
      
      // Should detect improvement trend
      const improvementInsight = insights.find(i => i.type === 'trend');
      expect(improvementInsight).toBeDefined();
      expect(improvementInsight?.impact).toBe('positive');
    });
  });
});

console.log('Integration tests configured - run with: npm test integration.test.ts');