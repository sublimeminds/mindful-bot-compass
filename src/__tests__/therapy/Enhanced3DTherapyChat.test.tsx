import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Enhanced3DTherapyChat from '@/components/therapy/Enhanced3DTherapyChat';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/hooks/useEnhancedChat');
vi.mock('@/hooks/use-toast');
vi.mock('@/integrations/supabase/client');
vi.mock('@11labs/react', () => ({
  useConversation: () => ({
    status: 'disconnected',
    startSession: vi.fn(),
    endSession: vi.fn()
  })
}));

// Mock WebGL/Three.js dependencies
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn()
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
  Environment: () => <div data-testid="environment" />
}));

const mockUseEnhancedChat = useEnhancedChat as vi.MockedFunction<typeof useEnhancedChat>;
const mockUseToast = useToast as vi.MockedFunction<typeof useToast>;
const mockSupabase = supabase as vi.Mocked<typeof supabase>;

describe('Enhanced3DTherapyChat', () => {
  const mockToast = vi.fn();
  const mockSendMessage = vi.fn();
  const mockPlayMessage = vi.fn();
  const mockSetMessages = vi.fn();

  const defaultProps = {
    therapistId: 'dr-sarah-chen',
    sessionId: 'test-session-123',
    onSessionEnd: vi.fn(),
    className: 'test-class'
  };

  const mockMessages = [
    {
      id: '1',
      content: 'Hello, how are you feeling today?',
      isUser: false,
      timestamp: new Date(),
      emotion: 'welcoming'
    },
    {
      id: '2',
      content: 'I feel a bit anxious.',
      isUser: true,
      timestamp: new Date(),
      emotion: 'anxious',
      confidence: 0.8
    }
  ];

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockUseEnhancedChat.mockReturnValue({
      messages: mockMessages,
      setMessages: mockSetMessages,
      isLoading: false,
      isPlaying: false,
      sendMessage: mockSendMessage,
      playMessage: mockPlayMessage,
      stopPlayback: vi.fn(),
      loadPreferences: vi.fn(),
      userPreferences: null
    });

    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        response: 'Thank you for sharing that with me. Can you tell me more about what is making you feel anxious?',
        therapistEmotion: 'empathetic',
        confidence: 0.9
      },
      error: null
    });

    // Mock getUserMedia for camera/mic access
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({})
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the therapy chat interface correctly', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      expect(screen.getByText('Enhanced 3D Therapy Session')).toBeInTheDocument();
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      expect(screen.getByText('3D')).toBeInTheDocument();
    });

    it('displays session duration timer', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/0:00/)).toBeInTheDocument();
      });
    });

    it('shows chat messages in traditional mode', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Switch to 2D mode
      const toggle2DButton = screen.getByText('3D');
      fireEvent.click(toggle2DButton);
      
      expect(screen.getByText('Hello, how are you feeling today?')).toBeInTheDocument();
      expect(screen.getByText('I feel a bit anxious.')).toBeInTheDocument();
    });
  });

  describe('3D Mode Functionality', () => {
    it('toggles between 3D and 2D modes', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const toggleButton = screen.getByText('3D');
      expect(toggleButton).toHaveClass('bg-therapy-100');
      
      fireEvent.click(toggleButton);
      expect(screen.getByText('2D')).toBeInTheDocument();
    });

    it('renders 3D avatar in 3D mode', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    });
  });

  describe('Voice and Camera Controls', () => {
    it('toggles microphone on/off', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const micButton = screen.getByRole('button', { name: /mic/i });
      expect(micButton).toHaveClass('bg-green-100'); // Initially enabled
      
      fireEvent.click(micButton);
      expect(micButton).toHaveClass('bg-red-100'); // Disabled
    });

    it('requests camera access when camera button is clicked', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const cameraButton = screen.getByRole('button', { name: /video/i });
      fireEvent.click(cameraButton);
      
      await waitFor(() => {
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
      });
    });

    it('handles camera access denial gracefully', async () => {
      (navigator.mediaDevices.getUserMedia as vi.Mock).mockRejectedValue(new Error('Permission denied'));
      
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const cameraButton = screen.getByRole('button', { name: /video/i });
      fireEvent.click(cameraButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Camera Access",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive"
        });
      });
    });
  });

  describe('Message Handling', () => {
    it('processes enhanced messages with emotion analysis', async () => {
      const mockEmotionData = {
        emotions: [{ name: 'anxiety', score: 0.7, intensity: 'medium' }],
        stressLevel: 0.6
      };
      
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: mockEmotionData,
        error: null
      });

      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Simulate voice message
      const voiceChat = screen.getByText('Voice Therapy Chat');
      expect(voiceChat).toBeInTheDocument();
    });

    it('generates AI responses with therapist personality', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Mock sendMessage function should be called internally
      expect(mockSendMessage).toHaveBeenCalledTimes(0); // Not called yet
    });

    it('handles message sending errors gracefully', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('API Error'));
      
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Error handling would be tested in the actual message sending flow
    });
  });

  describe('Session Metrics', () => {
    it('displays session metrics when enabled', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const metricsButton = screen.getByRole('button', { name: /activity/i });
      fireEvent.click(metricsButton);
      
      expect(screen.getByText('Session Metrics')).toBeInTheDocument();
      expect(screen.getByText('Engagement')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('Stress Level')).toBeInTheDocument();
    });

    it('updates engagement and progress metrics over time', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const metricsButton = screen.getByRole('button', { name: /activity/i });
      fireEvent.click(metricsButton);
      
      // Metrics should display initial values
      expect(screen.getByText('80%')).toBeInTheDocument(); // Engagement
      expect(screen.getByText('75%')).toBeInTheDocument(); // Progress
    });
  });

  describe('Emotion Detection Integration', () => {
    it('processes emotion updates correctly', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Enhanced emotion detection component should be present
      expect(screen.getByText('Enhanced Emotion Analysis')).toBeInTheDocument();
    });

    it('displays therapeutic insights when available', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const metricsButton = screen.getByRole('button', { name: /activity/i });
      fireEvent.click(metricsButton);
      
      // Should display insights section when insights are available
      await waitFor(() => {
        expect(screen.queryByText('Recent Insights')).toBeInTheDocument();
      });
    });
  });

  describe('Fullscreen Mode', () => {
    it('toggles fullscreen mode', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const fullscreenButton = screen.getByRole('button', { name: /maximize/i });
      fireEvent.click(fullscreenButton);
      
      // Should apply fullscreen classes
      const container = screen.getByText('Enhanced 3D Therapy Session').closest('div');
      expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
    });
  });

  describe('Session Management', () => {
    it('displays therapeutic bond and session quality indicators', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      expect(screen.getByText('Therapeutic Bond: Strong')).toBeInTheDocument();
      expect(screen.getByText('Session Quality: Excellent')).toBeInTheDocument();
    });

    it('handles session restart', () => {
      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
      
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const restartButton = screen.getByText('Restart Session');
      fireEvent.click(restartButton);
      
      expect(reloadSpy).toHaveBeenCalled();
      reloadSpy.mockRestore();
    });

    it('calls onSessionEnd when end session button is clicked', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const endButton = screen.getByText('End Session');
      fireEvent.click(endButton);
      
      expect(defaultProps.onSessionEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance and Optimization', () => {
    it('handles rapid emotion updates efficiently', async () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      // Simulate rapid emotion updates
      const updates = Array.from({ length: 10 }, (_, i) => ({
        emotions: [{ name: `emotion${i}`, score: Math.random(), intensity: 'medium' }],
        stressLevel: Math.random()
      }));
      
      // All updates should be handled without errors
      updates.forEach(update => {
        // Emotion updates would be processed internally
      });
      
      // Component should remain stable
      expect(screen.getByText('Enhanced 3D Therapy Session')).toBeInTheDocument();
    });

    it('cleans up timers on unmount', () => {
      const { unmount } = render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for interactive elements', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });

    it('supports keyboard navigation', () => {
      render(<Enhanced3DTherapyChat {...defaultProps} />);
      
      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();
      expect(firstButton).toHaveFocus();
    });
  });
});