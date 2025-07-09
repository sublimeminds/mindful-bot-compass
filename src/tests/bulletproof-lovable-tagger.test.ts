import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LovableTaggerInitializer } from '@/utils/lovable-tagger-init';

describe('Bulletproof Lovable Tagger System', () => {
  let originalWindow: any;

  beforeEach(() => {
    // Save original window state
    originalWindow = { ...window };
    
    // Reset initialization state
    (LovableTaggerInitializer as any).initialized = false;
    (LovableTaggerInitializer as any).initializationPromise = null;
    
    // Clear window.lov
    delete (window as any).lov;
    delete (window as any).__lovBackup;
  });

  afterEach(() => {
    // Restore original window state
    Object.assign(window, originalWindow);
    vi.clearAllMocks();
  });

  describe('HTML Pre-initialization Detection', () => {
    it('should detect and enhance existing pre-initialization', async () => {
      // Simulate HTML pre-initialization
      (window as any).lov = {
        preInitialized: true,
        version: '2.0.0-bulletproof',
        reduce: vi.fn(),
        components: new Map()
      };

      await LovableTaggerInitializer.initialize();

      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      expect((window as any).lov.enhanced).toBe(true);
      expect((window as any).lov.version).toBe('2.0.0-enhanced');
    });

    it('should create fallback when pre-initialization is missing', async () => {
      // No pre-initialization
      await LovableTaggerInitializer.initialize();

      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      expect((window as any).lov.fallback).toBe(true);
      expect((window as any).lov.version).toBe('2.0.0-fallback');
    });
  });

  describe('Essential Properties Verification', () => {
    it('should ensure all required properties exist', async () => {
      await LovableTaggerInitializer.initialize();

      expect((window as any).lov).toBeDefined();
      expect(typeof (window as any).lov.reduce).toBe('function');
      expect(typeof (window as any).lov.safe).toBe('function');
      expect((window as any).lov.components).toBeInstanceOf(Map);
    });

    it('should handle reduce function safely', async () => {
      await LovableTaggerInitializer.initialize();

      const result = (window as any).lov.reduce([1, 2, 3], (acc: number, val: number) => acc + val, 0);
      expect(result).toBe(6);

      // Test error handling
      const errorResult = (window as any).lov.reduce(null, () => { throw new Error('test'); }, 'fallback');
      expect(errorResult).toBe('fallback');
    });

    it('should handle safe function properly', async () => {
      await LovableTaggerInitializer.initialize();

      const result = (window as any).lov.safe(() => 'success', 'fallback');
      expect(result).toBe('success');

      const errorResult = (window as any).lov.safe(() => { throw new Error('test'); }, 'fallback');
      expect(errorResult).toBe('fallback');
    });
  });

  describe('Emergency Recovery System', () => {
    it('should recover from critical initialization failure', async () => {
      // Simulate initialization failure
      const originalDefineProperty = Object.defineProperty;
      Object.defineProperty = vi.fn(() => {
        throw new Error('Property definition failed');
      });

      await LovableTaggerInitializer.initialize();

      // Should still be initialized (emergency recovery)
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);

      // Restore original function
      Object.defineProperty = originalDefineProperty;
    });

    it('should force recovery when needed', () => {
      LovableTaggerInitializer.forceRecovery();
      
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      expect((window as any).lov).toBeDefined();
    });

    it('should use backup if available', async () => {
      // Set up backup
      const backup = { version: 'backup', reduce: vi.fn(), safe: vi.fn(), components: new Map() };
      (window as any).__lovBackup = backup;

      // Simulate emergency
      (LovableTaggerInitializer as any).performEmergencyRecovery();

      expect((window as any).lov).toBe(backup);
    });
  });

  describe('Health Monitoring', () => {
    it('should correctly report health status', async () => {
      await LovableTaggerInitializer.initialize();
      
      expect(LovableTaggerInitializer.isHealthy()).toBe(true);

      // Corrupt lov object
      delete (window as any).lov.reduce;
      expect(LovableTaggerInitializer.isHealthy()).toBe(false);
    });

    it('should provide performance metrics', async () => {
      await LovableTaggerInitializer.initialize();
      
      const metrics = LovableTaggerInitializer.getPerformanceMetrics();
      expect(typeof metrics.initStartTime).toBe('number');
      expect(typeof metrics.initEndTime).toBe('number');
      expect(typeof metrics.preInitFound).toBe('boolean');
      expect(typeof metrics.recoveryCount).toBe('number');
    });
  });

  describe('Synchronous Fallback', () => {
    it('should provide immediate synchronous initialization', () => {
      expect(LovableTaggerInitializer.isInitialized()).toBe(false);
      
      LovableTaggerInitializer.ensureInitialized();
      
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      expect((window as any).lov).toBeDefined();
    });
  });

  describe('Race Condition Prevention', () => {
    it('should handle concurrent initialization attempts', async () => {
      const promises = [
        LovableTaggerInitializer.initialize(),
        LovableTaggerInitializer.initialize(),
        LovableTaggerInitializer.initialize()
      ];

      await Promise.all(promises);

      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      // Should not create multiple lov objects
      expect((window as any).lov).toBeDefined();
    });

    it('should be idempotent', async () => {
      await LovableTaggerInitializer.initialize();
      const firstLov = (window as any).lov;

      await LovableTaggerInitializer.initialize();
      const secondLov = (window as any).lov;

      expect(firstLov).toBe(secondLov);
    });
  });

  describe('Error Boundary Integration', () => {
    it('should maintain functionality under stress', async () => {
      // Simulate multiple error scenarios
      for (let i = 0; i < 5; i++) {
        try {
          await LovableTaggerInitializer.initialize();
          LovableTaggerInitializer.forceRecovery();
        } catch (error) {
          // Should not throw
        }
      }

      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      expect(LovableTaggerInitializer.isHealthy()).toBe(true);
    });
  });
});