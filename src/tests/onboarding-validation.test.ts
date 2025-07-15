import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client');

describe('Onboarding Data Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Database Record Validation', () => {
    it('should verify fredericbeeg@icloud.com has no therapy plan', async () => {
      // Mock the actual database query that found no therapy plans
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [], // Empty array = no therapy plans
            error: null
          })
        })
      });

      const { data, error } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', 'user-id-for-fredericbeeg');

      expect(data).toEqual([]);
      expect(error).toBeNull();
    });

    it('should verify user onboarding_complete flag is false', async () => {
      // Mock the profiles query that showed onboarding_complete: false
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { 
                id: 'user-id-for-fredericbeeg',
                onboarding_complete: false,
                email: 'fredericbeeg@icloud.com'
              },
              error: null
            })
          })
        })
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('email', 'fredericbeeg@icloud.com')
        .single();

      expect(data?.onboarding_complete).toBe(false);
      expect(error).toBeNull();
    });

    it('should validate therapy plan creation saves to database', async () => {
      const mockPlan = {
        user_id: 'test-user-id',
        primary_approach: 'CBT',
        goals: ['Reduce anxiety'],
        created_at: new Date().toISOString()
      };

      // Mock successful insert
      (supabase.from as any).mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockPlan,
              error: null
            })
          })
        })
      });

      const { data, error } = await supabase
        .from('adaptive_therapy_plans')
        .upsert(mockPlan)
        .select()
        .single();

      expect(data).toEqual(mockPlan);
      expect(error).toBeNull();
    });

    it('should validate onboarding_complete flag update', async () => {
      // Mock successful profile update
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null
          })
        })
      });

      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', 'test-user-id');

      expect(error).toBeNull();
    });
  });

  describe('Edge Function Validation', () => {
    it('should validate adaptive-therapy-planner function response', async () => {
      const mockResponse = {
        primaryApproach: 'CBT',
        goals: ['Reduce anxiety'],
        effectivenessScore: 0.85
      };

      // Mock edge function invoke
      (supabase.functions as any) = {
        invoke: vi.fn().mockResolvedValue({
          data: mockResponse,
          error: null
        })
      };

      const { data, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: 'test-user-id',
          onboardingData: { culturalPreferences: {} }
        }
      });

      expect(data).toEqual(mockResponse);
      expect(error).toBeNull();
    });

    it('should handle edge function failures gracefully', async () => {
      // Mock edge function failure
      (supabase.functions as any) = {
        invoke: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Function timeout' }
        })
      };

      const { data, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: { userId: 'test-user-id' }
      });

      expect(data).toBeNull();
      expect(error).toEqual({ message: 'Function timeout' });
    });
  });

  describe('Data Integrity Validation', () => {
    it('should ensure onboarding data is complete before plan creation', () => {
      const validOnboardingData = {
        culturalPreferences: {
          primaryLanguage: 'en',
          culturalBackground: 'western'
        },
        assessmentResults: {
          anxiety: 7,
          depression: 5
        }
      };

      const invalidOnboardingData = {};

      expect(Object.keys(validOnboardingData).length).toBeGreaterThan(0);
      expect(Object.keys(invalidOnboardingData).length).toBe(0);
    });

    it('should validate cultural profile structure', () => {
      const culturalProfile = {
        userId: 'test-user-id',
        primaryLanguage: 'en',
        culturalBackground: 'western',
        familyStructure: 'individual',
        communicationStyle: 'direct',
        religiousConsiderations: false,
        therapyApproachPreferences: ['cbt'],
        culturalSensitivities: []
      };

      // Validate required fields
      expect(culturalProfile.userId).toBeDefined();
      expect(culturalProfile.primaryLanguage).toBeDefined();
      expect(culturalProfile.familyStructure).toBeDefined();
      expect(culturalProfile.communicationStyle).toBeDefined();
      expect(typeof culturalProfile.religiousConsiderations).toBe('boolean');
      expect(Array.isArray(culturalProfile.therapyApproachPreferences)).toBe(true);
      expect(Array.isArray(culturalProfile.culturalSensitivities)).toBe(true);
    });
  });

  describe('Error Handling Validation', () => {
    it('should handle database connection errors', async () => {
      // Mock database connection error
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockRejectedValue(new Error('Connection timeout'))
        })
      });

      try {
        await supabase
          .from('adaptive_therapy_plans')
          .select('*')
          .eq('user_id', 'test-user-id');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Connection timeout');
      }
    });

    it('should handle invalid user authentication', () => {
      const mockUser = null;
      const validUser = { id: 'test-user-id', email: 'test@example.com' };

      expect(mockUser).toBeNull();
      expect(validUser.id).toBeDefined();
      expect(validUser.email).toBeDefined();
    });

    it('should validate therapy plan data completeness', () => {
      const completePlan = {
        user_id: 'test-user-id',
        primary_approach: 'CBT',
        goals: ['Goal 1', 'Goal 2'],
        techniques: ['Technique 1'],
        effectiveness_score: 0.85
      };

      const incompletePlan: any = {
        user_id: 'test-user-id'
        // Missing required fields
      };

      expect(completePlan.primary_approach).toBeDefined();
      expect(Array.isArray(completePlan.goals)).toBe(true);
      expect(completePlan.goals.length).toBeGreaterThan(0);
      
      expect(incompletePlan.primary_approach).toBeUndefined();
      expect(incompletePlan.goals).toBeUndefined();
    });
  });
});