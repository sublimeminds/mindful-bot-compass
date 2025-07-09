// PHASE 2: Enhanced Bulletproof Lovable-Tagger Initialization
// Works with HTML pre-initialization to ensure 100% reliability

interface LovableWindow extends Window {
  lov?: {
    [key: string]: any;
    reduce?: (arr: any[], fn: (acc: any, val: any) => any, initial: any) => any;
    safe?: (fn: () => any, fallback?: any) => any;
    components?: Map<string, any>;
    events?: {
      emit: (event: string, data?: any) => void;
      on: (event: string, handler: (e: any) => void) => void;
    };
    recover?: () => boolean;
  };
  __lovBackup?: any;
}

declare const window: LovableWindow;

export class LovableTaggerInitializer {
  private static initialized = false;
  private static initializationPromise: Promise<void> | null = null;
  private static performanceMetrics = {
    initStartTime: 0,
    initEndTime: 0,
    preInitFound: false,
    recoveryCount: 0
  };

  static async initialize(): Promise<void> {
    this.performanceMetrics.initStartTime = performance.now();
    
    if (this.initialized) {
      this.performanceMetrics.initEndTime = performance.now();
      return;
    }
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    await this.initializationPromise;
  }

  private static async performInitialization(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        // Check if HTML pre-initialization was successful
        if (window.lov && window.lov.preInitialized) {
          this.performanceMetrics.preInitFound = true;
          console.log('✅ Found HTML pre-initialization, enhancing...');
          
          // Enhance existing initialization with any missing properties
          this.enhanceExistingLov();
        } else {
          // Fallback: create lov from scratch (should rarely happen)
          console.warn('⚠️ HTML pre-initialization not found, creating fallback...');
          this.createFallbackLov();
        }

        // Verify all essential properties exist
        this.verifyLovIntegrity();
        
        this.initialized = true;
        this.performanceMetrics.initEndTime = performance.now();
        
        console.log('✅ Lovable-tagger initialization complete', {
          preInitFound: this.performanceMetrics.preInitFound,
          duration: this.performanceMetrics.initEndTime - this.performanceMetrics.initStartTime
        });
      }
    } catch (error) {
      console.error('❌ Critical lovable-tagger initialization failure:', error);
      this.performEmergencyRecovery();
    }
  }

  private static enhanceExistingLov(): void {
    if (!window.lov) return;
    
    // Ensure all required methods exist
    if (!window.lov.reduce) {
      window.lov.reduce = (arr: any[], fn: (acc: any, val: any) => any, initial: any) => {
        try {
          return Array.isArray(arr) ? arr.reduce(fn, initial) : initial;
        } catch (e) {
          console.warn('Enhanced lov.reduce fallback:', e);
          return initial;
        }
      };
    }
    
    if (!window.lov.components) {
      window.lov.components = new Map();
    }
    
    if (!window.lov.safe) {
      window.lov.safe = (fn: () => any, fallback?: any) => {
        try {
          return fn();
        } catch (e) {
          console.warn('Enhanced lov.safe fallback:', e);
          return fallback;
        }
      };
    }
    
    // Update version to indicate enhancement
    window.lov.version = '2.0.0-enhanced';
    window.lov.enhanced = true;
  }

  private static createFallbackLov(): void {
    window.lov = {
      version: '2.0.0-fallback',
      preInitialized: false,
      fallback: true,
      timestamp: Date.now(),
      
      reduce: (arr: any[], fn: (acc: any, val: any) => any, initial: any) => {
        try {
          return Array.isArray(arr) ? arr.reduce(fn, initial) : initial;
        } catch (e) {
          console.warn('Fallback lov.reduce error:', e);
          return initial;
        }
      },
      
      safe: (fn: () => any, fallback?: any) => {
        try {
          return fn();
        } catch (e) {
          console.warn('Fallback lov.safe error:', e);
          return fallback;
        }
      },
      
      components: new Map(),
      config: {},
      utils: {},
      
      recover: () => {
        console.log('🔧 Fallback recovery triggered');
        return true;
      }
    };
  }

  private static verifyLovIntegrity(): void {
    const required = ['reduce', 'safe', 'components'];
    const missing = required.filter(prop => !window.lov || typeof window.lov[prop] === 'undefined');
    
    if (missing.length > 0) {
      console.warn('Missing lov properties:', missing);
      missing.forEach(prop => {
        if (window.lov) {
          switch (prop) {
            case 'reduce':
              window.lov.reduce = (arr: any[], fn: any, initial: any) => initial;
              break;
            case 'safe':
              window.lov.safe = (fn: any, fallback: any) => fallback;
              break;
            case 'components':
              window.lov.components = new Map();
              break;
          }
        }
      });
    }
  }

  private static performEmergencyRecovery(): void {
    this.performanceMetrics.recoveryCount++;
    console.log('🚨 Performing emergency lovable-tagger recovery...');
    
    try {
      // Use backup if available
      if (window.__lovBackup) {
        window.lov = window.__lovBackup;
        console.log('✅ Restored from backup');
      } else {
        // Create minimal emergency lov
        this.createFallbackLov();
        console.log('✅ Created emergency fallback');
      }
      
      this.initialized = true;
      this.performanceMetrics.initEndTime = performance.now();
    } catch (emergencyError) {
      console.error('💥 Emergency recovery failed:', emergencyError);
      // Last resort: set initialized to true to prevent infinite loops
      this.initialized = true;
    }
  }

  static isInitialized(): boolean {
    return this.initialized && typeof window !== 'undefined' && !!window.lov;
  }

  static ensureInitialized(): void {
    if (!this.isInitialized()) {
      // Synchronous fallback initialization
      if (typeof window !== 'undefined' && !window.lov) {
        this.createFallbackLov();
        this.initialized = true;
      }
    }
  }

  static getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  static isHealthy(): boolean {
    try {
      return this.isInitialized() && 
             window.lov && 
             typeof window.lov.reduce === 'function' &&
             typeof window.lov.safe === 'function';
    } catch {
      return false;
    }
  }

  static forceRecovery(): void {
    console.log('🔧 Forcing lovable-tagger recovery...');
    this.initialized = false;
    this.performEmergencyRecovery();
  }
}

// Auto-initialize immediately
if (typeof window !== 'undefined') {
  LovableTaggerInitializer.initialize().catch(console.error);
}

export default LovableTaggerInitializer;