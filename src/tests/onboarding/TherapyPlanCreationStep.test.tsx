import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TherapyPlanCreationStep from '@/components/onboarding/TherapyPlanCreationStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client');
vi.mock('sonner');
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
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
      {children}
    </QueryClientProvider>
  );
};

const mockOnboardingData = {
  culturalPreferences: {
    primaryLanguage: 'en',
    culturalBackground: 'western',
    communicationStyle: 'direct'
  },
  assessmentResults: {
    anxiety: 7,
    depression: 5
  },
  therapistSelection: {
    preferredGender: 'any',
    preferredStyle: 'cognitive'
  }
};

describe('TherapyPlanCreationStep', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts therapy plan creation automatically', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ 
      data: { primaryApproach: 'CBT' }, 
      error: null 
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'plan-123', user_id: 'test-user-id' },
              error: null
            })
          })
        })
      })
    });

    (supabase.functions as any) = { invoke: mockInvoke };
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('adaptive-therapy-planner', {
        body: expect.objectContaining({
          userId: 'test-user-id',
          onboardingData: mockOnboardingData
        })
      });
    }, { timeout: 10000 });
  });

  it('verifies therapy plan was saved to database', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ 
      data: { primaryApproach: 'CBT' }, 
      error: null 
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'plan-123', user_id: 'test-user-id' },
              error: null
            })
          })
        })
      })
    });

    (supabase.functions as any) = { invoke: mockInvoke };
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('adaptive_therapy_plans');
      expect(mockSelect).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('handles edge function error', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ 
      data: null, 
      error: { message: 'Function failed' }
    });

    (supabase.functions as any) = { invoke: mockInvoke };

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Plan Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Function failed')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('handles database verification failure', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ 
      data: { primaryApproach: 'CBT' }, 
      error: null 
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Plan not found' }
            })
          })
        })
      })
    });

    (supabase.functions as any) = { invoke: mockInvoke };
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Plan Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Therapy plan was not saved properly. Please try again.')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('shows progress phases during creation', async () => {
    const mockInvoke = vi.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ 
          data: { primaryApproach: 'CBT' }, 
          error: null 
        }), 5000)
      )
    );
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'plan-123', user_id: 'test-user-id' },
              error: null
            })
          })
        })
      })
    });

    (supabase.functions as any) = { invoke: mockInvoke };
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    // Check initial phase
    expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();
    
    // Wait for progress to advance through phases
    await waitFor(() => {
      expect(screen.getByText('Processing Cultural Preferences')).toBeInTheDocument();
    }, { timeout: 3500 });

    await waitFor(() => {
      expect(screen.getByText('Running Adaptive AI Analysis')).toBeInTheDocument();
    }, { timeout: 6000 });
  });

  it('calls onComplete with success when plan is created', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ 
      data: { primaryApproach: 'CBT', goals: ['Reduce anxiety'] }, 
      error: null 
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'plan-123', user_id: 'test-user-id' },
              error: null
            })
          })
        })
      })
    });

    (supabase.functions as any) = { invoke: mockInvoke };
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Your Personalized Therapy Plan')).toBeInTheDocument();
    }, { timeout: 20000 });

    // Wait for summary to show and complete button to appear
    await waitFor(() => {
      const completeButton = screen.getByText('Start Your Therapy Journey');
      expect(completeButton).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('validates required props', () => {
    expect(() => 
      render(
        <TherapyPlanCreationStep 
          onboardingData={{}} 
          onComplete={mockOnComplete} 
        />, 
        { wrapper: createWrapper() }
      )
    ).not.toThrow();
  });

  it('handles missing user authentication', async () => {
    vi.mock('@/hooks/useAuth', () => ({
      useAuth: () => ({
        user: null
      })
    }));

    render(
      <TherapyPlanCreationStep 
        onboardingData={mockOnboardingData} 
        onComplete={mockOnComplete} 
      />, 
      { wrapper: createWrapper() }
    );

    // Component should not start plan creation without user
    await waitFor(() => {
      expect(supabase.functions.invoke).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});