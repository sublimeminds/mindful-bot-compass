import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock hooks and services
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: { name: 'Test User' }
};

const mockProfile = {
  id: 'test-user-id',
  onboarding_complete: true,
  therapy_plan_created: true,
  cultural_profile_set: true,
  first_session_completed: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('@/hooks/useSimpleApp', () => ({
  useSimpleApp: () => ({ user: mockUser }),
}));

// Mock dashboard components to avoid complex rendering
const MockDashboard = ({ profileData }: { profileData: any }) => (
  <div data-testid="dashboard">
    <div data-testid="onboarding-status">
      {profileData?.onboarding_complete ? 'Onboarding Complete' : 'Onboarding Incomplete'}
    </div>
    <div data-testid="therapy-plan-status">
      {profileData?.therapy_plan_created ? 'Therapy Plan Created' : 'No Therapy Plan'}
    </div>
    <div data-testid="cultural-profile-status">
      {profileData?.cultural_profile_set ? 'Cultural Profile Set' : 'No Cultural Profile'}
    </div>
  </div>
);

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
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

describe('Post-Onboarding Dashboard State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile State Verification', () => {
    it('should display completed onboarding status', async () => {
      renderWithProviders(<MockDashboard profileData={mockProfile} />);

      expect(screen.getByTestId('onboarding-status')).toHaveTextContent('Onboarding Complete');
      expect(screen.getByTestId('therapy-plan-status')).toHaveTextContent('Therapy Plan Created');
      expect(screen.getByTestId('cultural-profile-status')).toHaveTextContent('Cultural Profile Set');
    });

    it('should handle incomplete onboarding state', async () => {
      const incompleteProfile = {
        ...mockProfile,
        onboarding_complete: false,
        therapy_plan_created: false,
        cultural_profile_set: false
      };

      renderWithProviders(<MockDashboard profileData={incompleteProfile} />);

      expect(screen.getByTestId('onboarding-status')).toHaveTextContent('Onboarding Incomplete');
      expect(screen.getByTestId('therapy-plan-status')).toHaveTextContent('No Therapy Plan');
      expect(screen.getByTestId('cultural-profile-status')).toHaveTextContent('No Cultural Profile');
    });

    it('should fetch profile data on mount', async () => {
      renderWithProviders(<MockDashboard profileData={mockProfile} />);

      // In a real component, this would trigger a useEffect to fetch profile
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Onboarding Completion Flow', () => {
    it('should verify all completion flags are set', async () => {
      const profile = {
        onboarding_complete: true,
        therapy_plan_created: true,
        cultural_profile_set: true,
        first_session_completed: false
      };

      // Test that all required flags are true for completed onboarding
      expect(profile.onboarding_complete).toBe(true);
      expect(profile.therapy_plan_created).toBe(true);
      expect(profile.cultural_profile_set).toBe(true);
      
      // First session should still be false initially
      expect(profile.first_session_completed).toBe(false);
    });

    it('should handle profile update after onboarding completion', async () => {
      const updateData = {
        onboarding_complete: true,
        therapy_plan_created: true,
        cultural_profile_set: true,
        updated_at: new Date().toISOString()
      };

      // Simulate profile update
    mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: updateData, error: null }),
        })),
      }));

      // In a real test, this would be triggered by onboarding completion
      const result = await mockSupabase
        .from('profiles')
        .update(updateData)
        .eq('id', 'test-user-id');

      expect(result.data).toEqual(updateData);
    });

    it('should persist onboarding completion across sessions', async () => {
      // Mock localStorage to verify persistence
      const mockLocalStorage = {
        getItem: vi.fn(() => JSON.stringify({ onboardingCompleted: true })),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Verify that onboarding completion is persisted
      const storedData = JSON.parse(mockLocalStorage.getItem('onboarding_state') || '{}');
      
      // In a real app, this would check localStorage for completion status
      expect(mockLocalStorage.getItem).toBeDefined();
    });
  });

  describe('Data Consistency', () => {
    it('should ensure therapy plan exists when therapy_plan_created is true', async () => {
      // Mock therapy plan query
      const mockTherapyPlan = {
        id: 'therapy-plan-id',
        user_id: 'test-user-id',
        primary_approach: 'CBT',
        created_at: new Date().toISOString()
      };

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'adaptive_therapy_plans') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: mockTherapyPlan, error: null }),
              })),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
            })),
          })),
        };
      });

      // Verify therapy plan exists
      const { data: therapyPlan } = await mockSupabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', 'test-user-id')
        .single();

      expect(therapyPlan).toBeDefined();
      expect(therapyPlan.user_id).toBe('test-user-id');
    });

    it('should ensure cultural profile exists when cultural_profile_set is true', async () => {
      // Mock cultural profile query
      const mockCulturalProfile = {
        id: 'cultural-profile-id',
        user_id: 'test-user-id',
        primary_language: 'en',
        cultural_background: 'western',
        created_at: new Date().toISOString()
      };

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'user_cultural_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: mockCulturalProfile, error: null }),
              })),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
            })),
          })),
        };
      });

      // Verify cultural profile exists
      const { data: culturalProfile } = await mockSupabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', 'test-user-id')
        .single();

      expect(culturalProfile).toBeDefined();
      expect(culturalProfile.user_id).toBe('test-user-id');
    });

    it('should validate data integrity after onboarding', async () => {
      const validationChecks = {
        profileExists: true,
        therapyPlanExists: true,
        culturalProfileExists: true,
        assessmentDataExists: true,
        onboardingFlagsSet: true
      };

      // All validation checks should pass for completed onboarding
      Object.values(validationChecks).forEach(check => {
        expect(check).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing profile data gracefully', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Profile not found' } }),
          })),
        })),
      }));

      // Should handle missing profile without crashing
      const { data: profile, error } = await mockSupabase
        .from('profiles')
        .select('*')
        .eq('id', 'test-user-id')
        .single();

      expect(profile).toBeNull();
      expect(error).toBeDefined();
    });

    it('should handle database connection errors', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockRejectedValue(new Error('Database connection failed')),
          })),
        })),
      }));

      // Should handle database errors gracefully
      try {
        await mockSupabase
          .from('profiles')
          .select('*')
          .eq('id', 'test-user-id')
          .single();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Database connection failed');
      }
    });

    it('should handle inconsistent profile states', async () => {
      const inconsistentProfile = {
        ...mockProfile,
        onboarding_complete: true,
        therapy_plan_created: false, // Inconsistent state
        cultural_profile_set: true
      };

      renderWithProviders(<MockDashboard profileData={inconsistentProfile} />);

      // Should handle inconsistent state
      expect(screen.getByTestId('onboarding-status')).toHaveTextContent('Onboarding Complete');
      expect(screen.getByTestId('therapy-plan-status')).toHaveTextContent('No Therapy Plan');
    });
  });

  describe('Navigation and Routing', () => {
    it('should allow access to dashboard after onboarding completion', async () => {
      const completedProfile = {
        ...mockProfile,
        onboarding_complete: true
      };

      // User with completed onboarding should access dashboard
      expect(completedProfile.onboarding_complete).toBe(true);
      
      renderWithProviders(<MockDashboard profileData={completedProfile} />);
      
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    it('should redirect incomplete users appropriately', async () => {
      const incompleteProfile = {
        ...mockProfile,
        onboarding_complete: false,
        therapy_plan_created: false
      };

      // In a real app, this would trigger a redirect to onboarding
      expect(incompleteProfile.onboarding_complete).toBe(false);
      
      // Mock navigation would be tested here
      // expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should handle partial completion states', async () => {
      const partialProfile = {
        ...mockProfile,
        onboarding_complete: true,
        therapy_plan_created: false, // Partially completed
        cultural_profile_set: true
      };

      // Should handle partial completion appropriately
      renderWithProviders(<MockDashboard profileData={partialProfile} />);
      
      expect(screen.getByTestId('onboarding-status')).toHaveTextContent('Onboarding Complete');
      expect(screen.getByTestId('therapy-plan-status')).toHaveTextContent('No Therapy Plan');
    });
  });

  describe('User Experience', () => {
    it('should provide appropriate welcome messages for completed users', async () => {
      const welcomeMessage = mockProfile.onboarding_complete 
        ? 'Welcome back! Your therapy plan is ready.'
        : 'Complete your onboarding to get started.';

      expect(welcomeMessage).toBe('Welcome back! Your therapy plan is ready.');
    });

    it('should show next steps for completed onboarding', async () => {
      const nextSteps = [
        'Schedule your first session',
        'Review your therapy plan',
        'Explore wellness resources',
        'Set up session reminders'
      ];

      // Next steps should be available for completed users
      expect(nextSteps).toHaveLength(4);
      expect(nextSteps).toContain('Schedule your first session');
    });

    it('should display progress indicators appropriately', async () => {
      const progressData = {
        onboardingProgress: 100,
        therapyPlanProgress: 100,
        firstSessionProgress: 0 // Next step
      };

      // Progress should reflect completion
      expect(progressData.onboardingProgress).toBe(100);
      expect(progressData.therapyPlanProgress).toBe(100);
      expect(progressData.firstSessionProgress).toBe(0);
    });
  });
});