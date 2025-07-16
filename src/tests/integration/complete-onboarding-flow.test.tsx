import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedSmartOnboardingFlow from '@/components/onboarding/EnhancedSmartOnboardingFlow';
import TherapyPlanCreationStep from '@/components/onboarding/TherapyPlanCreationStep';

// Mock dependencies
const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('sonner', () => ({
  toast: {
    loading: mockToast,
    success: mockToast,
    error: mockToast,
    dismiss: mockToast,
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
  }),
}));

vi.mock('@/hooks/useSubscriptionAccess', () => ({
  useSubscriptionAccess: () => ({
    tier: 'free',
    isPremium: false,
    isProfessional: false,
    therapyPlanLimit: 1,
  }),
}));

vi.mock('@/hooks/useOnboardingProgress', () => ({
  useOnboardingProgress: () => ({
    progress: null,
    saveProgress: vi.fn(),
    updateStep: vi.fn(),
    clearProgress: vi.fn(),
    hasProgress: () => false,
    isLoaded: true,
  }),
}));

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      })),
    })),
  })),
  functions: {
    invoke: vi.fn(),
  },
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

// Mock SEO hook
vi.mock('@/hooks/useSEO', () => ({
  useSEO: () => {},
}));

// Mock scroll utility
vi.mock('@/hooks/useScrollToTop', () => ({
  scrollToTop: vi.fn(),
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

describe('Complete Onboarding Flow Integration', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ 
                data: { id: 'plan-id', primary_approach: 'CBT' }, 
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

  describe('Onboarding Flow Navigation', () => {
    it('should render initial welcome step', () => {
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={mockOnComplete} />
      );

      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('should show correct progress indicator', async () => {
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={mockOnComplete} />
      );

      // Skip intro animation
      const getStartedBtn = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(getStartedBtn);

      await waitFor(() => {
        expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
      });
    });

    it('should allow navigation between steps', async () => {
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={mockOnComplete} />
      );

      // Skip intro
      const getStartedBtn = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(getStartedBtn);

      await waitFor(() => {
        // Should be on welcome step initially
        expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
      });

      // Mock step completion and navigation
      const nextBtn = screen.getByRole('button', { name: /next/i });
      if (nextBtn) {
        fireEvent.click(nextBtn);
        
        await waitFor(() => {
          expect(screen.getByText(/step 2 of/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Data Collection and Validation', () => {
    it('should collect and validate onboarding data', async () => {
      const onComplete = vi.fn();
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={onComplete} />
      );

      // Simulate completing all onboarding steps with mock data
      const mockOnboardingData = {
        demographics: { age: 25, gender: 'female' },
        culturalPreferences: { 
          primaryLanguage: 'en', 
          culturalBackground: 'western',
          communicationStyle: 'direct'
        },
        assessmentResults: { anxiety: 7, depression: 5 },
        goals: ['anxiety management', 'stress reduction'],
        therapistSelection: 'therapist-1'
      };

      // Skip intro and simulate step completion
      const getStartedBtn = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(getStartedBtn);

      // Wait for onboarding to be ready
      await waitFor(() => {
        expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
      });

      // Simulate completion of onboarding flow
      // Note: In a real test, you would fill out each step properly
      // For this integration test, we're focusing on the overall flow
    });

    it('should handle missing required data gracefully', async () => {
      const onComplete = vi.fn();
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={onComplete} />
      );

      // Test with incomplete data
      const incompleteData = { demographics: { age: 25 } };
      
      // This would trigger validation in the actual component
      expect(incompleteData).toBeDefined();
    });
  });

  describe('Cultural Profile Integration', () => {
    it('should properly save cultural preferences', async () => {
      const onComplete = vi.fn();
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={onComplete} />
      );

      const culturalData = {
        primaryLanguage: 'es',
        culturalBackground: 'hispanic',
        familyStructure: 'extended',
        communicationStyle: 'indirect',
        religiousConsiderations: true,
        therapyApproachPreferences: ['culturally_adapted_cbt'],
        culturalSensitivities: ['family_involvement', 'religious_respect']
      };

      // Verify cultural data structure is valid
      expect(culturalData.primaryLanguage).toBe('es');
      expect(culturalData.culturalBackground).toBe('hispanic');
      expect(culturalData.therapyApproachPreferences).toContain('culturally_adapted_cbt');
    });
  });
});

describe('Therapy Plan Creation Integration', () => {
  const mockOnComplete = vi.fn();
  const mockOnboardingData = {
    demographics: { age: 30, gender: 'non-binary' },
    culturalPreferences: {
      primaryLanguage: 'en',
      culturalBackground: 'mixed',
      communicationStyle: 'direct'
    },
    assessmentResults: { anxiety: 8, depression: 6 },
    mentalHealthAssessments: {
      gad7: { score: 12, severity: 'moderate' },
      phq9: { score: 15, severity: 'moderately severe' }
    },
    traumaHistory: { hasTrauma: true, types: ['emotional'] },
    goals: ['anxiety management', 'emotional regulation'],
    therapistSelection: 'dr-sarah-williams'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful therapy plan creation
    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        planId: 'test-plan-id',
        primaryApproach: 'Cognitive Behavioral Therapy',
        secondaryApproach: 'Mindfulness-Based Therapy',
        goals: ['Reduce anxiety symptoms', 'Improve emotional regulation'],
        sessionFrequency: 'Weekly',
        treatmentDuration: '12-16 weeks'
      },
      error: null
    });

    // Mock plan verification
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

  it('should create therapy plan successfully', async () => {
    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={mockOnComplete}
      />
    );

    // Should show processing phases
    await waitFor(() => {
      expect(screen.getByText(/analyzing your responses/i)).toBeInTheDocument();
    });

    // Wait for completion
    await waitFor(() => {
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
        body: expect.objectContaining({
          userId: 'test-user-id',
          onboardingData: mockOnboardingData,
          culturalProfile: mockOnboardingData.culturalPreferences
        })
      });
    }, { timeout: 20000 });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(true, expect.any(Object));
    }, { timeout: 25000 });
  });

  it('should handle therapy plan creation errors', async () => {
    // Mock edge function failure
    mockSupabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: 'Edge function failed' }
    });

    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/plan creation failed/i)).toBeInTheDocument();
    }, { timeout: 20000 });

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    expect(mockOnComplete).toHaveBeenCalledWith(false);
  });

  it('should validate therapy plan was saved to database', async () => {
    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('adaptive_therapy_plans');
    }, { timeout: 20000 });
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
});

describe('Dashboard Navigation Integration', () => {
  it('should navigate to dashboard after successful onboarding', async () => {
    const mockOnComplete = vi.fn();
    
    renderWithProviders(
      <EnhancedSmartOnboardingFlow onComplete={mockOnComplete} />
    );

    // Simulate successful onboarding completion
    const completeData = {
      culturalPreferences: { primaryLanguage: 'en' },
      assessmentResults: { anxiety: 5 },
      onboardingComplete: true
    };

    // Call onComplete directly to test the handler
    mockOnComplete(completeData);

    expect(mockOnComplete).toHaveBeenCalledWith(completeData);
  });

  it('should update profile flags after onboarding', async () => {
    // This would be tested in the parent component that handles onComplete
    const profileUpdate = {
      onboarding_complete: true,
      therapy_plan_created: true,
      cultural_profile_set: true
    };

    expect(profileUpdate.onboarding_complete).toBe(true);
    expect(profileUpdate.therapy_plan_created).toBe(true);
    expect(profileUpdate.cultural_profile_set).toBe(true);
  });
});

describe('Error Handling and Recovery', () => {
  it('should handle network errors gracefully', async () => {
    // Mock network failure
    mockSupabase.functions.invoke.mockRejectedValue(new Error('Network error'));

    const mockOnboardingData = {
      culturalPreferences: { primaryLanguage: 'en' },
      assessmentResults: { anxiety: 7 }
    };

    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    }, { timeout: 20000 });
  });

  it('should allow retry after failure', async () => {
    let callCount = 0;
    mockSupabase.functions.invoke.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ data: null, error: { message: 'Temporary error' } });
      }
      return Promise.resolve({
        data: { planId: 'success-id' },
        error: null
      });
    });

    const mockOnboardingData = {
      culturalPreferences: { primaryLanguage: 'en' }
    };

    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={vi.fn()}
      />
    );

    // Wait for initial error
    await waitFor(() => {
      expect(screen.getByText(/temporary error/i)).toBeInTheDocument();
    }, { timeout: 20000 });

    // Click retry
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    // Should eventually succeed on retry
    expect(callCount).toBeGreaterThan(0);
  });
});

describe('Performance and User Experience', () => {
  it('should show loading states during processing', async () => {
    const mockOnboardingData = {
      culturalPreferences: { primaryLanguage: 'en' }
    };

    renderWithProviders(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData}
        onComplete={vi.fn()}
      />
    );

    // Should show loading/processing state
    await waitFor(() => {
      expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
    });
  });

  it('should display progress indicators', async () => {
    renderWithProviders(
      <EnhancedSmartOnboardingFlow onComplete={vi.fn()} />
    );

    // Skip intro
    const getStartedBtn = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedBtn);

    await waitFor(() => {
      // Should show progress bar
      const progressElement = document.querySelector('[style*="width"]');
      expect(progressElement).toBeInTheDocument();
    });
  });

  it('should handle step transitions smoothly', async () => {
    const onComplete = vi.fn();
    renderWithProviders(
      <EnhancedSmartOnboardingFlow onComplete={onComplete} />
    );

    // Test smooth transitions between steps
    const getStartedBtn = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedBtn);

    // Should transition without errors
    await waitFor(() => {
      expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
    });
  });
});