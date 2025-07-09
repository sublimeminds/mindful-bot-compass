/**
 * Comprehensive Lovable Tagger Fix Utility
 * Prevents "Cannot read properties of undefined (reading 'lov')" errors
 */

export interface LovableConfig {
  tagger?: Record<string, any>;
  config?: Record<string, any>;
  utils?: Record<string, any>;
  initialized?: boolean;
  preInitialized?: boolean;
  runtimeInitialized?: boolean;
  timestamp?: number;
  runtimeTimestamp?: number;
  failed?: boolean;
  error?: string;
  safe?: (fn: () => any) => any;
}

declare global {
  interface Window {
    lov?: LovableConfig;
  }
}

/**
 * Initialize the lovable-tagger environment safely
 * Now supports both pre-initialization and runtime initialization
 */
export const initializeLovableTagger = (): boolean => {
  try {
    if (typeof window === 'undefined') {
      console.warn('Window object not available - server-side environment detected');
      return false;
    }

    // Check if already pre-initialized in HTML
    if (window.lov && window.lov.preInitialized) {
      console.log('✅ Lovable tagger pre-initialized from HTML');
      // Enhance the existing object if needed
      const lovObj = window.lov as LovableConfig;
      if (!lovObj.runtimeInitialized) {
        lovObj.runtimeInitialized = true;
        lovObj.runtimeTimestamp = Date.now();
      }
      return true;
    }

    // Check if already initialized by runtime
    if (window.lov && window.lov.initialized) {
      console.log('✅ Lovable tagger already runtime initialized');
      return true;
    }

    // Create the base lov object (fallback if HTML pre-init failed)
    if (!window.lov) {
      Object.defineProperty(window, 'lov', {
        value: {} as LovableConfig,
        writable: true,
        configurable: true,
        enumerable: false
      });
    }

    const lovObj = window.lov as LovableConfig;

    // Initialize required properties
    if (!lovObj.tagger) lovObj.tagger = {};
    if (!lovObj.config) lovObj.config = {};
    if (!lovObj.utils) lovObj.utils = {};
    
    // Mark as initialized
    lovObj.initialized = true;
    lovObj.runtimeInitialized = true;
    lovObj.runtimeTimestamp = Date.now();

    console.log('✅ Lovable tagger runtime initialized successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to initialize lovable tagger:', error);
    
    // Last resort fallback
    try {
      if (typeof window !== 'undefined') {
        (window as any).lov = { 
          initialized: false, 
          failed: true, 
          error: error.message 
        };
      }
    } catch (fallbackError) {
      console.error('💥 Critical: Fallback initialization failed:', fallbackError);
    }
    
    return false;
  }
};

/**
 * Validate that lovable-tagger is properly initialized
 */
export const validateLovableTagger = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    return !!(
      window.lov &&
      typeof window.lov === 'object' &&
      window.lov.initialized === true
    );
  } catch (error) {
    console.error('Lovable tagger validation failed:', error);
    return false;
  }
};

/**
 * Safe getter for lovable tagger properties
 */
export const getLovableProperty = (path: string): any => {
  try {
    if (!validateLovableTagger()) return undefined;
    
    const keys = path.split('.');
    let current: any = window.lov;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  } catch (error) {
    console.error(`Failed to get lovable property "${path}":`, error);
    return undefined;
  }
};

/**
 * Emergency reset function for lovable-tagger
 */
export const resetLovableTagger = (): void => {
  try {
    if (typeof window !== 'undefined') {
      delete (window as any).lov;
      initializeLovableTagger();
    }
  } catch (error) {
    console.error('Failed to reset lovable tagger:', error);
  }
};

// Auto-initialize when module loads
initializeLovableTagger();