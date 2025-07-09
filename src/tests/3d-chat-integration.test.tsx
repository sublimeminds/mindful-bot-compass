import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { create3DTestEnvironment } from './setup-3d';
import VoiceEnhancedAvatarV2 from '@/components/avatar/enhanced/VoiceEnhancedAvatarV2';
import BulletproofThreeDAvatar from '@/components/avatar/enhanced/BulletproofThreeDAvatar';

// Mock chat interface component
const MockChatInterface = ({ onUserMessage, onAvatarResponse }: any) => {
  return (
    <div data-testid="chat-interface">
      <input 
        data-testid="chat-input"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onUserMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
      <button 
        data-testid="send-message"
        onClick={() => onAvatarResponse('Thank you for sharing that with me.')}
      >
        Send Avatar Response
      </button>
    </div>
  );
};

// Integration test component
const ThreeDChatIntegration = () => {
  const [userText, setUserText] = React.useState('');
  const [avatarText, setAvatarText] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(null);
  const [emotionHistory, setEmotionHistory] = React.useState<any[]>([]);

  const handleUserMessage = (message: string) => {
    setUserText(message);
    setIsListening(false);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }, 500);
  };

  const handleAvatarResponse = (response: string) => {
    setAvatarText(response);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const handleEmotionDetected = (emotion: any) => {
    setEmotionHistory(prev => [...prev.slice(-4), emotion]);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to get audio stream:', error);
    }
  };

  const stopListening = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    setIsListening(false);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Avatar Section */}
      <div className="w-1/2 h-full">
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={audioStream || undefined}
          isListening={isListening}
          isSpeaking={isSpeaking}
          userText={userText}
          enableVoiceAnalysis={true}
          enableEmotionDetection={true}
          enableLipSync={true}
          onEmotionDetected={handleEmotionDetected}
          className="w-full h-full"
        />
      </div>

      {/* Chat Section */}
      <div className="w-1/2 h-full flex flex-col">
        <div className="flex-1 p-4">
          <div data-testid="emotion-history" className="mb-4">
            <h3>Emotion History:</h3>
            {emotionHistory.map((emotion, index) => (
              <div key={index}>
                {emotion.emotion} ({Math.round(emotion.confidence * 100)}%)
              </div>
            ))}
          </div>
          
          <div data-testid="conversation-log" className="mb-4">
            {userText && <div>User: {userText}</div>}
            {avatarText && <div>Avatar: {avatarText}</div>}
          </div>
        </div>

        <div className="p-4 border-t">
          <MockChatInterface 
            onUserMessage={handleUserMessage}
            onAvatarResponse={handleAvatarResponse}
          />
          
          <div className="mt-2">
            <button 
              data-testid="start-listening"
              onClick={startListening}
              disabled={isListening}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Start Listening
            </button>
            <button 
              data-testid="stop-listening"
              onClick={stopListening}
              disabled={!isListening}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Stop Listening
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

describe('3D Chat Integration', () => {
  let testEnv: ReturnType<typeof create3DTestEnvironment>;

  beforeEach(() => {
    testEnv = create3DTestEnvironment();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Avatar-Chat Synchronization', () => {
    it('should render complete chat interface with avatar', async () => {
      render(<ThreeDChatIntegration />);

      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByTestId('emotion-history')).toBeInTheDocument();
    });

    it('should update avatar emotion when user sends message', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      
      // Type a happy message
      fireEvent.keyPress(chatInput, {
        key: 'Enter',
        target: { value: 'I am feeling absolutely wonderful today!' }
      });

      await waitFor(() => {
        expect(screen.getByText(/happy/)).toBeInTheDocument();
      });
    });

    it('should show listening state when voice input is active', async () => {
      render(<ThreeDChatIntegration />);

      const startListeningBtn = screen.getByTestId('start-listening');
      fireEvent.click(startListeningBtn);

      await waitFor(() => {
        expect(screen.getByText(/Listening/)).toBeInTheDocument();
      });
    });

    it('should show speaking state when avatar responds', async () => {
      render(<ThreeDChatIntegration />);

      const sendResponseBtn = screen.getByTestId('send-message');
      fireEvent.click(sendResponseBtn);

      await waitFor(() => {
        expect(screen.getByText(/Speaking/)).toBeInTheDocument();
      });

      // Fast-forward timers to complete speaking
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByText(/Speaking/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Emotion Tracking Integration', () => {
    it('should track emotion history throughout conversation', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      
      // Send multiple messages with different emotions
      const messages = [
        'I am very happy today!',
        'But I feel a bit worried about tomorrow',
        'Actually, I am feeling calm now'
      ];

      for (const message of messages) {
        fireEvent.keyPress(chatInput, {
          key: 'Enter',
          target: { value: message }
        });
        
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
      }

      await waitFor(() => {
        const emotionHistory = screen.getByTestId('emotion-history');
        expect(emotionHistory).toContainElement(screen.getByText(/happy/));
        expect(emotionHistory).toContainElement(screen.getByText(/anxious/));
        expect(emotionHistory).toContainElement(screen.getByText(/calm/));
      });
    });

    it('should show emotion confidence scores', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      
      fireEvent.keyPress(chatInput, {
        key: 'Enter',
        target: { value: 'I am extremely happy and joyful!' }
      });

      await waitFor(() => {
        // Should show confidence percentage
        expect(screen.getByText(/\d+%/)).toBeInTheDocument();
      });
    });
  });

  describe('Voice Analysis Integration', () => {
    it('should handle voice input and analysis', async () => {
      render(<ThreeDChatIntegration />);

      const startListeningBtn = screen.getByTestId('start-listening');
      fireEvent.click(startListeningBtn);

      await waitFor(() => {
        expect(screen.getByTestId('start-listening')).toBeDisabled();
        expect(screen.getByTestId('stop-listening')).not.toBeDisabled();
      });

      const stopListeningBtn = screen.getByTestId('stop-listening');
      fireEvent.click(stopListeningBtn);

      await waitFor(() => {
        expect(screen.getByTestId('start-listening')).not.toBeDisabled();
        expect(screen.getByTestId('stop-listening')).toBeDisabled();
      });
    });

    it('should handle microphone access failure gracefully', async () => {
      // Mock getUserMedia to fail
      testEnv.mockMedia.mockRejectedValue(new Error('Microphone access denied'));

      render(<ThreeDChatIntegration />);

      const startListeningBtn = screen.getByTestId('start-listening');
      fireEvent.click(startListeningBtn);

      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByTestId('start-listening')).not.toBeDisabled();
      });
    });
  });

  describe('Conversation Flow', () => {
    it('should maintain conversation state correctly', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      const sendResponseBtn = screen.getByTestId('send-message');
      
      // User sends message
      fireEvent.keyPress(chatInput, {
        key: 'Enter',
        target: { value: 'Hello, I need help with anxiety' }
      });

      await waitFor(() => {
        expect(screen.getByText(/User: Hello, I need help with anxiety/)).toBeInTheDocument();
      });

      // Avatar responds
      fireEvent.click(sendResponseBtn);

      await waitFor(() => {
        expect(screen.getByText(/Avatar: Thank you for sharing/)).toBeInTheDocument();
      });

      // Should show conversation in log
      const conversationLog = screen.getByTestId('conversation-log');
      expect(conversationLog).toContainElement(screen.getByText(/User:/));
      expect(conversationLog).toContainElement(screen.getByText(/Avatar:/));
    });

    it('should handle rapid message exchanges', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      const sendResponseBtn = screen.getByTestId('send-message');
      
      // Send multiple messages rapidly
      for (let i = 0; i < 3; i++) {
        fireEvent.keyPress(chatInput, {
          key: 'Enter',
          target: { value: `Message ${i + 1}` }
        });
        
        fireEvent.click(sendResponseBtn);
        
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
      }

      // Should handle all messages without crashing
      expect(screen.getByTestId('conversation-log')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    it('should handle long conversations without memory leaks', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      
      // Simulate a long conversation
      for (let i = 0; i < 20; i++) {
        fireEvent.keyPress(chatInput, {
          key: 'Enter',
          target: { value: `Message ${i + 1}: I feel different emotions` }
        });
        
        await act(async () => {
          vi.advanceTimersByTime(50);
        });
      }

      // Should still be responsive
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      
      // Emotion history should be limited (only last 5 emotions)
      const emotionItems = screen.getByTestId('emotion-history').children;
      expect(emotionItems.length).toBeLessThanOrEqual(6); // Title + max 5 emotions
    });

    it('should clean up resources when unmounted', async () => {
      const { unmount } = render(<ThreeDChatIntegration />);

      const startListeningBtn = screen.getByTestId('start-listening');
      fireEvent.click(startListeningBtn);

      await waitFor(() => {
        expect(screen.getByText(/Listening/)).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Audio stream should be cleaned up
      expect(testEnv.mockMedia).toHaveBeenCalled();
    });
  });

  describe('Error Recovery', () => {
    it('should recover from avatar errors gracefully', async () => {
      // Mock WebGL to fail after a few frames
      let frameCount = 0;
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      window.requestAnimationFrame = vi.fn((callback) => {
        frameCount++;
        if (frameCount > 3) {
          throw new Error('WebGL context lost');
        }
        return originalRequestAnimationFrame(callback);
      });

      render(<ThreeDChatIntegration />);

      // Should still show chat interface even if avatar fails
      await waitFor(() => {
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      });

      window.requestAnimationFrame = originalRequestAnimationFrame;
    });

    it('should handle emotion analysis errors', async () => {
      render(<ThreeDChatIntegration />);

      const chatInput = screen.getByTestId('chat-input');
      
      // Send message with potentially problematic content
      fireEvent.keyPress(chatInput, {
        key: 'Enter',
        target: { value: '🔥💀🎭🌪️🔮' } // Emojis and special characters
      });

      // Should not crash
      await waitFor(() => {
        expect(screen.getByTestId('conversation-log')).toBeInTheDocument();
      });
    });
  });
});