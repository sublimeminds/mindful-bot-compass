import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RealTherapyChatInterface from '@/components/chat/RealTherapyChatInterface';
import { mockConversationHistory, mockEmotionAnalysis } from '../utils/mock-data';
import { mockAudioContext, mockIntersectionObserver } from '../utils/test-helpers';

// Mock enhanced chat hook
vi.mock('@/hooks/useRealEnhancedChat', () => ({
  useRealEnhancedChat: () => ({
    messages: mockConversationHistory,
    sendMessage: vi.fn(),
    isLoading: false,
    currentEmotion: 'calm',
    riskLevel: 'low',
    sessionAnalysis: {
      duration: 15,
      emotionalProgress: 'improving',
      suggestedTechniques: ['breathing', 'grounding'],
    },
  }),
}));

// Mock avatar components
vi.mock('@/components/avatar/VoiceEnhancedAvatarV2', () => ({
  default: vi.fn(({ isListening, isSpeaking }) => (
    <div data-testid="voice-avatar">
      {isListening && <span>Listening</span>}
      {isSpeaking && <span>Speaking</span>}
    </div>
  )),
}));

// Mock auth
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

describe('RealTherapyChatInterface', () => {
  beforeEach(() => {
    mockAudioContext();
    mockIntersectionObserver();
    vi.clearAllMocks();
  });

  it('renders chat interface with messages', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByText(/feeling really anxious/)).toBeInTheDocument();
      expect(screen.getByText(/understand that work anxiety/)).toBeInTheDocument();
    });
  });

  it('displays message input field', () => {
    renderWithRouter(<RealTherapyChatInterface />);

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    expect(messageInput).toBeInTheDocument();
  });

  it('renders voice-enhanced avatar', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('voice-avatar')).toBeInTheDocument();
    });
  });

  it('sends message when send button is clicked', async () => {
    const mockSendMessage = vi.fn();
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: mockSendMessage,
      isLoading: false,
      currentEmotion: 'calm',
      riskLevel: 'low',
    });

    renderWithRouter(<RealTherapyChatInterface />);

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Hello therapist' } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith('Hello therapist');
  });

  it('sends message when Enter key is pressed', async () => {
    const mockSendMessage = vi.fn();
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: mockSendMessage,
      isLoading: false,
    });

    renderWithRouter(<RealTherapyChatInterface />);

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    
    fireEvent.change(messageInput, { target: { value: 'Hello therapist' } });
    fireEvent.keyDown(messageInput, { key: 'Enter', code: 'Enter' });

    expect(mockSendMessage).toHaveBeenCalledWith('Hello therapist');
  });

  it('shows loading state when sending message', async () => {
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: vi.fn(),
      isLoading: true,
    });

    renderWithRouter(<RealTherapyChatInterface />);

    expect(screen.getByText(/sending/i)).toBeInTheDocument();
  });

  it('displays current emotion and risk level', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByText(/current mood/i)).toBeInTheDocument();
      expect(screen.getByText(/risk level/i)).toBeInTheDocument();
    });
  });

  it('shows session analysis when available', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByText(/session progress/i)).toBeInTheDocument();
      expect(screen.getByText(/breathing/i)).toBeInTheDocument();
    });
  });

  it('handles voice input activation', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    const voiceButton = screen.getByRole('button', { name: /voice/i });
    fireEvent.click(voiceButton);

    await waitFor(() => {
      expect(screen.getByText('Listening')).toBeInTheDocument();
    });
  });

  it('scrolls to bottom when new message arrives', async () => {
    const { rerender } = renderWithRouter(<RealTherapyChatInterface />);

    // Mock scroll behavior
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Add new message
    const newMessages = [...mockConversationHistory, {
      id: '4',
      role: 'assistant',
      content: 'New message',
      timestamp: new Date(),
      emotion: 'neutral',
    }];

    vi.mocked(vi.fn()).mockReturnValue({
      messages: newMessages,
      sendMessage: vi.fn(),
      isLoading: false,
    });

    rerender(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  it('displays typing indicator during response', async () => {
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: vi.fn(),
      isLoading: true,
      isTyping: true,
    });

    renderWithRouter(<RealTherapyChatInterface />);

    expect(screen.getByText(/typing/i)).toBeInTheDocument();
  });

  it('handles emergency/crisis scenarios', async () => {
    vi.mocked(vi.fn()).mockReturnValue({
      messages: mockConversationHistory,
      sendMessage: vi.fn(),
      riskLevel: 'high',
      crisisDetected: true,
    });

    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByText(/crisis support/i)).toBeInTheDocument();
    });
  });

  it('maintains message history during session', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      const messages = screen.getAllByText(/anxious|understand/);
      expect(messages.length).toBeGreaterThan(1);
    });
  });

  it('formats timestamps correctly', async () => {
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      // Look for timestamp elements (may be hidden or in aria-labels)
      const timestampElements = screen.getAllByText(/ago|AM|PM/);
      expect(timestampElements.length).toBeGreaterThan(0);
    });
  });
});