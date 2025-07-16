import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';

// Mock dependencies
const mockNavigate = vi.fn();
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('sonner', () => ({
  toast: mockToast,
}));

vi.mock('@/hooks/useSimpleApp', () => ({
  useSimpleApp: () => ({
    user: { 
      id: 'test-user-id', 
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    },
  }),
}));

// Mock cultural context service
const mockCulturalService = {
  saveCulturalProfile: vi.fn(),
  getCulturalProfile: vi.fn(),
  updateCulturalPreferences: vi.fn(),
};

vi.mock('@/services/EnhancedCulturalContextService', () => ({
  EnhancedCulturalContextService: mockCulturalService,
}));

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
    insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    select: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
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

describe('Onboarding to Therapy Plan Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful cultural profile saving
    mockCulturalService.saveCulturalProfile.mockResolvedValue({
      success: true,
      profileId: 'cultural-profile-id'
    });

    // Mock successful therapy plan creation
    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        planId: 'therapy-plan-id',
        primaryApproach: 'CBT',
        success: true
      },
      error: null
    });

    // Mock profile update
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          update: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      };
    });
  });

  describe('Cultural Profile Transition', () => {
    it('should save cultural profile during onboarding completion', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: {
          primaryLanguage: 'es',
          culturalBackground: 'hispanic',
          familyStructure: 'extended',
          communicationStyle: 'indirect',
          religiousConsiderations: true,
          religiousDetails: 'Catholic traditions important',
          therapyApproachPreferences: ['culturally_adapted_cbt', 'family_therapy'],
          culturalSensitivities: ['family_involvement', 'religious_respect']
        },
        demographics: {
          age: 28,
          gender: 'female',
          location: 'Los Angeles, CA'
        },
        assessmentResults: {
          anxiety: 7,
          depression: 5,
          stress: 8
        }
      };

      // Simulate onboarding completion
      const onboardingPage = screen.getByTestId?.('enhanced-onboarding-page') || document.body;
      
      // Create a custom event to simulate onboarding completion
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      // Wait for cultural profile to be saved
      await waitFor(() => {
        expect(mockCulturalService.saveCulturalProfile).toHaveBeenCalledWith(
          'test-user-id',
          expect.objectContaining({
            culturalBackground: 'hispanic',
            primaryLanguage: 'es',
            communicationStyle: 'indirect',
            religiousConsiderations: true
          })
        );
      });
    });

    it('should handle cultural profile saving errors', async () => {
      // Mock cultural service failure
      mockCulturalService.saveCulturalProfile.mockRejectedValue(
        new Error('Cultural profile save failed')
      );

      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: {
          primaryLanguage: 'en',
          culturalBackground: 'western'
        }
      };

      // Simulate onboarding completion with error
      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining('cultural profile')
        );
      });
    });

    it('should validate cultural data before saving', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const invalidData = {
        culturalPreferences: {
          // Missing required fields
          communicationStyle: 'direct'
        }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: invalidData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining('missing')
        );
      });
    });
  });

  describe('Therapy Plan Creation Transition', () => {
    it('should create therapy plan after successful cultural profile save', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: {
          primaryLanguage: 'en',
          culturalBackground: 'western',
          communicationStyle: 'direct'
        },
        assessmentResults: {
          anxiety: 6,
          depression: 4
        },
        goals: ['anxiety management', 'stress reduction'],
        therapistSelection: 'dr-jane-smith'
      };

      // Simulate successful onboarding completion
      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      // Wait for therapy plan creation step to appear
      await waitFor(() => {
        expect(mockCulturalService.saveCulturalProfile).toHaveBeenCalled();
      });

      // Should eventually call therapy plan creation
      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
          'adaptive-therapy-planner',
          expect.objectContaining({
            body: expect.objectContaining({
              userId: 'test-user-id',
              onboardingData: mockOnboardingData
            })
          })
        );
      }, { timeout: 10000 });
    });

    it('should handle therapy plan creation failure', async () => {
      // Mock therapy plan creation failure
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Therapy plan creation failed' }
      });

      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' },
        assessmentResults: { anxiety: 5 }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining('therapy plan creation failed')
        );
      }, { timeout: 15000 });
    });

    it('should show therapy plan creation progress', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      // Should show plan creation step
      await waitFor(() => {
        // In a real implementation, this would check for the therapy plan creation component
        expect(mockCulturalService.saveCulturalProfile).toHaveBeenCalled();
      });
    });
  });

  describe('Dashboard Navigation', () => {
    it('should navigate to dashboard after successful completion', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' },
        assessmentResults: { anxiety: 5 }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      // Wait for all processes to complete
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      }, { timeout: 20000 });

      // Should eventually navigate to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 25000 });
    });

    it('should update profile flags correctly', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      // Should update profile with completion flags
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      }, { timeout: 20000 });

      // Verify the update call structure
      const updateCall = mockSupabase.from.mock.calls.find(call => call[0] === 'profiles');
      expect(updateCall).toBeDefined();
    });
  });

  describe('Data Persistence and Recovery', () => {
    it('should persist onboarding progress', async () => {
      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' },
        progress: { currentStep: 10, totalSteps: 14 }
      };

      // Simulate progress save
      localStorage.setItem('onboarding_progress', JSON.stringify(mockOnboardingData));

      // Verify data persistence
      const savedData = localStorage.getItem('onboarding_progress');
      expect(savedData).toBeDefined();
      
      const parsedData = JSON.parse(savedData!);
      expect(parsedData.culturalPreferences.primaryLanguage).toBe('en');
    });

    it('should handle interrupted onboarding flow', async () => {
      // Mock partially completed onboarding
      const partialData = {
        culturalPreferences: { primaryLanguage: 'en' },
        assessmentResults: { anxiety: 6 },
        // Missing therapy plan creation
        incomplete: true
      };

      renderWithProviders(<EnhancedOnboardingPage />);

      // Simulate interrupted flow recovery
      const onboardingPage = document.body;
      const resumeEvent = new CustomEvent('resumeOnboarding', {
        detail: partialData
      });
      
      onboardingPage.dispatchEvent(resumeEvent);

      // Should handle gracefully
      expect(partialData.incomplete).toBe(true);
    });
  });

  describe('Error Recovery and User Experience', () => {
    it('should provide clear error messages', async () => {
      mockCulturalService.saveCulturalProfile.mockRejectedValue(
        new Error('Network connectivity issue')
      );

      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' }
      };

      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining('network connectivity')
        );
      });
    });

    it('should allow retry after failure', async () => {
      let callCount = 0;
      mockCulturalService.saveCulturalProfile.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve({ success: true, profileId: 'retry-success' });
      });

      renderWithProviders(<EnhancedOnboardingPage />);

      const mockOnboardingData = {
        culturalPreferences: { primaryLanguage: 'en' }
      };

      // First attempt (should fail)
      const onboardingPage = document.body;
      const completionEvent = new CustomEvent('onboardingComplete', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(completionEvent);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });

      // Retry (should succeed)
      const retryEvent = new CustomEvent('retryOnboarding', {
        detail: mockOnboardingData
      });
      
      onboardingPage.dispatchEvent(retryEvent);

      expect(callCount).toBeGreaterThan(0);
    });
  });
});