import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendMessage } from '@/services/aiService';

// Mock the SessionRecommendationService
vi.mock('@/services/sessionRecommendationService', () => ({
  SessionRecommendationService: {
    getSmartFollowUpQuestions: vi.fn()
  }
}));

const mockSessionRecommendationService = vi.mocked(await import('@/services/sessionRecommendationService')).SessionRecommendationService;

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Mock environment variables
const originalEnv = import.meta.env;
beforeEach(() => {
  vi.clearAllMocks();
  mockSessionStorage.getItem.mockReturnValue(null);
  (mockSessionRecommendationService.getSmartFollowUpQuestions as any).mockReturnValue([
    'How does that make you feel?',
    'Can you tell me more about that?'
  ]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('aiService', () => {
  const mockApiResponse = {
    choices: [{
      message: {
        content: 'I understand. Can you tell me more about how you\'re feeling?'
      }
    }]
  };

  describe('sendMessage', () => {
    it('sends a basic message successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const response = await sendMessage('Hello, I need help');

      expect(response).toBe('I understand. Can you tell me more about how you\'re feeling?');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Bearer')
          }),
          body: expect.stringContaining('Hello, I need help')
        })
      );
    });

    it('includes conversation history in API call', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const conversationHistory = [
        { content: 'Hello', isUser: true, id: '1', timestamp: new Date() },
        { content: 'Hi there! How can I help?', isUser: false, id: '2', timestamp: new Date() }
      ];

      await sendMessage('I feel anxious', conversationHistory);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Hello')
        })
      );
    });

    it('uses custom therapist prompt when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const customPrompt = 'You are Dr. Smith, a cognitive behavioral therapist.';
      await sendMessage('I need help', [], customPrompt);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Dr. Smith')
        })
      );
    });

    it('integrates session recommendations from storage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const sessionRecommendation = {
        title: 'Anxiety Management Session',
        description: 'Focus on breathing techniques',
        techniques: ['Deep breathing', 'Progressive muscle relaxation'],
        estimatedDuration: 30,
        prompt: 'Let\'s start with some deep breathing exercises.'
      };

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionRecommendation));

      await sendMessage('I feel anxious', []);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Anxiety Management Session')
        })
      );
    });

    it('adds smart follow-up questions for ongoing conversations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const conversationHistory = [
        { content: 'I feel sad', isUser: true, id: '1', timestamp: new Date() },
        { content: 'I understand. Tell me more.', isUser: false, id: '2', timestamp: new Date() }
      ];

      await sendMessage('It started yesterday', conversationHistory);

      expect(mockSessionRecommendationService.getSmartFollowUpQuestions).toHaveBeenCalledWith(
        ['I feel sad', 'I understand. Tell me more.'],
        'It started yesterday'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('How does that make you feel?')
        })
      );
    });

    it('removes session recommendation after few messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const sessionRecommendation = {
        title: 'Test Session',
        description: 'Test description',
        techniques: ['Test technique'],
        estimatedDuration: 30,
        prompt: 'Test prompt'
      };

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionRecommendation));

      const conversationHistory = [
        { content: 'Message 1', isUser: true, id: '1', timestamp: new Date() },
        { content: 'Response 1', isUser: false, id: '2', timestamp: new Date() },
        { content: 'Message 2', isUser: true, id: '3', timestamp: new Date() }
      ];

      await sendMessage('Message 3', conversationHistory);

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('sessionRecommendation');
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const response = await sendMessage('Hello');

      expect(response).toBe('I\'m having trouble processing your request right now. Please try again later.');
    });

    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await sendMessage('Hello');

      expect(response).toBe('I\'m having trouble processing your request right now. Please try again later.');
    });

    it('handles malformed API responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' })
      });

      const response = await sendMessage('Hello');

      expect(response).toBe('I\'m having trouble processing your request right now. Please try again later.');
    });

    it('uses correct OpenAI API parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      await sendMessage('Hello');

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toEqual({
        model: 'gpt-3.5-turbo',
        messages: expect.any(Array),
        max_tokens: 200,
        temperature: 0.7,
        n: 1
      });
    });

    it('constructs system prompt correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      await sendMessage('Hello');

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const systemMessage = requestBody.messages[0];

      expect(systemMessage.role).toBe('system');
      expect(systemMessage.content).toContain('MindfulAI');
      expect(systemMessage.content).toContain('compassionate');
      expect(systemMessage.content).toContain('evidence-based');
    });

    it('formats conversation history correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const conversationHistory = [
        { content: 'User message', isUser: true, id: '1', timestamp: new Date() },
        { content: 'AI response', isUser: false, id: '2', timestamp: new Date() }
      ];

      await sendMessage('New message', conversationHistory);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const messages = requestBody.messages;

      expect(messages).toHaveLength(4); // system + 2 history + 1 new
      expect(messages[1]).toEqual({ role: 'user', content: 'User message' });
      expect(messages[2]).toEqual({ role: 'assistant', content: 'AI response' });
      expect(messages[3]).toEqual({ role: 'user', content: 'New message' });
    });

    it('handles empty conversation history', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      await sendMessage('First message', []);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const messages = requestBody.messages;

      expect(messages).toHaveLength(2); // system + user message
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
    });

    it('handles session recommendation with missing fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const incompleteRecommendation = {
        title: 'Test Session'
        // Missing other fields
      };

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(incompleteRecommendation));

      const response = await sendMessage('Hello', []);

      expect(response).toBe('I understand. Can you tell me more about how you\'re feeling?');
    });

    it('handles invalid session recommendation JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      mockSessionStorage.getItem.mockReturnValue('invalid json');

      const response = await sendMessage('Hello', []);

      expect(response).toBe('I understand. Can you tell me more about how you\'re feeling?');
    });

    it('respects API rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      const response = await sendMessage('Hello');

      expect(response).toBe('I\'m having trouble processing your request right now. Please try again later.');
    });

    it('handles concurrent requests properly', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ choices: [{ message: { content: 'Response 1' } }] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ choices: [{ message: { content: 'Response 2' } }] })
        });

      const [response1, response2] = await Promise.all([
        sendMessage('Message 1'),
        sendMessage('Message 2')
      ]);

      expect(response1).toBe('Response 1');
      expect(response2).toBe('Response 2');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Session Recommendation Integration', () => {
    it('formats session recommendation correctly in prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const sessionRecommendation = {
        title: 'Mindfulness Session',
        description: 'Practice mindfulness meditation',
        techniques: ['Breathing meditation', 'Body scan'],
        estimatedDuration: 20,
        prompt: 'Let\'s begin with mindful breathing.'
      };

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionRecommendation));

      await sendMessage('Hello', []);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const systemMessage = requestBody.messages[0];

      expect(systemMessage.content).toContain('SPECIAL SESSION FOCUS');
      expect(systemMessage.content).toContain('Mindfulness Session');
      expect(systemMessage.content).toContain('Practice mindfulness meditation');
      expect(systemMessage.content).toContain('Breathing meditation, Body scan');
      expect(systemMessage.content).toContain('20 minutes');
      expect(systemMessage.content).toContain('Let\'s begin with mindful breathing.');
    });

    it('only applies session recommendation to first few messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const sessionRecommendation = {
        title: 'Test Session',
        description: 'Test description',
        techniques: ['Test technique'],
        estimatedDuration: 30,
        prompt: 'Test prompt'
      };

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionRecommendation));

      const longConversationHistory = Array.from({ length: 5 }, (_, i) => ({
        content: `Message ${i}`,
        isUser: i % 2 === 0,
        id: `${i}`,
        timestamp: new Date()
      }));

      await sendMessage('Hello', longConversationHistory);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const systemMessage = requestBody.messages[0];

      expect(systemMessage.content).not.toContain('SPECIAL SESSION FOCUS');
    });
  });

  describe('Smart Follow-up Questions', () => {
    it('includes follow-up questions in system prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const conversationHistory = [
        { content: 'I feel anxious', isUser: true, id: '1', timestamp: new Date() }
      ];

      (mockSessionRecommendationService.getSmartFollowUpQuestions as any).mockReturnValue([
        'What triggers your anxiety?',
        'How long have you been feeling this way?'
      ]);

      await sendMessage('It gets worse at night', conversationHistory);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const systemMessage = requestBody.messages[0];

      expect(systemMessage.content).toContain('SMART FOLLOW-UP SUGGESTIONS');
      expect(systemMessage.content).toContain('What triggers your anxiety?');
      expect(systemMessage.content).toContain('How long have you been feeling this way?');
    });

    it('handles empty follow-up questions gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const conversationHistory = [
        { content: 'Hello', isUser: true, id: '1', timestamp: new Date() }
      ];

      (mockSessionRecommendationService.getSmartFollowUpQuestions as any).mockReturnValue([]);

      const response = await sendMessage('How are you?', conversationHistory);

      expect(response).toBe('I understand. Can you tell me more about how you\'re feeling?');
    });
  });
});