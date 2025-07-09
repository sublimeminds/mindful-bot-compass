import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  initializeLovableTagger, 
  validateLovableTagger, 
  getLovableProperty, 
  resetLovableTagger 
} from '@/utils/lovableTaggerFix';

describe('Lovable Tagger Fix Tests', () => {
  beforeEach(() => {
    // Reset window object before each test
    delete (window as any).lov;
  });

  it('should initialize lovable-tagger properly', () => {
    const result = initializeLovableTagger();
    
    expect(result).toBe(true);
    expect((window as any).lov).toBeDefined();
    expect((window as any).lov.initialized).toBe(true);
    expect((window as any).lov.tagger).toBeDefined();
    expect((window as any).lov.config).toBeDefined();
    expect((window as any).lov.utils).toBeDefined();
  });

  it('should validate initialization correctly', () => {
    // Should fail when not initialized
    expect(validateLovableTagger()).toBe(false);
    
    // Should pass after initialization
    initializeLovableTagger();
    expect(validateLovableTagger()).toBe(true);
  });

  it('should get properties safely', () => {
    initializeLovableTagger();
    
    // Should return undefined for non-existent properties
    expect(getLovableProperty('nonexistent')).toBeUndefined();
    
    // Should return existing properties
    expect(getLovableProperty('tagger')).toBeDefined();
    expect(getLovableProperty('config')).toBeDefined();
  });

  it('should reset and reinitialize', () => {
    initializeLovableTagger();
    (window as any).lov.customProperty = 'test';
    
    resetLovableTagger();
    
    expect((window as any).lov.customProperty).toBeUndefined();
    expect(validateLovableTagger()).toBe(true);
  });

  it('should handle multiple initialization calls safely', () => {
    const result1 = initializeLovableTagger();
    const result2 = initializeLovableTagger();
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(validateLovableTagger()).toBe(true);
  });

  it('should prevent the original error condition', () => {
    initializeLovableTagger();
    
    // This should not throw now
    expect(() => {
      const lovObj = (window as any).lov;
      if (lovObj && lovObj.tagger) {
        // Simulating potential lovable-tagger access patterns
        const config = lovObj.config.someProperty || 'default';
        console.log('Config access successful:', config);
      }
    }).not.toThrow();
  });
});