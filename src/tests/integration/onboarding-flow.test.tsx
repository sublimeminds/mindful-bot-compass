import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock all dependencies
vi.mock('@/integrations/supabase/client');
vi.mock('sonner');
vi.mock('@/hooks/useSimpleApp', () => ({
  useSimpleApp: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Create a full mock onboarding flow
vi.mock('@/components/onboarding/EnhancedSmartOnboardingFlow', () => ({
  default: ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div data-testid="onboarding-flow">
      <h1>Complete Your Assessment</h1>
      <button 
        onClick={() => onComplete({
          culturalPreferences: {
            primaryLanguage: 'en',
            culturalBackground: 'western',
            communicationStyle: 'direct',
            familyStructure: 'individual',
            religiousConsiderations: false,
            therapyApproachPreferences: ['cbt'],
            culturalSensitivities: []
          },
          assessmentResults: {
            anxiety: 7,
            depression: 5,
            stress: 6
          },
          therapistSelection: {
            preferredGender: 'any',
            preferredStyle: 'cognitive'
          },
          personalHistory: {
            relationshipStatus: 'single',
            workStatus: 'employed'
          }
        })}
      >
        Complete Assessment
      </button>
    </div>
  )
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Full Onboarding Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ success: true });
    vi.doMock('@/services/enhancedCulturalContextService', () => ({
      EnhancedCulturalContextService: {
        saveCulturalProfile: mockSaveCulturalProfile
      }
    }));

    // Mock Supabase responses
    const mockSupabaseUpdate = vi.fn().mockResolvedValue({ error: null });
    const mockSupabaseFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { 
                  id: 'test-plan-id', 
                  user_id: 'test-user-id',
                  primary_approach: 'CBT',
                  goals: ['Reduce anxiety']
                },
                error: null
              })
            })
          })
        })
      })
    });

    const mockSupabaseFunctions = {
      invoke: vi.fn().mockResolvedValue({
        data: {
          primaryApproach: 'Cognitive Behavioral Therapy (CBT)',
          primaryDescription: 'Evidence-based approach for anxiety and depression',
          goals: ['Reduce anxiety', 'Improve mood', 'Build coping skills'],
          effectivenessScore: 0.85
        },
        error: null
      })
    };

    (supabase.from as any) = mockSupabaseFrom;
    (supabase.functions as any) = mockSupabaseFunctions;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('completes full onboarding and therapy plan creation flow', async () => {
    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    // 1. Start with onboarding flow
    expect(screen.getByTestId('onboarding-flow')).toBeInTheDocument();
    expect(screen.getByText('Complete Your Assessment')).toBeInTheDocument();

    // 2. Complete the assessment
    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    // 3. Should show therapy plan creation
    await waitFor(() => {
      expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();
    });

    // 4. Wait for therapy plan creation to complete
    await waitFor(() => {
      expect(screen.getByText('Your Personalized Therapy Plan')).toBeInTheDocument();
    }, { timeout: 20000 });

    // 5. Verify the plan summary is shown
    expect(screen.getByText('Cognitive Behavioral Therapy (CBT)')).toBeInTheDocument();
    expect(screen.getByText('Reduce anxiety')).toBeInTheDocument();

    // 6. Complete the journey
    const startJourneyButton = screen.getByText('Start Your Therapy Journey');
    fireEvent.click(startJourneyButton);

    // 7. Verify onboarding is marked complete and navigation occurs
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles cultural profile saving failure gracefully', async () => {
    // Mock cultural profile saving to fail
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ 
      success: false, 
      error: 'Database connection failed' 
    });
    
    vi.doMock('@/services/enhancedCulturalContextService', () => ({
      EnhancedCulturalContextService: {
        saveCulturalProfile: mockSaveCulturalProfile
      }
    }));

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save cultural preferences. Please try again.');
    });

    // Should not proceed to therapy plan creation
    expect(screen.queryByText('Analyzing Your Responses')).not.toBeInTheDocument();
  });

  it('handles therapy plan creation edge function failure', async () => {
    // Mock edge function to fail
    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: { message: 'Edge function timeout' }
    });

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Plan Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Edge function timeout')).toBeInTheDocument();
    }, { timeout: 20000 });
  });

  it('handles therapy plan database verification failure', async () => {
    // Mock edge function to succeed but database verification to fail
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Plan not found in database' }
              })
            })
          })
        })
      })
    });

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText('Plan Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Therapy plan was not saved properly. Please try again.')).toBeInTheDocument();
    }, { timeout: 20000 });
  });

  it('prevents onboarding completion without therapy plan', async () => {
    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    // Wait for plan creation to start
    await waitFor(() => {
      expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();
    });

    // Verify that profiles table is not updated during this phase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Should not have called profiles update yet
    const profilesCalls = (supabase.from as any).mock.calls.filter(
      (call: any[]) => call[0] === 'profiles'
    );
    expect(profilesCalls).toHaveLength(0);
  });

  it('validates onboarding data completeness', async () => {
    // Mock incomplete onboarding data
    vi.mock('@/components/onboarding/EnhancedSmartOnboardingFlow', () => ({
      default: ({ onComplete }: { onComplete: (data: any) => void }) => (
        <div data-testid="onboarding-flow">
          <button onClick={() => onComplete({})}>
            Complete Empty Assessment
          </button>
        </div>
      )
    }));

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Empty Assessment');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid onboarding data. Please complete all steps.');
    });
  });

  it('tracks the complete user journey timing', async () => {
    const startTime = Date.now();
    
    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });

    const completeButton = screen.getByText('Complete Assessment');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText('Your Personalized Therapy Plan')).toBeInTheDocument();
    }, { timeout: 20000 });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time (under 20 seconds in test environment)
    expect(totalTime).toBeLessThan(20000);
    
    // Should take some time to show realistic progress (over 1 second)
    expect(totalTime).toBeGreaterThan(1000);
  });
});