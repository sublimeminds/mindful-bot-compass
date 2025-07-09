import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { create3DTestEnvironment } from './setup-3d';
import VoiceEnhancedAvatarV2 from '@/components/avatar/enhanced/VoiceEnhancedAvatarV2';

describe('VoiceEnhancedAvatarV2', () => {
  let testEnv: ReturnType<typeof create3DTestEnvironment>;
  let mockAudioStream: MediaStream;
  let mockAudioTrack: MediaStreamTrack;

  beforeEach(() => {
    testEnv = create3DTestEnvironment();
    
    // Create mock audio track
    mockAudioTrack = {
      id: 'audio-track-1',
      kind: 'audio',
      label: 'Mock Audio Track',
      enabled: true,
      muted: false,
      readyState: 'live',
      stop: vi.fn(),
      getSettings: vi.fn(() => ({})),
      getConstraints: vi.fn(() => ({})),
      getCapabilities: vi.fn(() => ({})),
      clone: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      applyConstraints: vi.fn()
    } as any;

    // Create mock media stream
    mockAudioStream = {
      id: 'stream-1',
      active: true,
      getTracks: vi.fn(() => [mockAudioTrack]),
      getAudioTracks: vi.fn(() => [mockAudioTrack]),
      getVideoTracks: vi.fn(() => []),
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
      clone: vi.fn(),
      getTrackById: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    } as any;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without audio stream', () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    it('should render with audio stream', async () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    });

    it('should handle disabled voice analysis', () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={false}
        />
      );

      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });
  });

  describe('Audio Context Management', () => {
    it('should create audio context when audio stream is provided', async () => {
      const audioContextSpy = vi.spyOn(window, 'AudioContext');

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
        />
      );

      await waitFor(() => {
        expect(audioContextSpy).toHaveBeenCalled();
      });
    });

    it('should handle audio context creation failure', async () => {
      // Mock AudioContext to throw error
      vi.spyOn(window, 'AudioContext').mockImplementation(() => {
        throw new Error('AudioContext not supported');
      });

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/AudioContext not supported/)).toBeInTheDocument();
      });
    });

    it('should clean up audio context on unmount', async () => {
      const { unmount } = render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
        />
      );

      await waitFor(() => {
        expect(testEnv.mockAudio.close).toBeDefined();
      });

      unmount();

      // Audio context should be closed
      expect(testEnv.mockAudio.close).toHaveBeenCalled();
    });
  });

  describe('Voice Analysis', () => {
    it('should perform voice analysis when enabled', async () => {
      const onVoiceAnalysis = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
          onVoiceAnalysis={onVoiceAnalysis}
        />
      );

      // Wait for analysis to start
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(onVoiceAnalysis).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should calculate volume correctly', async () => {
      const onVoiceAnalysis = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
          onVoiceAnalysis={onVoiceAnalysis}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(onVoiceAnalysis).toHaveBeenCalledWith(
          expect.objectContaining({
            volume: expect.any(Number),
            pitch: expect.any(Number),
            energy: expect.any(Number)
          })
        );
      });
    });

    it('should detect silence', async () => {
      const onVoiceAnalysis = vi.fn();

      // Mock very low volume data
      const mockGetFloatTimeDomainData = vi.fn((array) => {
        array.fill(0.001); // Very low values
      });
      testEnv.mockAudio.createAnalyser.mockReturnValue({
        ...testEnv.mockAudio.createAnalyser(),
        getFloatTimeDomainData: mockGetFloatTimeDomainData
      });

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
          onVoiceAnalysis={onVoiceAnalysis}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(onVoiceAnalysis).toHaveBeenCalledWith(
          expect.objectContaining({
            silence: true
          })
        );
      });
    });
  });

  describe('Emotion Detection', () => {
    it('should analyze emotion from text when enabled', async () => {
      const onEmotionDetected = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText="I am feeling very happy today!"
          enableEmotionDetection={true}
          onEmotionDetected={onEmotionDetected}
        />
      );

      await waitFor(() => {
        expect(onEmotionDetected).toHaveBeenCalledWith(
          expect.objectContaining({
            emotion: 'happy',
            confidence: expect.any(Number)
          })
        );
      });
    });

    it('should not analyze emotion when disabled', () => {
      const onEmotionDetected = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText="I am feeling very happy today!"
          enableEmotionDetection={false}
          onEmotionDetected={onEmotionDetected}
        />
      );

      expect(onEmotionDetected).not.toHaveBeenCalled();
    });

    it('should update emotion when text changes', async () => {
      const onEmotionDetected = vi.fn();

      const { rerender } = render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText="I am happy"
          enableEmotionDetection={true}
          onEmotionDetected={onEmotionDetected}
        />
      );

      await waitFor(() => {
        expect(onEmotionDetected).toHaveBeenCalledWith(
          expect.objectContaining({ emotion: 'happy' })
        );
      });

      // Change text to sad emotion
      rerender(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText="I am very sad"
          enableEmotionDetection={true}
          onEmotionDetected={onEmotionDetected}
        />
      );

      await waitFor(() => {
        expect(onEmotionDetected).toHaveBeenCalledWith(
          expect.objectContaining({ emotion: 'sad' })
        );
      });
    });
  });

  describe('Lip Sync', () => {
    it('should generate lip sync data when enabled', async () => {
      const onVoiceAnalysis = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableLipSync={true}
          onVoiceAnalysis={onVoiceAnalysis}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(onVoiceAnalysis).toHaveBeenCalledWith(
          expect.objectContaining({
            lipSyncData: expect.any(Float32Array)
          })
        );
      });
    });

    it('should not generate lip sync data when disabled', async () => {
      const onVoiceAnalysis = vi.fn();

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableLipSync={false}
          onVoiceAnalysis={onVoiceAnalysis}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const call = onVoiceAnalysis.mock.calls[0];
        if (call && call[0] && call[0].lipSyncData) {
          // Should be empty/minimal when disabled
          expect(call[0].lipSyncData.every((val: number) => val === 0)).toBe(true);
        }
      });
    });
  });

  describe('Status Indicators', () => {
    it('should show listening status', () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          isListening={true}
        />
      );

      expect(screen.getByText(/Listening/)).toBeInTheDocument();
    });

    it('should show speaking status', () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          isSpeaking={true}
        />
      );

      expect(screen.getByText(/Speaking/)).toBeInTheDocument();
    });

    it('should show detected emotion', async () => {
      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText="I am extremely happy!"
          enableEmotionDetection={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('happy')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle audio stream errors gracefully', () => {
      const invalidStream = null as any;

      expect(() => {
        render(
          <VoiceEnhancedAvatarV2
            therapistId="dr-sarah-chen"
            therapistName="Dr. Sarah Chen"
            audioStream={invalidStream}
            enableVoiceAnalysis={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle missing WebAudio API', async () => {
      // Remove AudioContext from window
      const originalAudioContext = window.AudioContext;
      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Web Audio API not supported/)).toBeInTheDocument();
      });

      // Restore AudioContext
      (window as any).AudioContext = originalAudioContext;
    });
  });

  describe('Performance', () => {
    it('should handle rapid text changes without crashing', async () => {
      const texts = [
        'I am happy',
        'I am sad', 
        'I am angry',
        'I am calm',
        'I am confused'
      ];

      const { rerender } = render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userText={texts[0]}
          enableEmotionDetection={true}
        />
      );

      // Rapidly change text
      for (let i = 1; i < texts.length; i++) {
        rerender(
          <VoiceEnhancedAvatarV2
            therapistId="dr-sarah-chen"
            therapistName="Dr. Sarah Chen"
            userText={texts[i]}
            enableEmotionDetection={true}
          />
        );
        
        await act(async () => {
          vi.advanceTimersByTime(10);
        });
      }

      // Should still be functional
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });
  });

  describe('Development Mode', () => {
    it('should show debug info in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <VoiceEnhancedAvatarV2
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          audioStream={mockAudioStream}
          enableVoiceAnalysis={true}
          userText="I am happy"
          enableEmotionDetection={true}
        />
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        // Should show voice analysis debug info
        expect(screen.getByText(/Vol:/)).toBeInTheDocument();
        expect(screen.getByText(/Emotion:/)).toBeInTheDocument();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});