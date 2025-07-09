import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, waitFor, screen } from '@testing-library/user-event';
import React from 'react';
import LightweightAvatarSystem from '@/components/avatar/LightweightAvatarSystem';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import SafeAvatarModal from '@/components/avatar/SafeAvatarModal';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('Avatar System Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock HTMLAudioElement
    global.HTMLAudioElement = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      onplay: null,
      onended: null,
      onerror: null
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Professional2DAvatar', () => {
    it('should render with basic props', () => {
      render(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen'
        })
      );
      
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('AI Therapist')).toBeInTheDocument();
    });

    it('should display different emotions correctly', () => {
      const { rerender } = render(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          emotion: 'happy'
        })
      );
      
      // Check if emotion affects styling
      let avatar = screen.getByRole('img', { name: /Dr. Sarah Chen professional headshot/i });
      expect(avatar.className).toContain('brightness-110');
      
      rerender(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          emotion: 'concerned'
        })
      );
      
      avatar = screen.getByRole('img', { name: /Dr. Sarah Chen professional headshot/i });
      expect(avatar.className).toContain('brightness-90');
    });

    it('should show listening/speaking indicators', () => {
      render(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          isListening: true
        })
      );
      
      expect(screen.getByText('Listening...')).toBeInTheDocument();
    });

    it('should handle different sizes', () => {
      const { rerender } = render(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          size: 'sm'
        })
      );
      
      let avatar = document.querySelector('.w-12.h-12');
      expect(avatar).toBeInTheDocument();
      
      rerender(
        React.createElement(Professional2DAvatar, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          size: 'xl'
        })
      );
      
      avatar = document.querySelector('.w-32.h-32');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('LightweightAvatarSystem', () => {
    it('should render with default props', () => {
      render(
        React.createElement(LightweightAvatarSystem, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen'
        })
      );
      
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Hear Voice')).toBeInTheDocument();
      expect(screen.getByText('Emotion OFF')).toBeInTheDocument();
    });

    it('should toggle emotion detection', async () => {
      render(
        React.createElement(LightweightAvatarSystem, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen'
        })
      );
      
      const emotionButton = screen.getByText('Emotion OFF');
      fireEvent.click(emotionButton);
      
      await waitFor(() => {
        expect(screen.getByText('Emotion ON')).toBeInTheDocument();
      });
    });

    it('should handle voice preview correctly', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: { audioContent: 'base64audiodata' },
        error: null
      });
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.functions.invoke = mockInvoke;
      
      render(
        React.createElement(LightweightAvatarSystem, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen'
        })
      );
      
      const voiceButton = screen.getByText('Hear Voice');
      fireEvent.click(voiceButton);
      
      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith('elevenlabs-voice-preview', {
          body: { therapistId: 'dr-sarah-chen' }
        });
      });
    });

    it('should handle voice preview errors gracefully', async () => {
      const mockInvoke = vi.fn().mockRejectedValue(new Error('API Error'));
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.functions.invoke = mockInvoke;
      
      render(
        React.createElement(LightweightAvatarSystem, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen'
        })
      );
      
      const voiceButton = screen.getByText('Hear Voice');
      fireEvent.click(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to generate voice preview')).toBeInTheDocument();
      });
    });

    it('should display status indicators correctly', () => {
      render(
        React.createElement(LightweightAvatarSystem, {
          therapistId: 'dr-sarah-chen',
          therapistName: 'Dr. Sarah Chen',
          isListening: true,
          isSpeaking: false
        })
      );
      
      expect(screen.getByText('Listening')).toBeInTheDocument();
      expect(screen.queryByText('Speaking')).not.toBeInTheDocument();
    });
  });

  describe('SafeAvatarModal', () => {
    const mockTherapist = {
      id: 'dr-sarah-chen',
      avatarId: 'dr-sarah-chen',
      name: 'Dr. Sarah Chen',
      title: 'Cognitive Behavioral Therapist',
      approach: 'CBT',
      specialties: ['Anxiety', 'Depression', 'Stress Management']
    };

    it('should render when open', () => {
      render(
        React.createElement(SafeAvatarModal, {
          isOpen: true,
          onClose: vi.fn(),
          therapist: mockTherapist
        })
      );
      
      expect(screen.getByText('Meet Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Cognitive Behavioral Therapist')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        React.createElement(SafeAvatarModal, {
          isOpen: false,
          onClose: vi.fn(),
          therapist: mockTherapist
        })
      );
      
      expect(screen.queryByText('Meet Dr. Sarah Chen')).not.toBeInTheDocument();
    });

    it('should handle therapist selection', () => {
      const mockOnClose = vi.fn();
      
      render(
        React.createElement(SafeAvatarModal, {
          isOpen: true,
          onClose: mockOnClose,
          therapist: mockTherapist
        })
      );
      
      const selectButton = screen.getByText('Select Dr. Sarah Chen');
      fireEvent.click(selectButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should display therapist specialties', () => {
      render(
        React.createElement(SafeAvatarModal, {
          isOpen: true,
          onClose: vi.fn(),
          therapist: mockTherapist
        })
      );
      
      expect(screen.getByText('Anxiety')).toBeInTheDocument();
      expect(screen.getByText('Depression')).toBeInTheDocument();
      expect(screen.getByText('Stress Management')).toBeInTheDocument();
    });

    it('should show avatar status correctly', () => {
      render(
        React.createElement(SafeAvatarModal, {
          isOpen: true,
          onClose: vi.fn(),
          therapist: mockTherapist
        })
      );
      
      expect(screen.getByText('Avatar Status')).toBeInTheDocument();
      expect(screen.getByText('3D Avatar Active')).toBeInTheDocument();
    });
  });
});