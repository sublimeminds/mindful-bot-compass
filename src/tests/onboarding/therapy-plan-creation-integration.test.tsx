import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TherapyPlanCreationStep from '@/components/onboarding/TherapyPlanCreationStep';

// Mock dependencies
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
};

vi.mock('sonner', () => ({
  toast: mockToast,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
  }),
}));

// Mock Supabase
const mockSupabase = {
  functions: {
    invoke: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Therapy Plan Creation Integration Tests', () => {
  const mockOnComplete = vi.fn();
  
  const defaultOnboardingData = {
    culturalPreferences: {
      primaryLanguage: 'en',
      culturalBackground: 'western',
      familyStructure: 'individual',
      communicationStyle: 'direct',
      religiousConsiderations: false,
      therapyApproachPreferences: ['cbt'],
      culturalSensitivities: []
    },
    demographics: {
      age: 28,
      gender: 'female',
      location: 'New York, NY'
    },
    assessmentResults: {
      anxiety: 7,
      depression: 5,
      stress: 8,
      overallWellbeing: 4
    },
    mentalHealthAssessments: {
      gad7: { score: 12, severity: 'moderate' },
      phq9: { score: 15, severity: 'moderately severe' },
      pss: { score: 28, severity: 'high' }
    },
    traumaHistory: {
      hasTrauma: true,
      types: ['emotional', 'psychological'],
      ageOfTrauma: '18-25',
      currentImpact: 'moderate'
    },
    goals: [
      'Reduce anxiety symptoms',
      'Improve emotional regulation',
      'Develop coping strategies',
      'Enhance relationships'
    ],
    therapistSelection: {
      preferredPersonality: 'dr-sarah-williams',
      communicationStyle: 'supportive',
      specialtyNeeds: ['anxiety', 'trauma']
    },
    preferences: {
      sessionFrequency: 'weekly',
      sessionDuration: 50,
      homeworkComfort: 7,
      groupTherapyInterest: false
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful responses
    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        planId: 'test-plan-id',
        primaryApproach: 'Cognitive Behavioral Therapy',
        secondaryApproach: 'Mindfulness-Based Therapy',
        goals: ['Reduce anxiety', 'Improve coping'],
        sessionFrequency: 'Weekly',
        treatmentDuration: '12-16 weeks',
        success: true
      },
      error: null
    });

    // Mock successful database verification
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'test-plan-id',
                  user_id: 'test-user-id',
                  primary_approach: 'Cognitive Behavioral Therapy',
                  secondary_approach: 'Mindfulness-Based Therapy',
                  created_at: new Date().toISOString()
                },
                error: null
              }),
            })),
          })),
        })),
      })),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Successful Plan Creation', () => {
    it('should create therapy plan with complete onboarding data', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      // Should show initial processing phase
      expect(screen.getByText(/analyzing your responses/i)).toBeInTheDocument();

      // Wait for edge function to be called
      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
          body: expect.objectContaining({
            userId: 'test-user-id',
            onboardingData: defaultOnboardingData,
            culturalProfile: defaultOnboardingData.culturalPreferences,
            traumaHistory: defaultOnboardingData.traumaHistory,
            assessmentResults: defaultOnboardingData.assessmentResults
          })
        });
      }, { timeout: 15000 });

      // Wait for database verification
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('adaptive_therapy_plans');
      }, { timeout: 20000 });

      // Should complete successfully
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(true, expect.any(Object));
      }, { timeout: 25000 });
    });

    it('should display all processing phases', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      // Check for different phases appearing
      expect(screen.getByText(/analyzing your responses/i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText(/processing cultural preferences/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      await waitFor(() => {
        expect(screen.getByText(/running adaptive ai analysis/i)).toBeInTheDocument();
      }, { timeout: 8000 });

      await waitFor(() => {
        expect(screen.getByText(/creating your therapy plan/i)).toBeInTheDocument();
      }, { timeout: 12000 });
    });

    it('should show plan summary after completion', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      // Wait for completion and summary to appear
      await waitFor(() => {
        expect(screen.getByText(/your personalized therapy plan/i)).toBeInTheDocument();
      }, { timeout: 30000 });

      // Should show plan details
      expect(screen.getByText(/cognitive behavioral therapy/i)).toBeInTheDocument();
      expect(screen.getByText(/mindfulness-based therapy/i)).toBeInTheDocument();
    });
  });

  describe('Cultural Integration', () => {
    it('should adapt plan for different cultural backgrounds', async () => {
      const culturalData = {
        ...defaultOnboardingData,
        culturalPreferences: {
          primaryLanguage: 'es',
          culturalBackground: 'hispanic',
          familyStructure: 'extended',
          communicationStyle: 'indirect',
          religiousConsiderations: true,
          religiousDetails: 'Catholic traditions important',
          therapyApproachPreferences: ['culturally_adapted_cbt', 'family_therapy'],
          culturalSensitivities: ['family_involvement', 'religious_respect']
        }
      };

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={culturalData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
          body: expect.objectContaining({
            culturalProfile: expect.objectContaining({
              primaryLanguage: 'es',
              culturalBackground: 'hispanic',
              religiousConsiderations: true,
              therapyApproachPreferences: expect.arrayContaining(['culturally_adapted_cbt'])
            })
          })
        });
      }, { timeout: 15000 });
    });

    it('should handle religious considerations in plan creation', async () => {
      const religiousData = {
        ...defaultOnboardingData,
        culturalPreferences: {
          ...defaultOnboardingData.culturalPreferences,
          religiousConsiderations: true,
          religiousDetails: 'Islamic values and practices important',
          culturalSensitivities: ['prayer_times', 'halal_lifestyle', 'family_honor']
        }
      };

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={religiousData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
          body: expect.objectContaining({
            culturalProfile: expect.objectContaining({
              religiousConsiderations: true,
              religiousDetails: 'Islamic values and practices important'
            })
          })
        });
      }, { timeout: 15000 });
    });
  });

  describe('Trauma-Informed Planning', () => {
    it('should incorporate trauma history into plan creation', async () => {
      const traumaData = {
        ...defaultOnboardingData,
        traumaHistory: {
          hasTrauma: true,
          types: ['physical', 'emotional', 'sexual'],
          ageOfTrauma: '6-12',
          currentImpact: 'severe',
          triggers: ['loud noises', 'crowds', 'authority figures'],
          copingMechanisms: ['isolation', 'substance_use'],
          previousTherapy: true,
          therapyHelpful: false
        }
      };

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={traumaData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
          body: expect.objectContaining({
            traumaHistory: expect.objectContaining({
              hasTrauma: true,
              types: expect.arrayContaining(['physical', 'emotional', 'sexual']),
              currentImpact: 'severe'
            })
          })
        });
      }, { timeout: 15000 });
    });
  });

  describe('Error Handling', () => {
    it('should handle edge function failures gracefully', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Edge function failed' }
      });

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/plan creation failed/i)).toBeInTheDocument();
      }, { timeout: 20000 });

      expect(screen.getByText(/edge function failed/i)).toBeInTheDocument();
      
      // Should show retry option
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(mockOnComplete).toHaveBeenCalledWith(false);
    });

    it('should handle network timeouts', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network timeout'));

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/network timeout/i)).toBeInTheDocument();
      }, { timeout: 20000 });
    });

    it('should handle database verification failures', async () => {
      // Edge function succeeds but database verification fails
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Plan not found in database' }
                }),
              })),
            })),
          })),
        })),
      }));

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/therapy plan was not saved properly/i)).toBeInTheDocument();
      }, { timeout: 25000 });
    });

    it('should handle missing onboarding data', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={{}}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/missing onboarding data/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('should handle unauthenticated user', async () => {
      // This test would require more complex mocking setup
      // Skipping for now to avoid build errors

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/user not authenticated/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('Performance and UX', () => {
    it('should show realistic progress indicators', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      // Should show progress for each phase
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);

      // Should show phase details
      await waitFor(() => {
        expect(screen.getByText(/loading assessment responses/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should provide appropriate loading messages', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      // Should show contextual loading messages
      expect(screen.getByText(/analyzing your responses/i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText(/processing cultural preferences/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should complete within reasonable time', async () => {
      const startTime = Date.now();

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      }, { timeout: 30000 });

      const duration = Date.now() - startTime;
      // Should complete within 30 seconds
      expect(duration).toBeLessThan(30000);
    });
  });

  describe('Data Validation and Integrity', () => {
    it('should validate required assessment data', async () => {
      const incompleteData = {
        culturalPreferences: { primaryLanguage: 'en' },
        // Missing assessmentResults and other required fields
      };

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={incompleteData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/missing onboarding data/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('should handle malformed assessment data', async () => {
      const malformedData = {
        ...defaultOnboardingData,
        assessmentResults: 'invalid_data', // Should be an object
        mentalHealthAssessments: null
      };

      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={malformedData}
          onComplete={mockOnComplete}
        />
      );

      // Should either handle gracefully or show appropriate error
      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalled();
      }, { timeout: 15000 });
    });

    it('should preserve data integrity through the process', async () => {
      renderWithProviders(
        <TherapyPlanCreationStep 
          onboardingData={defaultOnboardingData}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
          body: expect.objectContaining({
            userId: 'test-user-id',
            onboardingData: defaultOnboardingData,
            culturalProfile: defaultOnboardingData.culturalPreferences,
            traumaHistory: defaultOnboardingData.traumaHistory,
            assessmentResults: defaultOnboardingData.assessmentResults,
            mentalHealthAssessments: defaultOnboardingData.mentalHealthAssessments
          })
        });
      }, { timeout: 15000 });

      // Verify that all critical data is passed correctly
      const invokeCall = mockSupabase.functions.invoke.mock.calls[0];
      const payload = invokeCall[1].body;
      
      expect(payload.userId).toBe('test-user-id');
      expect(payload.onboardingData).toEqual(defaultOnboardingData);
      expect(payload.culturalProfile).toEqual(defaultOnboardingData.culturalPreferences);
    });
  });
});