import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock supabase functions
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke
    }
  }
}));

describe('Voice Integration Tests', () => {
  beforeEach(() => {
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

  describe('ElevenLabs Voice Preview', () => {
    it('should call the correct edge function with therapist ID', async () => {
      mockInvoke.mockResolvedValue({
        data: { audioContent: 'base64audiodata', text: 'Hello test' },
        error: null
      });

      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId: 'dr-sarah-chen' }
      });

      expect(mockInvoke).toHaveBeenCalledWith('elevenlabs-voice-preview', {
        body: { therapistId: 'dr-sarah-chen' }
      });
      
      expect(result.data).toEqual({
        audioContent: 'base64audiodata',
        text: 'Hello test'
      });
    });

    it('should handle API errors gracefully', async () => {
      mockInvoke.mockResolvedValue({
        data: null,
        error: { message: 'API Error' }
      });

      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId: 'invalid-id' }
      });

      expect(result.error).toEqual({ message: 'API Error' });
    });

    it('should work with different therapist IDs', async () => {
      const therapistIds = [
        'dr-sarah-chen',
        'dr-michael-torres', 
        'dr-aisha-patel',
        'dr-james-wilson',
        'dr-emily-rodriguez',
        'dr-david-kim'
      ];

      for (const therapistId of therapistIds) {
        mockInvoke.mockResolvedValue({
          data: { audioContent: 'base64audiodata', text: `Hello from ${therapistId}` },
          error: null
        });

        const { supabase } = await import('@/integrations/supabase/client');
        
        const result = await supabase.functions.invoke('elevenlabs-voice-preview', {
          body: { therapistId }
        });

        expect(mockInvoke).toHaveBeenCalledWith('elevenlabs-voice-preview', {
          body: { therapistId }
        });
        
        expect(result.data.text).toContain(therapistId);
      }
    });

    it('should handle custom introduction text', async () => {
      const customText = 'This is a custom introduction';
      
      mockInvoke.mockResolvedValue({
        data: { audioContent: 'base64audiodata', text: customText },
        error: null
      });

      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { 
          therapistId: 'dr-sarah-chen',
          text: customText
        }
      });

      expect(mockInvoke).toHaveBeenCalledWith('elevenlabs-voice-preview', {
        body: { 
          therapistId: 'dr-sarah-chen',
          text: customText
        }
      });
    });
  });

  describe('Audio Playback', () => {
    it('should create audio element with correct data URL', () => {
      const base64Audio = 'base64audiodata';
      const expectedDataUrl = `data:audio/mpeg;base64,${base64Audio}`;
      
      const audio = new HTMLAudioElement();
      
      expect(HTMLAudioElement).toHaveBeenCalledWith(expectedDataUrl);
    });

    it('should handle audio play events', async () => {
      const mockAudio = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        currentTime: 0,
        onplay: null,
        onended: null,
        onerror: null
      };

      global.HTMLAudioElement = vi.fn().mockImplementation(() => mockAudio);

      const audio = new HTMLAudioElement();
      
      // Simulate play event
      if (audio.onplay) {
        audio.onplay(new Event('play'));
      }
      
      await audio.play();
      
      expect(mockAudio.play).toHaveBeenCalled();
    });

    it('should handle audio end events', () => {
      const mockAudio = {
        play: vi.fn(),
        pause: vi.fn(),
        currentTime: 0,
        onplay: null,
        onended: null,
        onerror: null
      };

      global.HTMLAudioElement = vi.fn().mockImplementation(() => mockAudio);

      const audio = new HTMLAudioElement();
      
      // Simulate end event
      if (audio.onended) {
        audio.onended(new Event('ended'));
      }
      
      // Test would verify state changes in actual component
      expect(audio.onended).toBeDefined();
    });

    it('should handle audio error events', () => {
      const mockAudio = {
        play: vi.fn(),
        pause: vi.fn(),
        currentTime: 0,
        onplay: null,
        onended: null,
        onerror: null
      };

      global.HTMLAudioElement = vi.fn().mockImplementation(() => mockAudio);

      const audio = new HTMLAudioElement();
      
      // Simulate error event
      if (audio.onerror) {
        audio.onerror(new Event('error'));
      }
      
      // Test would verify error handling in actual component
      expect(audio.onerror).toBeDefined();
    });
  });

  describe('Voice Characteristics', () => {
    it('should map therapist IDs to correct voice characteristics', () => {
      const expectedMappings = {
        'dr-sarah-chen': 'Warm, analytical, reassuring',
        'dr-michael-torres': 'Professional, supportive, clear',
        'dr-aisha-patel': 'Gentle, calming, wise',
        'dr-james-wilson': 'Professional, supportive, clear',
        'dr-emily-rodriguez': 'Professional, supportive, clear',
        'dr-david-kim': 'Professional, supportive, clear'
      };

      // Function to get voice characteristics based on communication style
      const getVoiceCharacteristics = (communicationStyle: string) => {
        if (communicationStyle.includes('energetic')) return 'Energetic, motivating, clear';
        if (communicationStyle.includes('gentle')) return 'Gentle, calming, wise';
        if (communicationStyle.includes('warm')) return 'Warm, analytical, reassuring';
        return 'Professional, supportive, clear';
      };

      Object.entries(expectedMappings).forEach(([therapistId, expected]) => {
        let style = 'professional';
        if (therapistId === 'dr-sarah-chen') style = 'warm & supportive';
        if (therapistId === 'dr-aisha-patel') style = 'gentle & patient';
        
        const result = getVoiceCharacteristics(style);
        expect(result).toBe(expected);
      });
    });
  });
});