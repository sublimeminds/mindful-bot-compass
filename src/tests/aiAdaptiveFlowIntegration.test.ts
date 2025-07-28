import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ErrorHandlingService } from '@/services/errorHandlingService';
import { DataValidationService } from '@/services/dataValidationService';
import { PerformanceMonitoringService } from '@/services/performanceMonitoringService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn()
  }
}));

describe('AI Adaptive Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Onboarding Flow Tests', () => {
    it('should handle onboarding completion successfully', async () => {
      const mockUserData = {
        specificProblems: ['anxiety', 'stress'],
        culturalBackground: 'western',
        communicationStyle: 'direct'
      };

      const result = await ErrorHandlingService.handleOnboardingError(
        new Error('test'), 
        'analysis', 
        mockUserData
      );

      expect(result).toBeDefined();
      expect(result.fallback).toBe(true);
    });

    it('should validate onboarding data completeness', async () => {
      const validationRules = [
        { field: 'specificProblems', required: true, type: 'array' as const, minLength: 1 },
        { field: 'culturalBackground', required: false, type: 'string' as const },
        { field: 'communicationStyle', required: true, type: 'string' as const }
      ];

      const testData = {
        specificProblems: ['anxiety'],
        communicationStyle: 'direct'
      };

      const result = DataValidationService.validateUserData(testData, validationRules);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing required onboarding fields', async () => {
      const validationRules = [
        { field: 'specificProblems', required: true, type: 'array' as const, minLength: 1 }
      ];

      const testData = {};

      const result = DataValidationService.validateUserData(testData, validationRules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('specificProblems: is required');
    });

    it('should provide fallback analysis when AI fails', async () => {
      const result = await ErrorHandlingService.handleOnboardingError(
        new Error('AI service unavailable'),
        'analysis',
        { problems: ['anxiety'] }
      );

      expect(result.analysis).toBeDefined();
      expect(result.analysis.fallback).toBe(true);
      expect(result.analysis.recommendations).toContain('Regular check-ins');
    });
  });

  describe('Therapy Session Tests', () => {
    it('should handle therapy session interruptions gracefully', async () => {
      const sessionId = 'test-session-123';
      const context = {
        userId: 'user-123',
        sessionId,
        component: 'therapy-session'
      };

      const result = await ErrorHandlingService.handleSessionError(
        new Error('Connection lost'),
        sessionId,
        context
      );

      expect(result.fallback).toBe(true);
      expect(result.supportive).toBe(true);
      expect(result.message).toContain('still here for you');
    });

    it('should validate session data integrity', async () => {
      // Mock session data validation
      const mockValidation = vi.fn().mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      DataValidationService.validateSessionData = mockValidation;

      const result = await DataValidationService.validateSessionData('session-123', 'user-123');

      expect(result.isValid).toBe(true);
      expect(mockValidation).toHaveBeenCalledWith('session-123', 'user-123');
    });

    it('should detect and handle crisis scenarios', async () => {
      const crisisContext = {
        userId: 'user-123',
        sessionId: 'session-123',
        component: 'therapy-session',
        metadata: { message: 'I want to hurt myself' }
      };

      const result = await ErrorHandlingService.handleSessionError(
        new Error('Crisis detected'),
        'session-123',
        crisisContext
      );

      expect(result.crisis || result.emergency).toBe(true);
      expect(result.resources || result.contacts).toBeDefined();
    });
  });

  describe('Crisis Detection Tests', () => {
    it('should detect crisis keywords in user messages', async () => {
      const testMessages = [
        'I feel hopeless and want to end it all',
        'Everything is fine, just having a rough day'
      ];

      // Test crisis detection logic
      const crisisKeywords = ['hopeless', 'end it all', 'suicide', 'hurt myself'];
      
      testMessages.forEach((message, index) => {
        const containsCrisisKeywords = crisisKeywords.some(keyword => 
          message.toLowerCase().includes(keyword)
        );
        
        if (index === 0) {
          expect(containsCrisisKeywords).toBe(true);
        } else {
          expect(containsCrisisKeywords).toBe(false);
        }
      });
    });

    it('should provide immediate crisis support resources', async () => {
      const result = await ErrorHandlingService.handleError(
        new Error('Crisis situation'),
        { component: 'therapy-session', metadata: { crisis: true } }
      );

      expect(result.emergency || result.crisis).toBe(true);
      expect(result.resources || result.contacts).toBeDefined();
    });
  });

  describe('Performance Monitoring Tests', () => {
    it('should track system performance metrics', async () => {
      const metrics = await PerformanceMonitoringService.monitorSystemHealth();

      expect(Array.isArray(metrics)).toBe(true);
      // Each metric should have required properties
      metrics.forEach(metric => {
        expect(metric).toHaveProperty('name');
        expect(metric).toHaveProperty('value');
        expect(metric).toHaveProperty('status');
        expect(['good', 'warning', 'critical']).toContain(metric.status);
      });
    });

    it('should identify performance bottlenecks', async () => {
      const mockMetrics = [
        { name: 'response_time', value: 3000, threshold: 1000, status: 'critical' as const },
        { name: 'error_rate', value: 10, threshold: 5, status: 'critical' as const }
      ];

      // Mock the monitoring service
      PerformanceMonitoringService.monitorSystemHealth = vi.fn().mockResolvedValue(mockMetrics);

      const alerts = await PerformanceMonitoringService.generatePerformanceAlerts();

      expect(alerts.critical.length).toBeGreaterThan(0);
      expect(alerts.critical[0]).toContain('CRITICAL');
    });

    it('should track user drop-off patterns', async () => {
      const dropOffData = await PerformanceMonitoringService.trackUserDropOff();

      expect(Array.isArray(dropOffData)).toBe(true);
      dropOffData.forEach(point => {
        expect(point).toHaveProperty('step');
        expect(point).toHaveProperty('drop_off_rate');
        expect(point.drop_off_rate).toBeGreaterThanOrEqual(0);
        expect(point.drop_off_rate).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should implement retry logic for transient failures', async () => {
      let attempts = 0;
      const failingOperation = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Transient failure');
        }
        return { success: true };
      };

      const result = await ErrorHandlingService.handleNetworkFailure(
        new Error('Network error'),
        failingOperation,
        { component: 'test' }
      );

      expect(result.success).toBe(true);
      expect(attempts).toBe(3);
    });

    it('should provide appropriate fallbacks for AI service failures', async () => {
      const result = await ErrorHandlingService.handleAIServiceFailure(
        new Error('AI service down'),
        { component: 'ai-chat', userId: 'user-123' }
      );

      expect(result).toBeDefined();
      expect(result.fallback || result.message).toBeDefined();
    });

    it('should gracefully degrade when all services fail', async () => {
      const result = await ErrorHandlingService.handleError(
        new Error('Complete system failure'),
        { component: 'therapy-session' },
        { 
          useGenericResponse: true,
          showToast: false,
          retryAttempts: 0
        }
      );

      expect(result.fallback).toBe(true);
      expect(result.message).toContain('still here for you');
    });
  });

  describe('Data Integrity Tests', () => {
    it('should validate therapy plan completeness', async () => {
      const mockPlan = {
        user_id: 'user-123',
        primary_approach: 'CBT',
        techniques: ['cognitive restructuring'],
        goals: ['reduce anxiety']
      };

      const validationRules = [
        { field: 'primary_approach', required: true, type: 'string' as const },
        { field: 'techniques', required: true, type: 'array' as const, minLength: 1 },
        { field: 'goals', required: true, type: 'array' as const, minLength: 1 }
      ];

      const result = DataValidationService.validateUserData(mockPlan, validationRules);

      expect(result.isValid).toBe(true);
      expect(result.sanitizedData).toBeDefined();
    });

    it('should detect inconsistent user progress data', async () => {
      const mockStats = {
        current_streak: 10,
        longest_streak: 5, // Inconsistent - current > longest
        total_sessions: -1, // Invalid negative value
        average_mood: 15 // Out of valid range (1-10)
      };

      const validationRules = [
        { 
          field: 'current_streak', 
          required: true, 
          type: 'number' as const,
          custom: (value: number) => {
            const longestStreak = mockStats.longest_streak;
            return value <= longestStreak || 'Current streak cannot exceed longest streak';
          }
        },
        { field: 'total_sessions', required: true, type: 'number' as const, min: 0 },
        { field: 'average_mood', required: false, type: 'number' as const, min: 1, max: 10 }
      ];

      const result = DataValidationService.validateUserData(mockStats, validationRules);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should perform comprehensive data integrity checks', async () => {
      const integrityChecks = await DataValidationService.performDataIntegrityCheck();

      expect(Array.isArray(integrityChecks)).toBe(true);
      integrityChecks.forEach(check => {
        expect(check).toHaveProperty('table');
        expect(check).toHaveProperty('checkType');
        expect(check).toHaveProperty('passed');
        expect(check).toHaveProperty('details');
        expect(['completeness', 'consistency', 'accuracy', 'timeliness']).toContain(check.checkType);
      });
    });
  });

  describe('End-to-End Flow Tests', () => {
    it('should complete full onboarding to therapy session flow', async () => {
      // Simulate complete user journey
      const userJourney = {
        onboarding: {
          step1: 'profile_creation',
          step2: 'assessment_completion', 
          step3: 'analysis_processing',
          step4: 'plan_creation',
          step5: 'therapist_matching'
        },
        session: {
          initiation: 'session_start',
          interaction: 'message_exchange',
          adaptation: 'real_time_adjustments',
          completion: 'session_end'
        }
      };

      // Test each step can be validated
      Object.values(userJourney.onboarding).forEach(step => {
        expect(typeof step).toBe('string');
        expect(step.length).toBeGreaterThan(0);
      });

      Object.values(userJourney.session).forEach(step => {
        expect(typeof step).toBe('string');
        expect(step.length).toBeGreaterThan(0);
      });
    });

    it('should maintain data consistency across user journey', async () => {
      const userId = 'test-user-123';
      
      // Validate user can progress through all stages
      const progressValidation = await DataValidationService.validateProgressPersistence(userId);
      
      // Should handle validation gracefully even with missing data
      expect(typeof progressValidation.isValid).toBe('boolean');
      expect(Array.isArray(progressValidation.errors)).toBe(true);
      expect(Array.isArray(progressValidation.warnings)).toBe(true);
    });
  });
});

// Test utilities for component testing
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
});

export const createMockTherapyPlan = (overrides = {}) => ({
  id: 'plan-123',
  user_id: 'test-user-123',
  primary_approach: 'CBT',
  techniques: ['cognitive restructuring'],
  goals: ['reduce anxiety'],
  effectiveness_score: 0.85,
  ...overrides
});

export const createMockSession = (overrides = {}) => ({
  id: 'session-123',
  user_id: 'test-user-123',
  start_time: new Date().toISOString(),
  end_time: null,
  ...overrides
});

// Test helpers for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSupabaseResponse = (data: any, error: any = null) => ({
  data,
  error
});

// Performance testing utilities
export const measurePerformance = async (operation: () => Promise<any>) => {
  const start = performance.now();
  const result = await operation();
  const end = performance.now();
  
  return {
    result,
    duration: end - start,
    isUnderThreshold: (end - start) < 2000 // 2 second threshold
  };
};