import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LovableTaggerInitializer } from '@/utils/lovable-tagger-init';

// Mock window object
const mockWindow = {
  lov: undefined
} as any;

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
});

describe('LovableTaggerInitializer', () => {
  beforeEach(() => {
    // Reset window.lov before each test
    mockWindow.lov = undefined;
    (LovableTaggerInitializer as any).initialized = false;
    (LovableTaggerInitializer as any).initializationPromise = null;
  });

  describe('Initialization', () => {
    it('should initialize window.lov if it does not exist', async () => {
      expect(mockWindow.lov).toBeUndefined();
      
      await LovableTaggerInitializer.initialize();
      
      expect(mockWindow.lov).toBeDefined();
      expect(mockWindow.lov.version).toBe('1.0.0');
      expect(mockWindow.lov.components).toBeInstanceOf(Map);
      expect(typeof mockWindow.lov.reduce).toBe('function');
    });

    it('should not reinitialize if already initialized', async () => {
      mockWindow.lov = { version: 'existing' };
      
      await LovableTaggerInitializer.initialize();
      
      expect(mockWindow.lov.version).toBe('existing');
    });

    it('should be idempotent when called multiple times', async () => {
      await LovableTaggerInitializer.initialize();
      const firstLov = mockWindow.lov;
      
      await LovableTaggerInitializer.initialize();
      const secondLov = mockWindow.lov;
      
      expect(firstLov).toBe(secondLov);
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should provide fallback if initialization fails', async () => {
      // Mock a failure scenario
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      // Mock window to throw error
      const errorWindow = {
        get lov() {
          throw new Error('Access denied');
        },
        set lov(value) {
          throw new Error('Access denied');
        }
      };
      Object.defineProperty(global, 'window', { value: errorWindow });
      
      await LovableTaggerInitializer.initialize();
      
      expect(console.error).toHaveBeenCalled();
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
      
      console.error = originalConsoleError;
      Object.defineProperty(global, 'window', { value: mockWindow });
    });
  });

  describe('Synchronous Fallback', () => {
    it('should provide synchronous initialization if needed', () => {
      expect(mockWindow.lov).toBeUndefined();
      
      LovableTaggerInitializer.ensureInitialized();
      
      expect(mockWindow.lov).toBeDefined();
      expect(mockWindow.lov.version).toContain('sync-fallback');
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
    });
  });

  describe('Reduce Function', () => {
    it('should provide a working reduce function', async () => {
      await LovableTaggerInitializer.initialize();
      
      const testArray = [1, 2, 3, 4];
      const sum = mockWindow.lov.reduce(
        testArray, 
        (acc: number, val: number) => acc + val, 
        0
      );
      
      expect(sum).toBe(10);
    });

    it('should handle reduce errors gracefully', async () => {
      await LovableTaggerInitializer.initialize();
      
      const result = mockWindow.lov.reduce(
        [1, 2, 3], 
        () => { throw new Error('Test error'); }, 
        'fallback'
      );
      
      expect(result).toBe('fallback');
    });
  });

  describe('Status Checking', () => {
    it('should correctly report initialization status', async () => {
      expect(LovableTaggerInitializer.isInitialized()).toBe(false);
      
      await LovableTaggerInitializer.initialize();
      
      expect(LovableTaggerInitializer.isInitialized()).toBe(true);
    });
  });
});