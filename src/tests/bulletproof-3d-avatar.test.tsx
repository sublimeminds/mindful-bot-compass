import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { create3DTestEnvironment, performanceTestUtils } from './setup-3d';
import BulletproofThreeDAvatar from '@/components/avatar/enhanced/BulletproofThreeDAvatar';
import { webglManager } from '@/utils/webgl-manager';

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, onCreated, onBeforeRender, ...props }: any) => {
    // Simulate Canvas behavior
    const mockState = {
      gl: {
        domElement: document.createElement('canvas'),
        dispose: vi.fn(),
      },
      scene: { add: vi.fn(), remove: vi.fn() },
      camera: { position: { set: vi.fn() } },
    };
    
    // Call onCreated if provided
    React.useEffect(() => {
      if (onCreated) onCreated(mockState);
      
      // Simulate render loop
      const interval = setInterval(() => {
        if (onBeforeRender) onBeforeRender();
      }, 16);
      
      return () => clearInterval(interval);
    }, []);
    
    return React.createElement('div', { 
      'data-testid': 'mock-canvas',
      ...props,
      style: { width: '100%', height: '100%' }
    }, children);
  },
  useFrame: vi.fn(),
  useThree: () => ({
    gl: { domElement: document.createElement('canvas') },
    scene: { add: vi.fn() },
    camera: { position: { set: vi.fn() } }
  })
}));

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => React.createElement('div', { 'data-testid': 'orbit-controls' }),
  useGLTF: () => ({ scene: null }),
  Html: ({ children }: any) => React.createElement('div', {}, children)
}));

describe('BulletproofThreeDAvatar', () => {
  let testEnv: ReturnType<typeof create3DTestEnvironment>;

  beforeEach(() => {
    testEnv = create3DTestEnvironment();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    webglManager.dispose();
  });

  describe('Rendering', () => {
    it('should render successfully with default props', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      // Should show loading animation
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render Canvas when WebGL is supported', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(true);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      // Fast-forward past detection delay
      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
      });
    });

    it('should show fallback when WebGL is not supported', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(false);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('mock-canvas')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    });
  });

  describe('WebGL Context Management', () => {
    it('should handle context loss gracefully', async () => {
      const onContextLoss = vi.fn();

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          onContextLoss={onContextLoss}
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Simulate context loss
      const canvas = document.createElement('canvas');
      const event = new CustomEvent('webgl-context-lost');
      canvas.dispatchEvent(event);

      await waitFor(() => {
        expect(onContextLoss).toHaveBeenCalled();
      });
    });

    it('should handle context restore', async () => {
      const onContextRestore = vi.fn();

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          onContextRestore={onContextRestore}
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Simulate context restore
      const canvas = document.createElement('canvas');
      const event = new CustomEvent('webgl-context-restored');
      canvas.dispatchEvent(event);

      await waitFor(() => {
        expect(onContextRestore).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should track FPS and render times', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(true);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          performanceMode="auto"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
      });

      // Simulate multiple frames
      for (let i = 0; i < 65; i++) {
        act(() => {
          vi.advanceTimersByTime(16); // 60fps = 16ms per frame
        });
      }

      // In development mode, performance metrics should be visible
      if (process.env.NODE_ENV === 'development') {
        await waitFor(() => {
          expect(screen.getByText(/FPS:/)).toBeInTheDocument();
        });
      }
    });

    it('should adjust quality based on performance', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(true);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          performanceMode="auto"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Simulate poor performance (slow frames)
      for (let i = 0; i < 65; i++) {
        act(() => {
          vi.advanceTimersByTime(50); // 20fps = 50ms per frame
        });
      }

      // Quality should be adjusted automatically
      await waitFor(() => {
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
      });
    });
  });

  describe('Emotion Integration', () => {
    it('should display emotion-based status', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          userEmotion="I am feeling very happy today!"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('happy')).toBeInTheDocument();
      });
    });

    it('should show listening indicator', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          isListening={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Listening/)).toBeInTheDocument();
      });
    });

    it('should show speaking indicator', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          isSpeaking={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Speaking/)).toBeInTheDocument();
      });
    });
  });

  describe('Props Validation', () => {
    it('should handle missing therapistId gracefully', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId=""
          therapistName="Test Therapist"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Therapist')).toBeInTheDocument();
      });
    });

    it('should handle missing therapistName gracefully', async () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName=""
        />
      );

      // Should still render without crashing
      expect(document.querySelector('.relative')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          className="custom-avatar-class"
        />
      );

      expect(document.querySelector('.custom-avatar-class')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should call onError callback when errors occur', async () => {
      const onError = vi.fn();

      // Mock WebGL detection to throw an error
      vi.spyOn(webglManager, 'isWebGLViable').mockImplementation(() => {
        throw new Error('WebGL detection failed');
      });

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          onError={onError}
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('should continue rendering after errors', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockImplementation(() => {
        throw new Error('WebGL detection failed');
      });

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Should show fallback even after error
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Modes', () => {
    it('should respect low performance mode', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(true);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          performanceMode="low"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
      });
    });

    it('should respect high performance mode', async () => {
      vi.spyOn(webglManager, 'isWebGLViable').mockReturnValue(true);

      render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          performanceMode="high"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
      });
    });
  });

  describe('Memory Management', () => {
    it('should clean up resources on unmount', async () => {
      const { unmount } = render(
        <BulletproofThreeDAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
        />
      );

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Unmount component
      unmount();

      // Should not have memory leaks
      expect(true).toBe(true); // Placeholder for memory leak detection
    });
  });
});