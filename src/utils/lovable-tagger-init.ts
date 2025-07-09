// Bulletproof Lovable-Tagger Initialization
// This ensures window.lov is always available before any component renders

interface LovableWindow extends Window {
  lov?: {
    [key: string]: any;
  };
}

declare const window: LovableWindow;

export class LovableTaggerInitializer {
  private static initialized = false;
  private static initializationPromise: Promise<void> | null = null;

  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    await this.initializationPromise;
  }

  private static async performInitialization(): Promise<void> {
    try {
      // Ensure window.lov exists
      if (typeof window !== 'undefined') {
        if (!window.lov) {
          window.lov = {};
          console.log('✅ Lovable-tagger initialized successfully');
        }

        // Add any required lovable-tagger properties
        if (!window.lov.version) {
          window.lov.version = '1.0.0';
        }

        if (!window.lov.components) {
          window.lov.components = new Map();
        }

        if (!window.lov.reduce) {
          window.lov.reduce = (arr: any[], fn: (acc: any, val: any) => any, initial: any) => {
            return arr.reduce(fn, initial);
          };
        }

        this.initialized = true;
      }
    } catch (error) {
      console.error('❌ Failed to initialize lovable-tagger:', error);
      // Provide a minimal fallback
      if (typeof window !== 'undefined' && !window.lov) {
        window.lov = {
          version: '1.0.0-fallback',
          components: new Map(),
          reduce: (arr: any[], fn: (acc: any, val: any) => any, initial: any) => {
            try {
              return arr.reduce(fn, initial);
            } catch (e) {
              console.warn('Fallback reduce failed:', e);
              return initial;
            }
          }
        };
      }
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
        window.lov = {
          version: '1.0.0-sync-fallback',
          components: new Map(),
          reduce: (arr: any[], fn: (acc: any, val: any) => any, initial: any) => {
            try {
              return arr.reduce(fn, initial);
            } catch (e) {
              console.warn('Sync fallback reduce failed:', e);
              return initial;
            }
          }
        };
        this.initialized = true;
      }
    }
  }
}

// Auto-initialize immediately
if (typeof window !== 'undefined') {
  LovableTaggerInitializer.initialize().catch(console.error);
}

export default LovableTaggerInitializer;