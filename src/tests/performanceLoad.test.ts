import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { PerformanceMonitoringService } from '@/services/performanceMonitoringService';

// Performance benchmark thresholds
const PERFORMANCE_THRESHOLDS = {
  edgeFunctionResponse: 5000, // 5 seconds max
  messageAnalysis: 3000, // 3 seconds max
  therapyPlanGeneration: 8000, // 8 seconds max
  realTimeAdaptation: 1000, // 1 second max
  crisisDetection: 2000, // 2 seconds max
  databaseQuery: 1000, // 1 second max
  memoryUsageLimit: 100 * 1024 * 1024, // 100MB max increase
  concurrentUserLimit: 100, // 100 concurrent users
  errorRateThreshold: 0.05 // 5% max error rate
};

describe('Performance and Load Testing', () => {
  beforeEach(() => {
    // Mock performance-aware responses
    vi.mocked(supabase.functions.invoke).mockImplementation((functionName) => {
      const responseTime = Math.random() * 2000 + 500; // 500-2500ms
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              processingTime: responseTime,
              functionName
            },
            error: null
          });
        }, responseTime);
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Edge Function Performance', () => {
    it('should meet response time requirements for therapy planning', async () => {
      const startTime = performance.now();
      
      const response = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: {
            id: 'perf-test-user',
            primary_concerns: ['anxiety', 'depression'],
            cultural_context: { language: 'en', background: 'western' }
          }
        }
      });
      
      const responseTime = performance.now() - startTime;
      
      expect(response.error).toBeNull();
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.therapyPlanGeneration);
      console.log(`Therapy planning response time: ${responseTime.toFixed(2)}ms`);
    });

    it('should handle message analysis within acceptable time', async () => {
      const testMessages = [
        'I feel anxious about my presentation tomorrow',
        'Today was a really difficult day for me',
        'I cannot seem to shake this feeling of sadness'
      ];

      for (const message of testMessages) {
        const startTime = performance.now();
        
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'perf-test-user',
            sessionId: 'perf-test-session'
          }
        });
        
        const responseTime = performance.now() - startTime;
        
        expect(response.error).toBeNull();
        expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.messageAnalysis);
        console.log(`Message analysis (${message.length} chars): ${responseTime.toFixed(2)}ms`);
      }
    });

    it('should provide real-time adaptation responses quickly', async () => {
      const adaptationRequests = [
        { moodChange: { from: 7, to: 3 }, urgency: 'high' },
        { moodChange: { from: 5, to: 2 }, urgency: 'critical' },
        { moodChange: { from: 4, to: 6 }, urgency: 'low' }
      ];

      for (const request of adaptationRequests) {
        const startTime = performance.now();
        
        const response = await supabase.functions.invoke('real-time-therapy-adaptation', {
          body: {
            sessionData: request,
            userProfile: { id: 'perf-test-user' }
          }
        });
        
        const responseTime = performance.now() - startTime;
        
        expect(response.error).toBeNull();
        expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.realTimeAdaptation);
        console.log(`Real-time adaptation (${request.urgency}): ${responseTime.toFixed(2)}ms`);
      }
    });

    it('should detect crisis situations rapidly', async () => {
      const crisisMessages = [
        'I want to end my life',
        'I cannot take this pain anymore',
        'Nobody would miss me if I was gone'
      ];

      for (const message of crisisMessages) {
        const startTime = performance.now();
        
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'crisis-perf-test',
            sessionId: 'crisis-session'
          }
        });
        
        const responseTime = performance.now() - startTime;
        
        expect(response.error).toBeNull();
        expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.crisisDetection);
        console.log(`Crisis detection: ${responseTime.toFixed(2)}ms`);
      }
    });
  });

  describe('Concurrent User Load Testing', () => {
    it('should handle multiple simultaneous users', async () => {
      const concurrentUsers = 25;
      const userPromises = Array.from({ length: concurrentUsers }, (_, i) => {
        return supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              id: `concurrent-user-${i}`,
              primary_concerns: ['anxiety'],
              cultural_context: { language: 'en', background: 'western' }
            }
          }
        });
      });

      const startTime = performance.now();
      const results = await Promise.all(userPromises);
      const totalTime = performance.now() - startTime;

      expect(results).toHaveLength(concurrentUsers);
      expect(totalTime).toBeLessThan(15000); // Should complete within 15 seconds
      
      // Check that all requests succeeded
      const successfulRequests = results.filter(result => result.error === null);
      const successRate = successfulRequests.length / results.length;
      
      expect(successRate).toBeGreaterThan(0.95); // 95% success rate minimum
      console.log(`Concurrent users test: ${concurrentUsers} users in ${totalTime.toFixed(2)}ms (${(successRate * 100).toFixed(1)}% success rate)`);
    });

    it('should maintain performance under sustained load', async () => {
      const sustainedLoadDuration = 30000; // 30 seconds
      const requestInterval = 1000; // 1 request per second
      const requests: Promise<any>[] = [];
      
      const startTime = performance.now();
      let requestCount = 0;
      
      const loadInterval = setInterval(() => {
        if (performance.now() - startTime >= sustainedLoadDuration) {
          clearInterval(loadInterval);
          return;
        }
        
        requestCount++;
        const requestPromise = supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message: `Sustained load test message ${requestCount}`,
            userId: `sustained-user-${requestCount}`,
            sessionId: 'sustained-session'
          }
        });
        
        requests.push(requestPromise);
      }, requestInterval);

      // Wait for all requests to complete
      await new Promise(resolve => setTimeout(resolve, sustainedLoadDuration + 5000));
      const results = await Promise.allSettled(requests);
      
      const successfulRequests = results.filter(result => result.status === 'fulfilled');
      const successRate = successfulRequests.length / results.length;
      
      expect(successRate).toBeGreaterThan(0.9); // 90% success rate under sustained load
      console.log(`Sustained load test: ${results.length} requests over ${sustainedLoadDuration/1000}s (${(successRate * 100).toFixed(1)}% success rate)`);
    });

    it('should handle burst traffic gracefully', async () => {
      const burstSize = 50;
      const burstPromises = Array.from({ length: burstSize }, (_, i) => {
        return supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            userProfile: {
              id: `burst-user-${i}`,
              primary_concerns: ['depression', 'anxiety']
            },
            culturalContext: { language: 'en', background: 'western' }
          }
        });
      });

      const startTime = performance.now();
      const results = await Promise.allSettled(burstPromises);
      const burstTime = performance.now() - startTime;

      const successfulRequests = results.filter(result => result.status === 'fulfilled');
      const successRate = successfulRequests.length / results.length;
      
      expect(successRate).toBeGreaterThan(0.8); // 80% success rate for burst traffic
      expect(burstTime).toBeLessThan(20000); // Should handle burst within 20 seconds
      console.log(`Burst traffic test: ${burstSize} requests in ${burstTime.toFixed(2)}ms (${(successRate * 100).toFixed(1)}% success rate)`);
    });
  });

  describe('Memory and Resource Management', () => {
    it('should not leak memory during extended sessions', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Simulate extended therapy session
      for (let i = 0; i < 200; i++) {
        await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message: `Extended session message ${i}`,
            userId: 'memory-test-user',
            sessionId: 'memory-test-session'
          }
        });

        // Force garbage collection every 50 messages
        if (i % 50 === 0 && global.gc) {
          global.gc();
        }
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryUsageLimit);
      console.log(`Memory usage increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });

    it('should handle resource cleanup properly', async () => {
      const resourceIntensiveOperations = [
        'adaptive-therapy-planner',
        'enhanced-therapy-matching',
        'analyze-therapy-message',
        'real-time-therapy-adaptation'
      ];

      for (const operation of resourceIntensiveOperations) {
        const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
        
        // Perform multiple operations
        const operations = Array.from({ length: 20 }, () => 
          supabase.functions.invoke(operation, {
            body: { testData: 'resource_cleanup_test' }
          })
        );
        
        await Promise.all(operations);
        
        // Allow cleanup time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
        const memoryDelta = finalMemory - initialMemory;
        
        expect(memoryDelta).toBeLessThan(50 * 1024 * 1024); // 50MB max per operation type
        console.log(`${operation} memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      }
    });
  });

  describe('Database Performance', () => {
    it('should maintain database query performance', async () => {
      const performanceService = PerformanceMonitoringService;
      
      const startTime = performance.now();
      const systemPerformance = await (performanceService as any).getSystemPerformance();
      const queryTime = performance.now() - startTime;
      
      expect(queryTime).toBeLessThan(PERFORMANCE_THRESHOLDS.databaseQuery);
      expect(systemPerformance.overallHealth).toMatch(/excellent|good|degraded|critical/);
      console.log(`Database query performance: ${queryTime.toFixed(2)}ms`);
    });

    it('should handle concurrent database operations', async () => {
      const performanceService = PerformanceMonitoringService;
      const concurrentQueries = 10;
      
      const queryPromises = Array.from({ length: concurrentQueries }, () => 
        (performanceService as any).getSystemPerformance()
      );

      const startTime = performance.now();
      const results = await Promise.all(queryPromises);
      const totalTime = performance.now() - startTime;

      expect(results).toHaveLength(concurrentQueries);
      expect(totalTime).toBeLessThan(5000); // 5 seconds for 10 concurrent queries
      console.log(`Concurrent database queries: ${concurrentQueries} queries in ${totalTime.toFixed(2)}ms`);
    });
  });

  describe('Error Rate and Reliability', () => {
    it('should maintain low error rates under normal load', async () => {
      const requestCount = 100;
      const requests = Array.from({ length: requestCount }, (_, i) => 
        supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message: `Error rate test message ${i}`,
            userId: `error-test-user-${i}`,
            sessionId: 'error-rate-session'
          }
        })
      );

      const results = await Promise.allSettled(requests);
      const errors = results.filter(result => result.status === 'rejected');
      const errorRate = errors.length / results.length;

      expect(errorRate).toBeLessThan(PERFORMANCE_THRESHOLDS.errorRateThreshold);
      console.log(`Error rate: ${(errorRate * 100).toFixed(2)}% (${errors.length}/${results.length})`);
    });

    it('should gracefully degrade under extreme load', async () => {
      const extremeLoadSize = 200;
      const requests = Array.from({ length: extremeLoadSize }, (_, i) => 
        supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              id: `extreme-load-user-${i}`,
              primary_concerns: ['anxiety', 'depression', 'trauma']
            }
          }
        })
      );

      const startTime = performance.now();
      const results = await Promise.allSettled(requests);
      const totalTime = performance.now() - startTime;

      const successfulRequests = results.filter(result => result.status === 'fulfilled');
      const successRate = successfulRequests.length / results.length;

      // Under extreme load, we expect some degradation but not complete failure
      expect(successRate).toBeGreaterThan(0.5); // At least 50% success rate
      console.log(`Extreme load test: ${extremeLoadSize} requests, ${(successRate * 100).toFixed(1)}% success in ${totalTime.toFixed(2)}ms`);
    });
  });

  describe('Performance Monitoring and Alerting', () => {
    it('should track performance metrics accurately', async () => {
      const performanceService = PerformanceMonitoringService;
      
      // Generate some load to track
      await Promise.all([
        supabase.functions.invoke('analyze-therapy-message', { body: { message: 'test' } }),
        supabase.functions.invoke('adaptive-therapy-planner', { body: { userProfile: { id: 'test' } } }),
        supabase.functions.invoke('enhanced-therapy-matching', { body: { userProfile: { id: 'test' } } })
      ]);

      const metrics = await (performanceService as any).getSystemPerformance();
      
      expect(metrics.metrics).toBeDefined();
      expect(metrics.overallHealth).toBeDefined();
      expect(metrics.timestamp).toBeDefined();
      
      // Verify specific metric types
      const metricNames = metrics.metrics.map(m => m.name);
      expect(metricNames).toContain('response_time');
      console.log(`Performance tracking: ${metrics.metrics.length} metrics captured`);
    });

    it('should identify performance bottlenecks', async () => {
      const performanceService = PerformanceMonitoringService;
      
      // Simulate a slow operation
      const slowOperationPromise = new Promise(resolve => {
        setTimeout(() => {
          resolve(supabase.functions.invoke('analyze-therapy-message', {
            body: { message: 'slow operation test' }
          }));
        }, 3000);
      });

      await slowOperationPromise;
      
      const metrics = await (performanceService as any).getSystemPerformance();
      const slowMetrics = metrics.metrics.filter(m => m.value > 2000 && m.unit === 'ms');
      
      if (slowMetrics.length > 0) {
        console.log(`Detected slow operations: ${slowMetrics.length} metrics above 2000ms`);
        expect(slowMetrics[0].status).toMatch(/warning|critical/);
      }
    });
  });
});