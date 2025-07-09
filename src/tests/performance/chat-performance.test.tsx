import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { measurePerformance } from '../utils/test-helpers';
import RealTherapyChatInterface from '@/components/chat/RealTherapyChatInterface';
import { mockConversationHistory } from '../utils/mock-data';

// Chat performance thresholds
const CHAT_PERFORMANCE_THRESHOLDS = {
  MESSAGE_SEND: 100, // milliseconds
  MESSAGE_RENDER: 50, // milliseconds per message
  AVATAR_SYNC: 200, // milliseconds
  SCROLL_UPDATE: 50, // milliseconds
  TYPING_RESPONSE: 30, // milliseconds
};

// Mock chat hook with performance data
vi.mock('@/hooks/useRealEnhancedChat', () => ({
  useRealEnhancedChat: () => ({
    messages: mockConversationHistory,
    sendMessage: vi.fn().mockResolvedValue({}),
    isLoading: false,
    currentEmotion: 'calm',
    riskLevel: 'low',
    sessionAnalysis: {
      duration: 15,
      emotionalProgress: 'improving',
    },
  }),
}));

vi.mock('@/components/avatar/VoiceEnhancedAvatarV2', () => ({
  default: vi.fn(() => <div data-testid="voice-avatar">Avatar</div>),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    loading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Chat Interface Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('measures chat interface initial load performance', async () => {
    const loadTime = await measurePerformance(async () => {
      renderWithRouter(<RealTherapyChatInterface />);
      
      await waitFor(() => {
        expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
        expect(screen.getByText(/feeling really anxious/)).toBeInTheDocument();
      });
    }, 'Chat Interface Load');

    expect(loadTime).toBeLessThan(1000); // Should load quickly
  });

  it('measures message sending performance', async () => {
    const mockSendMessage = vi.fn().mockResolvedValue({});
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: mockSendMessage,
      isLoading: false,
    });

    renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    const sendTime = await measurePerformance(async () => {
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Test message');
      });
    }, 'Message Send Performance');

    expect(sendTime).toBeLessThan(CHAT_PERFORMANCE_THRESHOLDS.MESSAGE_SEND);
  });

  it('measures message history rendering performance', async () => {
    const largeMessageHistory = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `This is message number ${i}. It contains some content to test rendering performance.`,
      timestamp: new Date(Date.now() - i * 60000),
      emotion: 'neutral',
    }));

    vi.mocked(vi.fn()).mockReturnValue({
      messages: largeMessageHistory,
      sendMessage: vi.fn(),
      isLoading: false,
    });

    const renderTime = await measurePerformance(async () => {
      renderWithRouter(<RealTherapyChatInterface />);
      
      await waitFor(() => {
        const messages = screen.getAllByText(/This is message number/);
        expect(messages.length).toBeGreaterThan(10);
      }, { timeout: 2000 });
    }, 'Large Message History Render');

    const averageMessageRenderTime = renderTime / largeMessageHistory.length;
    expect(averageMessageRenderTime).toBeLessThan(CHAT_PERFORMANCE_THRESHOLDS.MESSAGE_RENDER);
  });

  it('measures typing indicator performance', async () => {
    const messageInput = screen.getByPlaceholderText(/type your message/i);
    
    const typingTime = await measurePerformance(async () => {
      // Simulate rapid typing
      const message = 'This is a longer message to test typing performance';
      for (let i = 0; i < message.length; i++) {
        fireEvent.change(messageInput, { 
          target: { value: message.substring(0, i + 1) } 
        });
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }, 'Typing Performance');

    const averageTypingTime = typingTime / 50; // 50 characters
    expect(averageTypingTime).toBeLessThan(CHAT_PERFORMANCE_THRESHOLDS.TYPING_RESPONSE);
  });

  it('measures avatar emotion sync performance', async () => {
    const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited'];
    
    renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
    });

    const syncTime = await measurePerformance(async () => {
      for (const emotion of emotions) {
        // Simulate emotion change
        vi.mocked(vi.fn()).mockReturnValue({
          messages: mockConversationHistory,
          currentEmotion: emotion,
          sendMessage: vi.fn(),
        });
        
        // Trigger re-render
        const messageInput = screen.getByPlaceholderText(/type your message/i);
        fireEvent.focus(messageInput);
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }, 'Avatar Emotion Sync');

    const averageSyncTime = syncTime / emotions.length;
    expect(averageSyncTime).toBeLessThan(CHAT_PERFORMANCE_THRESHOLDS.AVATAR_SYNC);
  });

  it('measures scroll-to-bottom performance', async () => {
    const { rerender } = renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
    });

    // Mock scroll behavior
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    const scrollTime = await measurePerformance(async () => {
      // Simulate new message arrival
      const newMessages = [...mockConversationHistory, {
        id: 'new-msg',
        role: 'assistant',
        content: 'New message that should trigger scroll',
        timestamp: new Date(),
        emotion: 'neutral',
      }];

      vi.mocked(vi.fn()).mockReturnValue({
        messages: newMessages,
        sendMessage: vi.fn(),
      });

      rerender(<RealTherapyChatInterface />);
      
      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalled();
      });
    }, 'Auto-scroll Performance');

    expect(scrollTime).toBeLessThan(CHAT_PERFORMANCE_THRESHOLDS.SCROLL_UPDATE);
  });

  it('measures real-time updates performance', async () => {
    renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
    });

    const updateTime = await measurePerformance(async () => {
      // Simulate rapid state updates
      const states = [
        { isLoading: true, isTyping: false },
        { isLoading: false, isTyping: true },
        { isLoading: false, isTyping: false },
        { isLoading: true, isTyping: true },
        { isLoading: false, isTyping: false },
      ];

      for (const state of states) {
        vi.mocked(vi.fn()).mockReturnValue({
          messages: mockConversationHistory,
          sendMessage: vi.fn(),
          ...state,
        });
        
        // Trigger update
        const messageInput = screen.getByPlaceholderText(/type your message/i);
        fireEvent.focus(messageInput);
        
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }, 'Real-time Updates');

    expect(updateTime).toBeLessThan(200); // Should handle rapid updates
  });

  it('measures memory usage during extended chat session', async () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    const { unmount } = renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
    });

    // Simulate extended chat session
    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    for (let i = 0; i < 20; i++) {
      fireEvent.change(messageInput, { target: { value: `Message ${i}` } });
      fireEvent.click(sendButton);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const peakMemory = (performance as any).memory?.usedJSHeapSize || 0;
    unmount();
    
    if (global.gc) {
      global.gc();
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = (peakMemory - initialMemory) / 1024 / 1024;
    const memoryLeakage = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`Chat memory increase: ${memoryIncrease.toFixed(2)}MB`);
    console.log(`Memory after cleanup: ${memoryLeakage.toFixed(2)}MB`);

    expect(memoryIncrease).toBeLessThan(30); // Reasonable for chat session
    expect(memoryLeakage).toBeLessThan(3); // Minimal leakage
  });
});