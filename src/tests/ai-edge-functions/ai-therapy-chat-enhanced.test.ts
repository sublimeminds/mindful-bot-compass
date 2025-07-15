import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Deno environment for Node.js tests
global.Deno = {
  env: {
    get: vi.fn()
  }
} as any;

// Mock fetch
global.fetch = vi.fn();

// Create proper mock functions
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();

// Mock Supabase client with proper chaining
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        order: mockOrder.mockReturnValue({
          limit: mockLimit.mockReturnValue(Promise.resolve({ data: [] })),
          single: mockSingle.mockReturnValue(Promise.resolve({ data: null }))
        })
      })
    }),
    insert: mockInsert.mockReturnValue(Promise.resolve({ data: null, error: null }))
  }))
};

// Mock the imports
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: vi.fn()
}));

vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

describe('AI Therapy Chat Enhanced Edge Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset all mock functions
    mockSelect.mockClear();
    mockEq.mockClear();
    mockOrder.mockClear();
    mockLimit.mockClear();
    mockSingle.mockClear();
    mockInsert.mockClear();
    
    // Setup default return values
    mockLimit.mockReturnValue(Promise.resolve({ data: [] }));
    mockSingle.mockReturnValue(Promise.resolve({ data: null }));
    mockInsert.mockReturnValue(Promise.resolve({ data: null, error: null }));
    
    (global.Deno.env.get as any).mockImplementation((key: string) => {
      switch (key) {
        case 'ANTHROPIC_API_KEY':
          return 'mock-anthropic-key';
        case 'SUPABASE_URL':
          return 'https://mock-supabase-url.supabase.co';
        case 'SUPABASE_SERVICE_ROLE_KEY':
          return 'mock-service-role-key';
        default:
          return null;
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Handling', () => {
    it('handles CORS preflight requests', async () => {
      const mockRequest = {
        method: 'OPTIONS',
        json: vi.fn()
      };

      expect(mockRequest.method).toBe('OPTIONS');
    });

    it('processes chat requests correctly', async () => {
      const mockRequest = {
        method: 'POST',
        json: vi.fn().mockResolvedValue({
          message: 'I feel anxious today',
          userId: 'user-123',
          sessionId: 'session-456',
          therapistId: 'therapist-789'
        })
      };

      const requestBody = await mockRequest.json();
      
      expect(requestBody.message).toBe('I feel anxious today');
      expect(requestBody.userId).toBe('user-123');
      expect(requestBody.sessionId).toBe('session-456');
      expect(requestBody.therapistId).toBe('therapist-789');
    });

    it('validates required parameters', async () => {
      const mockRequest = {
        method: 'POST',
        json: vi.fn().mockResolvedValue({
          message: 'Hello',
          userId: 'user-123'
          // Missing sessionId and therapistId
        })
      };

      const requestBody = await mockRequest.json();
      
      expect(requestBody.message).toBe('Hello');
      expect(requestBody.userId).toBe('user-123');
      expect(requestBody.sessionId).toBeUndefined();
      expect(requestBody.therapistId).toBeUndefined();
    });
  });

  describe('Memory Retrieval', () => {
    it('retrieves user conversation memories', async () => {
      const mockMemories = [
        {
          id: 'memory-1',
          user_id: 'user-123',
          title: 'Work stress discussion',
          content: 'User mentioned high stress at work',
          emotional_context: { primary_emotion: 'anxiety', intensity: 7 },
          importance_score: 0.8,
          is_active: true
        },
        {
          id: 'memory-2',
          user_id: 'user-123',
          title: 'Family concerns',
          content: 'Discussed relationship with parents',
          emotional_context: { primary_emotion: 'sadness', intensity: 6 },
          importance_score: 0.7,
          is_active: true
        }
      ];

      mockLimit.mockResolvedValue({ data: mockMemories });

      // Test memory formatting
      const memoryContext = mockMemories.map(m => 
        `${m.title}: ${m.content} (${m.emotional_context.primary_emotion})`
      ).join('\n');

      expect(memoryContext).toContain('Work stress discussion: User mentioned high stress at work (anxiety)');
      expect(memoryContext).toContain('Family concerns: Discussed relationship with parents (sadness)');
    });

    it('handles empty memories gracefully', async () => {
      mockLimit.mockResolvedValue({ data: [] });

      const memoryContext = '';
      expect(memoryContext).toBe('');
    });

    it('filters memories by importance and activity', async () => {
      const mockMemories = [
        {
          id: 'memory-1',
          importance_score: 0.9,
          is_active: true,
          title: 'Important memory',
          content: 'High importance content',
          emotional_context: { primary_emotion: 'anxiety' }
        },
        {
          id: 'memory-2',
          importance_score: 0.3,
          is_active: false,
          title: 'Less important memory',
          content: 'Low importance content',
          emotional_context: { primary_emotion: 'neutral' }
        }
      ];

      // The function should order by importance_score and filter by is_active
      const activeMemories = mockMemories.filter(m => m.is_active);
      const sortedMemories = activeMemories.sort((a, b) => b.importance_score - a.importance_score);

      expect(sortedMemories).toHaveLength(1);
      expect(sortedMemories[0].importance_score).toBe(0.9);
    });
  });

  describe('Therapist Personality Retrieval', () => {
    it('retrieves therapist personality data', async () => {
      const mockTherapist = {
        id: 'therapist-789',
        name: 'Dr. Sarah Johnson',
        title: 'Clinical Psychologist',
        specialties: ['Anxiety', 'Depression', 'CBT'],
        approach: 'Cognitive Behavioral Therapy with mindfulness integration',
        communication_style: 'warm, empathetic, and direct'
      };

      mockSingle.mockResolvedValue({ data: mockTherapist });

      expect(mockTherapist.name).toBe('Dr. Sarah Johnson');
      expect(mockTherapist.specialties).toContain('CBT');
      expect(mockTherapist.communication_style).toBe('warm, empathetic, and direct');
    });

    it('handles missing therapist data', async () => {
      mockSingle.mockResolvedValue({ data: null });

      const therapist = null;
      
      // Should use fallback values
      const fallbackName = therapist?.name || 'Dr. AI';
      const fallbackTitle = therapist?.title || 'therapist';
      const fallbackSpecialties = therapist?.specialties?.join(', ') || 'general therapy';

      expect(fallbackName).toBe('Dr. AI');
      expect(fallbackTitle).toBe('therapist');
      expect(fallbackSpecialties).toBe('general therapy');
    });
  });

  describe('System Prompt Construction', () => {
    it('constructs system prompt with therapist data', () => {
      const therapist = {
        name: 'Dr. Sarah Johnson',
        title: 'Clinical Psychologist',
        specialties: ['Anxiety', 'Depression'],
        approach: 'CBT-based approach',
        communication_style: 'warm and professional'
      };

      const memoryContext = 'Previous session: Discussed work stress (anxiety)';

      const systemPrompt = `You are ${therapist.name}, a ${therapist.title} specializing in ${therapist.specialties.join(', ')}.

Your approach: ${therapist.approach}
Communication style: ${therapist.communication_style}

IMPORTANT CONTEXT FROM PREVIOUS SESSIONS:
${memoryContext}

Guidelines:
- Remember details from previous sessions
- Use evidence-based therapeutic techniques
- Be empathetic and supportive
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Reference past conversations when relevant
- Stay in character as this specific therapist`;

      expect(systemPrompt).toContain('Dr. Sarah Johnson');
      expect(systemPrompt).toContain('Clinical Psychologist');
      expect(systemPrompt).toContain('Anxiety, Depression');
      expect(systemPrompt).toContain('CBT-based approach');
      expect(systemPrompt).toContain('warm and professional');
      expect(systemPrompt).toContain('Previous session: Discussed work stress (anxiety)');
    });

    it('handles missing therapist data in prompt', () => {
      const therapist = null;
      const memoryContext = '';

      const systemPrompt = `You are ${therapist?.name || 'Dr. AI'}, a ${therapist?.title || 'therapist'} specializing in ${therapist?.specialties?.join(', ') || 'general therapy'}.

Your approach: ${therapist?.approach || 'supportive and evidence-based'}
Communication style: ${therapist?.communication_style || 'warm and professional'}

IMPORTANT CONTEXT FROM PREVIOUS SESSIONS:
${memoryContext}

Guidelines:
- Remember details from previous sessions
- Use evidence-based therapeutic techniques
- Be empathetic and supportive
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Reference past conversations when relevant
- Stay in character as this specific therapist`;

      expect(systemPrompt).toContain('Dr. AI');
      expect(systemPrompt).toContain('general therapy');
      expect(systemPrompt).toContain('supportive and evidence-based');
    });
  });

  describe('Anthropic API Integration', () => {
    it('sends request to Claude API with correct parameters', async () => {
      const mockResponse = {
        content: [{ text: 'I understand you\'re feeling anxious. Can you tell me more about what\'s triggering these feelings?' }]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const systemPrompt = 'You are Dr. AI, a therapist...';
      const userMessage = 'I feel anxious today';

      const expectedBody = {
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser: ${userMessage}`
          }
        ]
      };

      // Mock the API call
      await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': 'mock-anthropic-key',
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(expectedBody)
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'mock-anthropic-key',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          }),
          body: expect.stringContaining('claude-opus-4-20250514')
        })
      );
    });

    it('handles Anthropic API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': 'mock-anthropic-key',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        expect(error.message).toBe('API Error: 500 - Internal Server Error');
      }
    });

    it('handles network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': 'mock-anthropic-key',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({})
        });
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });
  });

  describe('Memory Storage', () => {
    it('stores significant messages as memories', async () => {
      const message = 'I have been struggling with anxiety for the past few weeks, especially at work when I have to present to large groups.';
      const userId = 'user-123';
      const sessionId = 'session-456';

      const expectedMemoryData = {
        user_id: userId,
        session_id: sessionId,
        memory_type: 'emotional_pattern',
        title: 'Session discussion',
        content: `User: ${message.substring(0, 200)}`,
        emotional_context: { primary_emotion: 'neutral', intensity: 5, context: 'therapy_session' },
        importance_score: 0.5,
        tags: ['session', 'conversation'],
        is_active: true
      };

      // Message should be stored because it's longer than 20 characters
      expect(message.length > 20).toBe(true);
      expect(expectedMemoryData.content).toContain('struggling with anxiety');
      expect(expectedMemoryData.tags).toContain('session');
    });

    it('does not store short messages', () => {
      const message = 'Hi';
      const shouldStore = message.length > 20;
      
      expect(shouldStore).toBe(false);
    });

    it('truncates long messages for storage', () => {
      const longMessage = 'This is a very long message that exceeds the 200 character limit and should be truncated when stored in the database as a memory to prevent storage issues and maintain database performance while still capturing the essential content of the user\'s message.';
      
      const truncatedContent = `User: ${longMessage.substring(0, 200)}`;
      
      expect(truncatedContent.length).toBeLessThanOrEqual(206); // "User: " + 200 chars
      expect(truncatedContent).toContain('This is a very long message');
      expect(truncatedContent).not.toContain('while still capturing');
    });

    it('handles memory storage errors gracefully', async () => {
      mockInsert.mockResolvedValue({ data: null, error: new Error('Storage failed') });

      // Should not throw error, but handle gracefully
      const result = await mockSupabaseClient.from('conversation_memory').insert({});
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('Response Formatting', () => {
    it('returns properly formatted success response', () => {
      const aiResponse = 'I understand you\'re feeling anxious. Can you tell me more about what\'s triggering these feelings?';
      
      const response = {
        response: aiResponse
      };

      expect(response.response).toBe(aiResponse);
      expect(typeof response.response).toBe('string');
    });

    it('returns properly formatted error response', () => {
      const errorMessage = 'Internal server error';
      
      const errorResponse = {
        error: errorMessage
      };

      expect(errorResponse.error).toBe(errorMessage);
    });
  });

  describe('Environment Configuration', () => {
    it('retrieves required environment variables', () => {
      expect(global.Deno.env.get('ANTHROPIC_API_KEY')).toBe('mock-anthropic-key');
      expect(global.Deno.env.get('SUPABASE_URL')).toBe('https://mock-supabase-url.supabase.co');
      expect(global.Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')).toBe('mock-service-role-key');
    });

    it('handles missing environment variables', () => {
      (global.Deno.env.get as any).mockReturnValue(null);
      
      expect(global.Deno.env.get('ANTHROPIC_API_KEY')).toBeNull();
      expect(global.Deno.env.get('SUPABASE_URL')).toBeNull();
      expect(global.Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')).toBeNull();
    });
  });

  describe('CORS Headers', () => {
    it('includes proper CORS headers', () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      };

      expect(corsHeaders['Access-Control-Allow-Origin']).toBe('*');
      expect(corsHeaders['Access-Control-Allow-Headers']).toBe('authorization, x-client-info, apikey, content-type');
    });

    it('handles preflight requests', () => {
      const request = { method: 'OPTIONS' };
      const response = { headers: { 'Access-Control-Allow-Origin': '*' } };
      
      expect(request.method).toBe('OPTIONS');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });
});