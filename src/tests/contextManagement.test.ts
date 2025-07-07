import { TherapyContextManager, therapyContextManager } from '@/services/therapyContextManager';

// Mock Supabase
const mockSupabase = {
  from: jest.fn()
};

jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('Therapy Context Management Tests', () => {
  let contextManager: TherapyContextManager;

  beforeEach(() => {
    jest.clearAllMocks();
    contextManager = TherapyContextManager.getInstance();
  });

  describe('Singleton Pattern', () => {
    test('should return same instance', () => {
      const instance1 = TherapyContextManager.getInstance();
      const instance2 = TherapyContextManager.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBe(therapyContextManager);
    });
  });

  describe('Context Creation', () => {
    test('should create therapy context successfully', async () => {
      const mockContextData = {
        id: 'test-context-id',
        user_id: 'test-user-id',
        session_id: 'test-session-id',
        current_ai_model: 'claude-opus-4-20250514',
        current_voice_id: 'voice-1',
        current_avatar_state: 'friendly',
        cultural_profile: { language: 'en', region: 'US' },
        emotional_state: { mood: 'positive', energy: 0.8 },
        context_data: { preferences: ['mindfulness', 'cbt'] }
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: mockContextData, 
              error: null 
            }))
          }))
        }))
      });

      const contextData = {
        userId: 'test-user-id',
        sessionId: 'test-session-id',
        currentAiModel: 'claude-opus-4-20250514',
        currentVoiceId: 'voice-1',
        currentAvatarState: 'friendly',
        culturalProfile: { language: 'en', region: 'US' },
        emotionalState: { mood: 'positive', energy: 0.8 },
        contextData: { preferences: ['mindfulness', 'cbt'] }
      };

      const contextId = await contextManager.createContext(contextData);

      expect(contextId).toBe('test-context-id');
      expect(mockSupabase.from).toHaveBeenCalledWith('therapy_context');
    });

    test('should handle context creation errors', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: new Error('Database error') 
            }))
          }))
        }))
      });

      const contextData = {
        userId: 'test-user-id',
        currentAiModel: 'claude-opus-4-20250514',
        culturalProfile: {},
        emotionalState: {},
        contextData: {}
      };

      const contextId = await contextManager.createContext(contextData);

      expect(contextId).toBeNull();
    });
  });

  describe('Context Updates', () => {
    test('should update context successfully', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null }))
        }))
      });

      const updates = {
        currentAiModel: 'claude-sonnet-4-20250514',
        emotionalState: { mood: 'calm', energy: 0.6 }
      };

      const result = await contextManager.updateContext('test-context-id', updates);

      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('therapy_context');
    });

    test('should handle update errors', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: new Error('Update failed') }))
        }))
      });

      const updates = { currentAiModel: 'new-model' };
      const result = await contextManager.updateContext('test-context-id', updates);

      expect(result).toBe(false);
    });
  });

  describe('Context Retrieval', () => {
    test('should fetch context successfully', async () => {
      const mockContextData = {
        id: 'test-context-id',
        user_id: 'test-user-id',
        session_id: 'test-session-id',
        current_ai_model: 'claude-opus-4-20250514',
        current_voice_id: 'voice-1',
        current_avatar_state: 'friendly',
        cultural_profile: { language: 'en' },
        emotional_state: { mood: 'positive' },
        context_data: { preferences: ['cbt'] }
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: mockContextData, 
              error: null 
            }))
          }))
        }))
      });

      const context = await contextManager.getContext('test-context-id');

      expect(context).toEqual({
        id: 'test-context-id',
        userId: 'test-user-id',
        sessionId: 'test-session-id',
        currentAiModel: 'claude-opus-4-20250514',
        currentVoiceId: 'voice-1',
        currentAvatarState: 'friendly',
        culturalProfile: { language: 'en' },
        emotionalState: { mood: 'positive' },
        contextData: { preferences: ['cbt'] }
      });
    });

    test('should handle fetch errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: new Error('Not found') 
            }))
          }))
        }))
      });

      const context = await contextManager.getContext('invalid-id');

      expect(context).toBeNull();
    });
  });

  describe('Optimal Model Selection', () => {
    test('should select Claude Opus for crisis tasks', async () => {
      const modelName = await contextManager.selectOptimalModel('crisis');
      
      expect(modelName).toBe('claude-opus-4-20250514');
    });

    test('should select cost-effective model for free users', async () => {
      const modelName = await contextManager.selectOptimalModel('daily-therapy', {}, 'free');
      
      expect(modelName).toBe('claude-sonnet-4-20250514');
    });

    test('should prioritize cultural models when needed', async () => {
      const culturalContext = { language: 'es', region: 'MX' };
      const modelName = await contextManager.selectOptimalModel('general-conversation', culturalContext);
      
      expect(modelName).toBe('claude-opus-4-20250514'); // First cultural-capable model
    });

    test('should handle task-specific selection', async () => {
      const modelName = await contextManager.selectOptimalModel('creative');
      
      expect(modelName).toBe('gpt-4.1-2025-04-14');
    });

    test('should provide default fallback', async () => {
      const modelName = await contextManager.selectOptimalModel('unknown-task');
      
      expect(modelName).toBe('claude-sonnet-4-20250514');
    });
  });

  describe('Performance Logging', () => {
    test('should log model performance successfully', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => Promise.resolve({ error: null }))
      });

      await contextManager.logModelPerformance(
        'claude-opus-4-20250514',
        'crisis',
        1500,
        0.95,
        4.8,
        0.015,
        'emergency'
      );

      expect(mockSupabase.from).toHaveBeenCalledWith('ai_model_performance');
    });

    test('should handle logging errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => Promise.resolve({ error: new Error('Logging failed') }))
      });

      // Should not throw
      await expect(
        contextManager.logModelPerformance('model', 'task', 1000, 0.9, 4.5, 0.01)
      ).resolves.toBeUndefined();
    });
  });

  describe('Performance Metrics Retrieval', () => {
    test('should fetch performance metrics with filters', async () => {
      const mockMetrics = [
        {
          id: '1',
          model_name: 'claude-opus-4-20250514',
          task_type: 'crisis',
          response_time_ms: 1500,
          quality_score: 0.95,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          model_name: 'claude-opus-4-20250514',
          task_type: 'crisis',
          response_time_ms: 1200,
          quality_score: 0.93,
          created_at: '2024-01-01T01:00:00Z'
        }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => Promise.resolve({ 
                data: mockMetrics, 
                error: null 
              }))
            }))
          }))
        }))
      });

      const metrics = await contextManager.getPerformanceMetrics('claude-opus-4-20250514', 'crisis');

      expect(metrics).toHaveLength(2);
      expect(metrics[0].model_name).toBe('claude-opus-4-20250514');
      expect(metrics[0].task_type).toBe('crisis');
    });

    test('should handle metrics fetch errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: new Error('Fetch failed') 
            }))
          }))
        }))
      });

      const metrics = await contextManager.getPerformanceMetrics();

      expect(metrics).toEqual([]);
    });
  });

  describe('Current Context Management', () => {
    test('should maintain current context in memory', async () => {
      const mockContextData = {
        id: 'test-context-id',
        user_id: 'test-user-id',
        session_id: null,
        current_ai_model: 'claude-opus-4-20250514',
        current_voice_id: null,
        current_avatar_state: null,
        cultural_profile: {},
        emotional_state: {},
        context_data: {}
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: mockContextData, 
              error: null 
            }))
          }))
        }))
      });

      const contextData = {
        userId: 'test-user-id',
        currentAiModel: 'claude-opus-4-20250514',
        culturalProfile: {},
        emotionalState: {},
        contextData: {}
      };

      await contextManager.createContext(contextData);
      const currentContext = contextManager.getCurrentContext();

      expect(currentContext).toEqual({
        id: 'test-context-id',
        userId: 'test-user-id',
        sessionId: null,
        currentAiModel: 'claude-opus-4-20250514',
        currentVoiceId: null,
        currentAvatarState: null,
        culturalProfile: {},
        emotionalState: {},
        contextData: {}
      });
    });
  });
});

console.log('Context Management tests configured - run with: npm test contextManagement.test.ts');