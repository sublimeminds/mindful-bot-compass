import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client');
vi.mock('sonner');
vi.mock('@/hooks/useSimpleApp', () => ({
  useSimpleApp: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock components
vi.mock('@/components/onboarding/EnhancedSmartOnboardingFlow', () => ({
  default: ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div data-testid="onboarding-flow">
      <button onClick={() => onComplete({ culturalPreferences: { primaryLanguage: 'en' } })}>
        Complete Onboarding
      </button>
    </div>
  )
}));

vi.mock('@/components/onboarding/TherapyPlanCreationStep', () => ({
  default: ({ onComplete }: { onComplete: (success: boolean, data?: any) => void }) => (
    <div data-testid="therapy-plan-creation">
      <button onClick={() => onComplete(true, { planId: 'test-plan' })}>
        Complete Plan Creation
      </button>
      <button onClick={() => onComplete(false)}>
        Fail Plan Creation
      </button>
    </div>
  )
}));

vi.mock('@/services/enhancedCulturalContextService', () => ({
  EnhancedCulturalContextService: {
    saveCulturalProfile: vi.fn()
  }
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

describe('EnhancedOnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders onboarding flow initially', () => {
    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('onboarding-flow')).toBeInTheDocument();
    expect(screen.queryByTestId('therapy-plan-creation')).not.toBeInTheDocument();
  });

  it('shows therapy plan creation after onboarding completion', async () => {
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ success: true });
    const { EnhancedCulturalContextService } = await import('@/services/enhancedCulturalContextService');
    EnhancedCulturalContextService.saveCulturalProfile = mockSaveCulturalProfile;

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    const completeButton = screen.getByText('Complete Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId('therapy-plan-creation')).toBeInTheDocument();
    });

    expect(mockSaveCulturalProfile).toHaveBeenCalledWith({
      userId: 'test-user-id',
      primaryLanguage: 'en',
      culturalBackground: '',
      familyStructure: 'individual',
      communicationStyle: 'direct',
      religiousConsiderations: false,
      religiousDetails: undefined,
      therapyApproachPreferences: [],
      culturalSensitivities: []
    });
  });

  it('handles cultural profile saving error', async () => {
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ 
      success: false, 
      error: 'Database error' 
    });
    const { EnhancedCulturalContextService } = await import('@/services/enhancedCulturalContextService');
    EnhancedCulturalContextService.saveCulturalProfile = mockSaveCulturalProfile;

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    const completeButton = screen.getByText('Complete Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save cultural preferences. Please try again.');
    });

    expect(screen.queryByTestId('therapy-plan-creation')).not.toBeInTheDocument();
  });

  it('marks onboarding complete only after successful therapy plan creation', async () => {
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ success: true });
    const mockSupabaseUpdate = vi.fn().mockResolvedValue({ error: null });
    
    const { EnhancedCulturalContextService } = await import('@/services/enhancedCulturalContextService');
    EnhancedCulturalContextService.saveCulturalProfile = mockSaveCulturalProfile;
    
    (supabase.from as any).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    // Complete onboarding
    const completeButton = screen.getByText('Complete Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId('therapy-plan-creation')).toBeInTheDocument();
    });

    // Verify onboarding_complete is NOT set yet
    expect(supabase.from).not.toHaveBeenCalledWith('profiles');

    // Complete therapy plan creation
    const completePlanButton = screen.getByText('Complete Plan Creation');
    fireEvent.click(completePlanButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  it('handles therapy plan creation failure', async () => {
    const mockSaveCulturalProfile = vi.fn().mockResolvedValue({ success: true });
    const { EnhancedCulturalContextService } = await import('@/services/enhancedCulturalContextService');
    EnhancedCulturalContextService.saveCulturalProfile = mockSaveCulturalProfile;

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    // Complete onboarding
    const completeButton = screen.getByText('Complete Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId('therapy-plan-creation')).toBeInTheDocument();
    });

    // Fail therapy plan creation
    const failPlanButton = screen.getByText('Fail Plan Creation');
    fireEvent.click(failPlanButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create therapy plan. Please try again.');
      expect(screen.getByTestId('onboarding-flow')).toBeInTheDocument();
    });
  });

  it('validates onboarding data before proceeding', async () => {
    vi.mock('@/components/onboarding/EnhancedSmartOnboardingFlow', () => ({
      default: ({ onComplete }: { onComplete: (data: any) => void }) => (
        <div data-testid="onboarding-flow">
          <button onClick={() => onComplete({})}>
            Complete Empty Onboarding
          </button>
        </div>
      )
    }));

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    const completeButton = screen.getByText('Complete Empty Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid onboarding data. Please complete all steps.');
    });
  });

  it('handles unauthenticated user', async () => {
    vi.mock('@/hooks/useSimpleApp', () => ({
      useSimpleApp: () => ({
        user: null
      })
    }));

    render(<EnhancedOnboardingPage />, { wrapper: createWrapper() });
    
    const completeButton = screen.getByText('Complete Onboarding');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User not authenticated');
    });
  });
});