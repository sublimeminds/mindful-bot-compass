import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';
import { mockWebGLContext, mockIntersectionObserver } from '../utils/test-helpers';

// Mock Three.js and React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children, onCreated, ...props }) => {
    // Simulate canvas creation
    if (onCreated) {
      const mockState = {
        gl: {
          domElement: document.createElement('canvas'),
          addEventListener: vi.fn(),
        },
      };
      onCreated(mockState);
    }
    return <div data-testid="three-canvas" {...props}>{children}</div>;
  }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(() => null),
}));

vi.mock('@/components/avatar/TherapistAvatarPersonas', () => ({
  __esModule: true,
  default: vi.fn(() => null),
  therapistPersonas: {
    'dr-sarah-chen': {
      name: 'Dr. Sarah Chen',
      appearance: { hairColor: '#2C1810' },
      gestures: { nodding: 0.8 },
    },
  },
}));

describe('ThreeDTherapistAvatar', () => {
  beforeEach(() => {
    mockWebGLContext();
    mockIntersectionObserver();
    vi.clearAllMocks();
  });

  it('renders 3D canvas when WebGL is supported', async () => {
    render(<ThreeDTherapistAvatar />);

    await waitFor(() => {
      expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
    });
  });

  it('falls back to 2D avatar when WebGL is not supported', () => {
    // Mock WebGL as unsupported
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => null,
      writable: true,
    });

    render(<ThreeDTherapistAvatar />);

    expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
  });

  it('displays therapist name and status overlay', async () => {
    render(
      <ThreeDTherapistAvatar
        therapistId="dr-sarah-chen"
        isListening={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('👂 Listening...')).toBeInTheDocument();
    });
  });

  it('shows speaking indicator when isSpeaking is true', async () => {
    render(
      <ThreeDTherapistAvatar
        therapistId="dr-sarah-chen"
        isSpeaking={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('💬 Speaking...')).toBeInTheDocument();
    });
  });

  it('handles WebGL context loss gracefully', async () => {
    const { rerender } = render(<ThreeDTherapistAvatar />);

    // Simulate context loss
    const canvas = document.createElement('canvas');
    const contextLossEvent = new Event('webglcontextlost');
    canvas.dispatchEvent(contextLossEvent);

    rerender(<ThreeDTherapistAvatar />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });
  });

  it('configures Canvas with correct props for performance', async () => {
    const CanvasMock = vi.mocked(await import('@react-three/fiber')).Canvas;
    
    render(<ThreeDTherapistAvatar />);

    expect(CanvasMock).toHaveBeenCalledWith(
      expect.objectContaining({
        gl: expect.objectContaining({
          preserveDrawingBuffer: false,
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: true,
        }),
        dpr: expect.any(Number),
      }),
      expect.anything()
    );
  });

  it('sets up OrbitControls when showControls is true', async () => {
    const OrbitControlsMock = vi.mocked(await import('@react-three/drei')).OrbitControls;
    
    render(<ThreeDTherapistAvatar showControls={true} />);

    await waitFor(() => {
      expect(OrbitControlsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          enableZoom: false,
          enablePan: false,
          autoRotate: true,
          autoRotateSpeed: 0.5,
        }),
        expect.anything()
      );
    });
  });

  it('handles different emotion states', async () => {
    const PersonalizedAvatarMock = vi.mocked(await import('@/components/avatar/TherapistAvatarPersonas')).default;
    
    render(
      <ThreeDTherapistAvatar
        emotion="happy"
        userEmotion="excited"
      />
    );

    await waitFor(() => {
      expect(PersonalizedAvatarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          emotion: 'happy',
          userEmotion: 'excited',
        }),
        expect.anything()
      );
    });
  });

  it('passes lip sync data to PersonalizedAvatar', async () => {
    const PersonalizedAvatarMock = vi.mocked(await import('@/components/avatar/TherapistAvatarPersonas')).default;
    const lipSyncData = new Float32Array([0.1, 0.3, 0.5]);
    
    render(
      <ThreeDTherapistAvatar
        lipSyncData={lipSyncData}
        isSpeaking={true}
      />
    );

    await waitFor(() => {
      expect(PersonalizedAvatarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          lipSyncData,
          isSpeaking: true,
        }),
        expect.anything()
      );
    });
  });
});