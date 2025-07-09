import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { measurePerformance } from '../utils/test-helpers';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';

// Performance benchmark thresholds
const PERFORMANCE_THRESHOLDS = {
  AVATAR_2D_RENDER_TIME: 50, // milliseconds
  AVATAR_3D_RENDER_TIME: 100, // milliseconds
  MEMORY_USAGE_LIMIT: 100, // MB
  FRAME_RATE_MIN: 30, // FPS
};

describe('Avatar Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('measures 2D avatar rendering performance', async () => {
    const renderTime = await measurePerformance(async () => {
      render(
        <Professional2DAvatar
          therapistId="dr-sarah-chen"
          therapistName="Dr. Sarah Chen"
          size="lg"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    }, '2D Avatar Render');

    expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.AVATAR_2D_RENDER_TIME);
  });

  it('measures 3D avatar initialization performance', async () => {
    const renderTime = await measurePerformance(async () => {
      render(<ThreeDTherapistAvatar therapistId="dr-sarah-chen" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
      }, { timeout: 2000 });
    }, '3D Avatar Initialize');

    expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.AVATAR_3D_RENDER_TIME);
  });

  it('measures multiple avatar rendering performance', async () => {
    const avatars = Array.from({ length: 10 }, (_, i) => ({
      id: `therapist-${i}`,
      name: `Therapist ${i}`,
    }));

    const renderTime = await measurePerformance(async () => {
      const { container } = render(
        <div>
          {avatars.map(avatar => (
            <Professional2DAvatar
              key={avatar.id}
              therapistId={avatar.id}
              therapistName={avatar.name}
              size="md"
            />
          ))}
        </div>
      );

      await waitFor(() => {
        expect(container.children[0].children).toHaveLength(10);
      });
    }, 'Multiple Avatars Render');

    // Should render 10 avatars in reasonable time
    expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.AVATAR_2D_RENDER_TIME * 3);
  });

  it('measures memory usage during avatar lifecycle', async () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    const { unmount } = render(
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <ThreeDTherapistAvatar key={i} therapistId={`therapist-${i}`} />
        ))}
      </div>
    );

    await waitFor(() => {
      // Let avatars initialize
    }, { timeout: 1000 });

    const peakMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    unmount();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = (peakMemory - initialMemory) / 1024 / 1024; // MB
    const memoryLeakage = (finalMemory - initialMemory) / 1024 / 1024; // MB

    console.log(`Memory increase: ${memoryIncrease.toFixed(2)}MB`);
    console.log(`Memory after cleanup: ${memoryLeakage.toFixed(2)}MB`);

    expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_LIMIT);
    expect(memoryLeakage).toBeLessThan(10); // Should cleanup most memory
  });

  it('measures avatar emotion state change performance', async () => {
    const emotions = ['neutral', 'happy', 'concerned', 'encouraging', 'thoughtful'] as const;
    
    const { rerender } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        emotion="neutral"
      />
    );

    const totalTime = await measurePerformance(async () => {
      for (const emotion of emotions) {
        rerender(
          <Professional2DAvatar
            therapistId="dr-sarah-chen"
            therapistName="Dr. Sarah Chen"
            emotion={emotion}
          />
        );
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }, 'Emotion State Changes');

    const averageChangeTime = totalTime / emotions.length;
    expect(averageChangeTime).toBeLessThan(10); // Should be very fast
  });

  it('measures avatar resize performance', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    
    const { rerender } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        size="sm"
      />
    );

    const totalTime = await measurePerformance(async () => {
      for (const size of sizes) {
        rerender(
          <Professional2DAvatar
            therapistId="dr-sarah-chen"
            therapistName="Dr. Sarah Chen"
            size={size}
          />
        );
        
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }, 'Avatar Resize Operations');

    const averageResizeTime = totalTime / sizes.length;
    expect(averageResizeTime).toBeLessThan(5); // Should be very fast
  });

  it('benchmarks WebGL fallback performance', async () => {
    // Mock WebGL as unavailable
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => null,
      writable: true,
    });

    const fallbackTime = await measurePerformance(async () => {
      render(<ThreeDTherapistAvatar therapistId="dr-sarah-chen" />);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    }, 'WebGL Fallback');

    // Fallback should be faster than 3D rendering
    expect(fallbackTime).toBeLessThan(PERFORMANCE_THRESHOLDS.AVATAR_2D_RENDER_TIME);
  });
});