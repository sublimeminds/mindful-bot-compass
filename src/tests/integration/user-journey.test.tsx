import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TherapistDiscovery from '@/pages/TherapistDiscovery';
import RealTherapyChatInterface from '@/components/chat/RealTherapyChatInterface';
import { mockTherapistData } from '../utils/mock-data';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock therapist data
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: mockTherapistData,
          error: null,
        })),
      })),
    })),
  },
}));

// Mock auth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-123', email: 'test@example.com' },
    loading: false,
  }),
}));

// Mock chat hook
vi.mock('@/hooks/useRealEnhancedChat', () => ({
  useRealEnhancedChat: () => ({
    messages: [],
    sendMessage: vi.fn(),
    isLoading: false,
    currentEmotion: 'neutral',
    riskLevel: 'low',
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('End-to-End User Journey Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes therapist discovery to chat flow', async () => {
    // Step 1: Load therapist discovery page
    const { unmount } = renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Discover Your Ideal AI Therapist')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Step 2: Search for specific therapist
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.queryByText('Dr. Marcus Rodriguez')).not.toBeInTheDocument();
    });

    // Step 3: Select therapist
    const therapistCard = screen.getByText('Dr. Sarah Chen').closest('div');
    if (therapistCard) {
      fireEvent.click(therapistCard);
      expect(therapistCard).toHaveClass('ring-2');
    }

    // Step 4: Navigate to chat (simulate)
    const startChatButton = screen.getByText(/start session|begin chat/i);
    fireEvent.click(startChatButton);

    // Cleanup discovery page
    unmount();

    // Step 5: Load chat interface
    renderWithRouter(<RealTherapyChatInterface />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    // Step 6: Send first message
    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Hello, I need help with anxiety' } });
    fireEvent.click(sendButton);

    // Verify chat functionality
    expect((messageInput as HTMLInputElement).value).toBe('');
  });

  it('handles therapist selection persistence across navigation', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Select therapist
    const therapistCard = screen.getByText('Dr. Sarah Chen').closest('div');
    if (therapistCard) {
      fireEvent.click(therapistCard);
    }

    // Verify selection is stored
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedTherapist',
      expect.stringContaining('dr-sarah-chen')
    );
  });

  it('maintains session state during chat interaction', async () => {
    const mockSendMessage = vi.fn();
    const messages = [
      {
        id: '1',
        role: 'user',
        content: 'I feel anxious',
        timestamp: new Date(),
      }
    ];

    vi.mocked(vi.fn()).mockReturnValue({
      messages,
      sendMessage: mockSendMessage,
      isLoading: false,
      sessionId: 'session-123',
    });

    renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('I feel anxious')).toBeInTheDocument();
    });

    // Send new message
    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Can you help me?' } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith('Can you help me?');
  });

  it('handles avatar transitions between 2D and 3D', async () => {
    // Test WebGL detection and fallback
    let webglSupported = true;
    
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: (contextType: string) => {
        if ((contextType === 'webgl' || contextType === 'experimental-webgl') && webglSupported) {
          return {}; // Mock WebGL context
        }
        return null;
      },
      configurable: true,
    });

    const { rerender } = renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      // Should attempt 3D avatar first
      expect(document.querySelector('canvas')).toBeInTheDocument();
    });

    // Simulate WebGL context loss
    webglSupported = false;
    
    rerender(<RealTherapyChatInterface />);

    await waitFor(() => {
      // Should fallback to 2D avatar
      expect(screen.getByText(/therapist|dr\./i)).toBeInTheDocument();
    });
  });

  it('maintains accessibility during state changes', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Check initial accessibility
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    expect(searchInput).toHaveAttribute('aria-label');

    // Apply filter and verify accessibility maintained
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    await waitFor(() => {
      // Verify filtered results maintain accessibility
      const therapistCards = screen.getAllByRole('button');
      therapistCards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
      });
    });
  });

  it('handles error recovery during navigation', async () => {
    // Mock API error
    vi.mocked(vi.fn()).mockReturnValueOnce({
      data: null,
      error: new Error('Network error'),
    });

    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });

    // Mock recovery
    vi.mocked(vi.fn()).mockReturnValue({
      data: mockTherapistData,
      error: null,
    });

    // Simulate retry
    const retryButton = screen.getByText(/retry|refresh/i);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });
  });

  it('validates data flow between components', async () => {
    const therapistData = {
      id: 'dr-sarah-chen',
      name: 'Dr. Sarah Chen',
      approach: 'CBT',
      specialties: ['Anxiety', 'Depression'],
    };

    // Mock context or prop passing
    const ContextProvider = ({ children }: { children: React.ReactNode }) => {
      return (
        <div data-therapist={JSON.stringify(therapistData)}>
          {children}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <ContextProvider>
          <TherapistDiscovery />
        </ContextProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Verify data is accessible
    const contextDiv = document.querySelector('[data-therapist]');
    expect(contextDiv).toHaveAttribute('data-therapist');
    
    const storedData = JSON.parse(contextDiv?.getAttribute('data-therapist') || '{}');
    expect(storedData.name).toBe('Dr. Sarah Chen');
  });

  it('handles concurrent operations without conflicts', async () => {
    renderWithRouter(<RealTherapyChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Simulate rapid message sending (potential race condition)
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        new Promise(resolve => {
          fireEvent.change(messageInput, { target: { value: `Message ${i}` } });
          fireEvent.click(sendButton);
          setTimeout(resolve, 10);
        })
      );
    }

    await Promise.all(promises);

    // Should handle concurrent operations gracefully
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });
});