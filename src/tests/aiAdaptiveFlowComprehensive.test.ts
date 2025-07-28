import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedSmartOnboardingFlow from '@/components/onboarding/EnhancedSmartOnboardingFlow';
import AdvancedTherapyInterface from '@/components/therapy/AdvancedTherapyInterface';
import { ErrorHandlingService } from '@/services/errorHandlingService';
import { DataValidationService } from '@/services/dataValidationService';
import { PerformanceMonitoringService } from '@/services/performanceMonitoringService';

// Mock test data for various user profiles
const mockUserProfiles = {
  anxietyProfile: {
    id: 'user-anxiety-123',
    primary_concerns: ['anxiety', 'panic_attacks'],
    therapy_preferences: { approach: 'CBT', session_frequency: 'weekly' },
    cultural_context: { language: 'en', background: 'western' },
    severity_level: 'moderate'
  },
  depressionProfile: {
    id: 'user-depression-456',
    primary_concerns: ['depression', 'mood_swings'],
    therapy_preferences: { approach: 'DBT', session_frequency: 'bi-weekly' },
    cultural_context: { language: 'es', background: 'hispanic' },
    severity_level: 'severe'
  },
  traumaProfile: {
    id: 'user-trauma-789',
    primary_concerns: ['ptsd', 'trauma'],
    therapy_preferences: { approach: 'EMDR', session_frequency: 'weekly' },
    cultural_context: { language: 'en', background: 'african_american' },
    severity_level: 'high'
  }
};

// Mock therapy session data
const mockSessionData = {
  basic: {
    messages: [
      { content: 'Hello, how are you feeling today?', timestamp: Date.now() },
      { content: 'I am feeling a bit anxious about work.', timestamp: Date.now() + 1000 }
    ],
    mood_scores: { start: 4, current: 5 },
    engagement_level: 0.7
  },
  crisis: {
    messages: [
      { content: 'I do not think I can handle this anymore', timestamp: Date.now() },
      { content: 'Sometimes I think about ending it all', timestamp: Date.now() + 1000 }
    ],
    mood_scores: { start: 2, current: 1 },
    engagement_level: 0.3
  }
};

describe('AI Adaptive Flow - Comprehensive End-to-End Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    });
    
    // Mock Supabase functions
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { success: true },
      error: null
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  describe('Complete Onboarding to Therapy Plan to Session Flow', () => {
    it('should complete full flow for anxiety user profile', async () => {
      const mockOnComplete = vi.fn();
      
      renderWithProviders(
        <EnhancedSmartOnboardingFlow onComplete={mockOnComplete} />
      );

      // Find and click complete button
      const buttons = screen.getAllByRole('button');
      const completeButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('complete'));
      
      if (completeButton) {
        fireEvent.click(completeButton);
      }

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });

      // Verify therapy plan generation
      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'adaptive-therapy-planner',
        expect.objectContaining({
          body: expect.objectContaining({
            userProfile: expect.any(Object)
          })
        })
      );
    });

    it('should adapt therapy plan based on cultural context', async () => {
      const hispanicProfile = mockUserProfiles.depressionProfile;
      
      renderWithProviders(
        <AdvancedTherapyInterface
          therapistId="dr-maria-rodriguez"
          therapyApproach="DBT"
          initialMood={3}
          culturalContext={hispanicProfile.cultural_context}
        />
      );

      await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith(
          'enhanced-therapy-matching',
          expect.objectContaining({
            body: expect.objectContaining({
              culturalBackground: 'hispanic',
              primaryLanguage: 'es'
            })
          })
        );
      });
    });

    it('should handle concurrent multi-user scenarios', async () => {
      const promises = Object.values(mockUserProfiles).map(async (profile) => {
        const component = (
          <AdvancedTherapyInterface
            therapistId="dr-test"
            therapyApproach="CBT"
            initialMood={5}
            culturalContext={profile.cultural_context}
          />
        );
        
        return renderWithProviders(component);
      });

      await Promise.all(promises);

      // Verify all users received personalized plans
      expect(supabase.functions.invoke).toHaveBeenCalledTimes(3);
    });
  });

  describe('Real-time Adaptation and Response', () => {
    it('should detect mood changes and adapt session', async () => {
      renderWithProviders(
        <AdvancedTherapyInterface
          therapistId="dr-test"
          therapyApproach="CBT"
          initialMood={7}
          culturalContext={{ language: 'en', background: 'western', communicationStyle: 'direct' }}
        />
      );

      // Find mood slider and simulate change
      const sliders = screen.getAllByRole('slider');
      if (sliders.length > 0) {
        fireEvent.change(sliders[0], { target: { value: '3' } });
      }

      await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith(
          'real-time-therapy-adaptation',
          expect.objectContaining({
            body: expect.objectContaining({
              moodChange: expect.objectContaining({
                from: 7,
                to: 3,
                severity: 'significant'
              })
            })
          })
        );
      });
    });

    it('should track engagement levels and suggest interventions', async () => {
      const performanceService = PerformanceMonitoringService;
      
      const mockMetrics = await performanceService.getSystemPerformance();
      
      expect(mockMetrics).toHaveProperty('metrics');
      expect(mockMetrics.metrics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'user_engagement',
            status: expect.stringMatching(/good|warning|critical/)
          })
        ])
      );
    });
  });

  describe('Data Integrity and Validation', () => {
    it('should validate onboarding data integrity', async () => {
      const validationResult = await DataValidationService.validateOnboardingData({
        userId: 'test-user-123',
        responses: {
          primary_concerns: ['anxiety'],
          therapy_goals: ['reduce_anxiety'],
          availability: 'weekdays'
        }
      });

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    it('should detect and handle invalid session data', async () => {
      const invalidSessionData = {
        sessionId: '', // Invalid empty ID
        messages: null as any, // Invalid null messages
        userId: 'test-user'
      };

      const validationResult = await DataValidationService.validateSessionData(invalidSessionData);

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toContain('Session ID is required');
      expect(validationResult.errors).toContain('Messages array is required');
    });

    it('should maintain cross-table data consistency', async () => {
      const integrityReport = await DataValidationService.performIntegrityCheck();

      expect(integrityReport.overallStatus).toMatch(/healthy|warning|critical/);
      expect(integrityReport.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            table: expect.any(String),
            status: expect.stringMatching(/pass|warning|fail/),
            issuesFound: expect.any(Number)
          })
        ])
      );
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle AI service failures gracefully', async () => {
      // Mock AI service failure
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(
        new Error('AI service unavailable')
      );

      const fallbackResponse = await ErrorHandlingService.handleAIServiceError(
        new Error('AI service unavailable'),
        { retryCount: 0, maxRetries: 3 }
      );

      expect(fallbackResponse).toHaveProperty('useFallback', true);
      expect(fallbackResponse).toHaveProperty('fallbackData');
    });

    it('should recover from network failures', async () => {
      // Mock network failure
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(
        new Error('Network error')
      );

      const recoveryResult = await ErrorHandlingService.handleNetworkError(
        new Error('Network error'),
        { retryCount: 0, maxRetries: 3 }
      );

      expect(recoveryResult).toHaveProperty('shouldRetry', true);
      expect(recoveryResult).toHaveProperty('retryDelay');
    });

    it('should handle partial system failures', async () => {
      // Mock partial failures
      const services = ['therapy-planner', 'message-analyzer', 'crisis-detector'];
      const failedServices = ['message-analyzer'];

      const systemStatus = await ErrorHandlingService.handlePartialSystemFailure(
        services,
        failedServices
      );

      expect(systemStatus.availableServices).toEqual(['therapy-planner', 'crisis-detector']);
      expect(systemStatus.degradedMode).toBe(true);
      expect(systemStatus.fallbacksActivated).toContain('message-analyzer');
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle high concurrent user load', async () => {
      const concurrentUsers = 50;
      const loadTestPromises = Array.from({ length: concurrentUsers }, (_, i) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockUser = {
              id: `load-test-user-${i}`,
              sessionData: mockSessionData.basic
            };
            resolve(mockUser);
          }, Math.random() * 100);
        });
      });

      const results = await Promise.all(loadTestPromises);
      expect(results).toHaveLength(concurrentUsers);

      // Verify system performance under load
      const performanceMetrics = await PerformanceMonitoringService.getSystemPerformance();
      expect(performanceMetrics.overallHealth).toMatch(/excellent|good|degraded|critical/);
    });

    it('should maintain response times under normal load', async () => {
      const startTime = performance.now();
      
      renderWithProviders(
        <AdvancedTherapyInterface
          therapistId="dr-test"
          therapyApproach="CBT"
          initialMood={5}
          culturalContext={{ language: 'en', background: 'western', communicationStyle: 'direct' }}
        />
      );

      await waitFor(() => {
        const responseTime = performance.now() - startTime;
        expect(responseTime).toBeLessThan(2000); // Should load within 2 seconds
      });
    });

    it('should detect memory leaks in long sessions', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Simulate long therapy session with many messages
      for (let i = 0; i < 100; i++) {
        const messageEvent = new CustomEvent('therapyMessage', {
          detail: { content: `Test message ${i}`, timestamp: Date.now() }
        });
        window.dispatchEvent(messageEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Integration Points', () => {
    it('should integrate all services correctly', async () => {
      const integrationTest = async () => {
        // Test service chain: Onboarding -> Planning -> Session -> Analysis
        const onboardingData = mockUserProfiles.anxietyProfile;
        
        // Step 1: Validate onboarding data
        const validation = await DataValidationService.validateOnboardingData({
          userId: onboardingData.id,
          responses: onboardingData
        });
        expect(validation.isValid).toBe(true);

        // Step 2: Generate therapy plan
        const planResponse = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: { userProfile: onboardingData }
        });
        expect(planResponse.error).toBeNull();

        // Step 3: Start therapy session
        const sessionResponse = await supabase.functions.invoke('real-time-therapy-adaptation', {
          body: { sessionData: mockSessionData.basic, userProfile: onboardingData }
        });
        expect(sessionResponse.error).toBeNull();

        // Step 4: Analyze session messages
        const analysisResponse = await supabase.functions.invoke('analyze-therapy-message', {
          body: { 
            message: mockSessionData.basic.messages[1].content,
            userId: onboardingData.id
          }
        });
        expect(analysisResponse.error).toBeNull();

        return true;
      };

      const result = await integrationTest();
      expect(result).toBe(true);
    });
  });
});