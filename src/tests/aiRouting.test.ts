import { MultiModelAIRouter } from '@/services/multiModelAiRouter';

// Mock Supabase
const mockSupabase = {
  functions: {
    invoke: jest.fn()
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
    select: jest.fn(() => ({
      gte: jest.fn(() => ({
        lte: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }))
};

jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('AI Routing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Model Selection Logic', () => {
    test('should select Claude Opus for crisis situations', async () => {
      const criteria = {
        taskType: 'crisis' as const,
        urgency: 'critical' as const,
        complexity: 'complex' as const,
        userTier: 'premium' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      expect(selectedModel.id).toBe('claude-opus-4-20250514');
      expect(selectedModel.capabilities).toContain('crisis');
      expect(selectedModel.qualityScore).toBeGreaterThan(0.9);
    });

    test('should select cost-effective model for free users', async () => {
      const criteria = {
        taskType: 'chat' as const,
        urgency: 'low' as const,
        complexity: 'simple' as const,
        userTier: 'free' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      expect(selectedModel.costPerToken).toBeLessThan(0.0001);
      expect(selectedModel.id).toBe('claude-sonnet-4-20250514');
    });

    test('should prioritize quality for complex tasks', async () => {
      const criteria = {
        taskType: 'analysis' as const,
        urgency: 'medium' as const,
        complexity: 'complex' as const,
        userTier: 'premium' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      expect(selectedModel.qualityScore).toBeGreaterThan(0.88);
    });

    test('should handle cultural context requirements', async () => {
      const criteria = {
        taskType: 'chat' as const,
        urgency: 'medium' as const,
        complexity: 'moderate' as const,
        culturalContext: 'Arabic',
        userTier: 'premium' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      expect(selectedModel.capabilities).toContain('cultural');
    });

    test('should balance performance for high urgency tasks', async () => {
      const criteria = {
        taskType: 'chat' as const,
        urgency: 'high' as const,
        complexity: 'moderate' as const,
        userTier: 'premium' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      expect(selectedModel.averageLatency).toBeLessThan(1500);
    });
  });

  describe('Message Routing', () => {
    test('should route message with performance tracking', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { message: 'Test response', confidence: 0.9 },
        error: null
      });

      const criteria = {
        taskType: 'chat' as const,
        urgency: 'medium' as const,
        complexity: 'simple' as const,
        userTier: 'premium' as const
      };

      const context = {
        userId: 'test-user-id',
        sessionId: 'test-session-id',
        systemPrompt: 'You are a helpful therapist.'
      };

      const result = await MultiModelAIRouter.routeMessage(
        'How are you feeling today?',
        context,
        criteria
      );

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('modelUsed');
      expect(result).toHaveProperty('responseTime');
      expect(result).toHaveProperty('provider');
      expect(mockSupabase.functions.invoke).toHaveBeenCalled();
    });

    test('should handle fallback on model failure', async () => {
      mockSupabase.functions.invoke
        .mockRejectedValueOnce(new Error('Primary model failed'))
        .mockResolvedValueOnce({
          data: { message: 'Fallback response' },
          error: null
        });

      const criteria = {
        taskType: 'chat' as const,
        urgency: 'medium' as const,
        complexity: 'simple' as const,
        userTier: 'premium' as const
      };

      const context = { userId: 'test-user-id' };

      const result = await MultiModelAIRouter.routeMessage(
        'Test message',
        context,
        criteria
      );

      expect(result).toHaveProperty('message');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(2);
    });

    test('should provide ultimate fallback response', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('All models failed'));

      const criteria = {
        taskType: 'chat' as const,
        urgency: 'medium' as const,
        complexity: 'simple' as const,
        userTier: 'premium' as const
      };

      const context = { userId: 'test-user-id' };

      const result = await MultiModelAIRouter.routeMessage(
        'Test message',
        context,
        criteria
      );

      expect(result.message).toContain('technical difficulties');
      expect(result.confidence).toBe(0.5);
    });
  });

  describe('Performance Analytics', () => {
    test('should fetch and process model analytics', async () => {
      const mockData = [
        {
          model_id: 'claude-opus-4-20250514',
          response_time: 1500,
          success: true,
          task_type: 'chat',
          timestamp: '2024-01-01T00:00:00Z'
        },
        {
          model_id: 'claude-opus-4-20250514',
          response_time: 1200,
          success: true,
          task_type: 'analysis',
          timestamp: '2024-01-01T01:00:00Z'
        }
      ];

      const mockFrom = {
        insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
        select: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
            }))
          }))
        }))
      };
      
      mockSupabase.from.mockReturnValue(mockFrom);

      const timeRange = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-02')
      };

      const analytics = await MultiModelAIRouter.getModelAnalytics(timeRange);

      expect(analytics['claude-opus-4-20250514']).toBeDefined();
      expect(analytics['claude-opus-4-20250514'].totalRequests).toBe(2);
      expect(analytics['claude-opus-4-20250514'].avgResponseTime).toBe(1350);
      expect(analytics['claude-opus-4-20250514'].successRate).toBe(100);
    });

    test('should handle analytics fetch errors gracefully', async () => {
      const mockFrom = {
        insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
        select: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ data: null, error: new Error('DB Error') }))
            }))
          }))
        }))
      };
      
      mockSupabase.from.mockReturnValue(mockFrom);

      const timeRange = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-02')
      };

      const analytics = await MultiModelAIRouter.getModelAnalytics(timeRange);

      expect(analytics).toEqual({});
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid task types', async () => {
      const criteria = {
        taskType: 'invalid' as any,
        urgency: 'medium' as const,
        complexity: 'simple' as const,
        userTier: 'premium' as const
      };

      const selectedModel = await MultiModelAIRouter.selectOptimalModel(criteria);
      
      // Should fall back to balanced selection when no models match task type
      expect(selectedModel).toBeDefined();
      expect(selectedModel.available).toBe(true);
    });

    test('should handle missing provider configuration', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Provider not configured'));

      const criteria = {
        taskType: 'chat' as const,
        urgency: 'medium' as const,
        complexity: 'simple' as const,
        userTier: 'premium' as const
      };

      const context = { userId: 'test-user-id' };

      await expect(
        MultiModelAIRouter.routeMessage('Test', context, criteria)
      ).resolves.toHaveProperty('message');
    });
  });
});

console.log('AI Routing tests configured - run with: npm test aiRouting.test.ts');