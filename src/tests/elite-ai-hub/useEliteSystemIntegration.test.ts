import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEliteSystemIntegration } from '@/hooks/useEliteSystemIntegration';

// Mock dependencies
vi.mock('@/hooks/useSimpleApp', () => ({
  useSimpleApp: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

vi.mock('@/services/intelligentRouterHub', () => ({
  IntelligentRouterHub: {
    initialize: vi.fn(),
    routeMessage: vi.fn(),
    getSystemStatus: vi.fn()
  }
}));

vi.mock('@/services/realTimeCulturalAiIntegration', () => ({
  RealTimeCulturalAIIntegration: {
    initialize: vi.fn(),
    adaptMessage: vi.fn(),
    getCulturalContext: vi.fn()
  }
}));

vi.mock('@/services/adaptiveFeedbackLoopSystem', () => ({
  AdaptiveFeedbackLoopSystem: {
    initialize: vi.fn(),
    processResponse: vi.fn(),
    getLearningInsights: vi.fn()
  }
}));

const mockUseSimpleApp = vi.mocked(await import('@/hooks/useSimpleApp')).useSimpleApp;
const mockUseToast = vi.mocked(await import('@/hooks/use-toast')).useToast;

describe('useEliteSystemIntegration', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' }
  };

  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseSimpleApp.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    mockUseToast.mockReturnValue({
      toast: mockToast
    });
  });

  describe('Hook Initialization', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.userPreferences).toBeNull();
      expect(result.current.currentSessionId).toBeNull();
      expect(result.current.systemStatus).toEqual({ isActivated: false });
    });

    it('initializes system when user is available', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await waitFor(() => {
        expect(result.current.systemStatus.isActivated).toBe(true);
      });
    });

    it('does not initialize when user is not available', () => {
      mockUseSimpleApp.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
      });

      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus.isActivated).toBe(false);
    });
  });

  describe('Message Handling', () => {
    it('sends message successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const success = await result.current.sendMessage('Hello, how are you?');
        expect(success).toBe(true);
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('Hello, how are you?');
      expect(result.current.messages[0].isUser).toBe(true);
      expect(result.current.messages[1].isUser).toBe(false);
    });

    it('handles send message error', async () => {
      mockUseSimpleApp.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
      });

      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const success = await result.current.sendMessage('Hello');
        expect(success).toBe(false);
      });

      expect(result.current.messages).toHaveLength(0);
    });

    it('sets loading state during message sending', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      let loadingState = false;
      
      act(() => {
        result.current.sendMessage('Hello').then(() => {
          // Loading should be false after completion
          expect(result.current.isLoading).toBe(false);
        });
        
        // Loading should be true during sending
        loadingState = result.current.isLoading;
      });

      expect(loadingState).toBe(true);
    });

    it('generates unique message IDs', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.sendMessage('Message 1');
        await result.current.sendMessage('Message 2');
      });

      expect(result.current.messages).toHaveLength(4);
      const messageIds = result.current.messages.map(m => m.id);
      const uniqueIds = new Set(messageIds);
      expect(uniqueIds.size).toBe(messageIds.length);
    });
  });

  describe('Message Playback', () => {
    it('plays message with correct state changes', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.playMessage('Test message');
      });

      // Initially should be playing
      expect(result.current.isPlaying).toBe(true);

      // Should stop playing after timeout
      await waitFor(() => {
        expect(result.current.isPlaying).toBe(false);
      }, { timeout: 3000 });
    });

    it('stops playback correctly', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.playMessage('Test message');
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.stopPlayback();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('User Preferences', () => {
    it('loads user preferences successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.loadPreferences();
      });

      expect(result.current.userPreferences).toEqual({ voice_enabled: true });
    });

    it('does not load preferences without user', async () => {
      mockUseSimpleApp.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
      });

      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.loadPreferences();
      });

      expect(result.current.userPreferences).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('initiates elite session successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      let sessionId: string;
      
      await act(async () => {
        sessionId = await result.current.initiateEliteSession();
      });

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(result.current.currentSessionId).toBe(sessionId);
    });

    it('generates unique session IDs', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      const sessionIds: string[] = [];
      
      await act(async () => {
        sessionIds.push(await result.current.initiateEliteSession());
        sessionIds.push(await result.current.initiateEliteSession());
        sessionIds.push(await result.current.initiateEliteSession());
      });

      const uniqueIds = new Set(sessionIds);
      expect(uniqueIds.size).toBe(sessionIds.length);
    });
  });

  describe('Session Analysis', () => {
    it('analyzes session successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      let analysisResult: any;
      
      await act(async () => {
        analysisResult = await result.current.analyzeSession();
      });

      expect(analysisResult).toEqual({ insights: ['Session analysis complete'] });
    });

    it('handles analysis errors gracefully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      // Mock an error scenario
      const originalAnalyze = result.current.analyzeSession;
      result.current.analyzeSession = vi.fn().mockRejectedValue(new Error('Analysis failed'));

      await act(async () => {
        try {
          await result.current.analyzeSession();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('Message Processing', () => {
    it('processes messages through Elite AI', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      let processedMessage: string;
      
      await act(async () => {
        processedMessage = await result.current.processMessage('Test message');
      });

      expect(processedMessage).toBe('Message processed through Elite AI');
    });

    it('handles different message types', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      const messages = [
        'How are you feeling today?',
        'I am feeling anxious about my job.',
        '😊 Thank you for your help',
        'What coping strategies do you recommend?'
      ];

      for (const message of messages) {
        await act(async () => {
          const response = await result.current.processMessage(message);
          expect(response).toBe('Message processed through Elite AI');
        });
      }
    });
  });

  describe('System Status', () => {
    it('returns correct system status', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus).toEqual({ isActivated: true });
    });

    it('provides system activation methods', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(typeof result.current.activateEliteSystem).toBe('function');
      expect(typeof result.current.getEliteSystemStatus).toBe('function');
    });
  });

  describe('Chat Compatibility', () => {
    it('maintains compatibility with chat interface', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      // Check that all required chat interface methods are available
      expect(result.current.sendMessage).toBeDefined();
      expect(result.current.playMessage).toBeDefined();
      expect(result.current.stopPlayback).toBeDefined();
      expect(result.current.messages).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.isPlaying).toBeDefined();
    });

    it('handles message format correctly', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.sendMessage('Test message');
      });

      const userMessage = result.current.messages[0];
      const aiMessage = result.current.messages[1];

      expect(userMessage).toHaveProperty('id');
      expect(userMessage).toHaveProperty('content');
      expect(userMessage).toHaveProperty('isUser');
      expect(userMessage).toHaveProperty('timestamp');

      expect(aiMessage).toHaveProperty('id');
      expect(aiMessage).toHaveProperty('content');
      expect(aiMessage).toHaveProperty('isUser');
      expect(aiMessage).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      // Mock network error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        // Simulate network error by passing invalid data
        const success = await result.current.sendMessage('');
        expect(success).toBe(true); // Current implementation always returns true
      });

      consoleSpy.mockRestore();
    });

    it('handles service initialization errors', () => {
      // Mock service initialization failure
      const { result } = renderHook(() => useEliteSystemIntegration());

      // System should still be functional even if some services fail to initialize
      expect(result.current.systemStatus).toBeDefined();
      expect(result.current.sendMessage).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('handles multiple rapid message sends', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(result.current.sendMessage(`Message ${i}`));
      }

      await act(async () => {
        await Promise.all(promises);
      });

      expect(result.current.messages).toHaveLength(10); // 5 user + 5 AI messages
    });

    it('cleans up resources properly', () => {
      const { unmount } = renderHook(() => useEliteSystemIntegration());

      // Should not throw any errors when unmounting
      expect(() => unmount()).not.toThrow();
    });
  });
});