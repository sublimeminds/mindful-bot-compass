/**
 * Lovable Tagger Safe Guard - Ensures window.lov is always stable
 * Fixes the persistent "lov" error that has been crashing 3D avatars
 */

interface LovObject {
  initialized: boolean;
  tagger: any;
  config: any;
  utils: any;
  error?: string;
  safeGuardActive?: boolean;
}

class LovableTaggerSafeGuard {
  private lastKnownGoodState: LovObject | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private recoveryAttempts = 0;
  private maxRecoveryAttempts = 3;

  constructor() {
    this.initialize();
  }

  private initialize() {
    console.log('🛡️ LovableTagger SafeGuard: Initializing protection');
    
    // Create persistent lov object
    this.ensureLovExists();
    
    // Start health monitoring
    this.startHealthCheck();
    
    // Setup property protection
    this.setupPropertyProtection();
    
    console.log('✅ LovableTagger SafeGuard: Protection activated');
  }

  private ensureLovExists() {
    if (typeof window === 'undefined') return;

    const lovObject: LovObject = {
      initialized: false,
      tagger: null,
      config: null,
      utils: null,
      safeGuardActive: true
    };

    // Create or restore lov object
    if (!(window as any).lov) {
      (window as any).lov = lovObject;
      console.log('🔧 LovableTagger SafeGuard: Created new lov object');
    } else {
      // Ensure all required properties exist
      Object.keys(lovObject).forEach(key => {
        if ((window as any).lov[key] === undefined) {
          (window as any).lov[key] = lovObject[key as keyof LovObject];
        }
      });
      (window as any).lov.safeGuardActive = true;
    }

    // Store good state
    this.lastKnownGoodState = { ...(window as any).lov };
  }

  private setupPropertyProtection() {
    if (typeof window === 'undefined') return;

    // Create a proxy to protect window.lov from being deleted or corrupted
    const originalLov = (window as any).lov;
    
    (window as any).lov = new Proxy(originalLov, {
      get: (target, prop) => {
        // Always return a safe value
        if (target[prop] === undefined && this.lastKnownGoodState) {
          console.warn(`🚨 LovableTagger SafeGuard: Property ${String(prop)} was undefined, using safe fallback`);
          return this.lastKnownGoodState[prop as keyof LovObject];
        }
        return target[prop];
      },
      
      set: (target, prop, value) => {
        target[prop] = value;
        // Update our known good state
        if (this.lastKnownGoodState && prop in this.lastKnownGoodState) {
          (this.lastKnownGoodState as any)[prop] = value;
        }
        return true;
      },
      
      deleteProperty: (target, prop) => {
        console.warn(`🚨 LovableTagger SafeGuard: Prevented deletion of property ${String(prop)}`);
        return false; // Prevent deletion
      }
    });

    console.log('🛡️ LovableTagger SafeGuard: Property protection enabled');
  }

  private startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 10000); // Check every 10 seconds

    console.log('💊 LovableTagger SafeGuard: Health monitoring started');
  }

  private performHealthCheck() {
    if (typeof window === 'undefined') return;

    try {
      const lov = (window as any).lov;
      
      // Check if lov object exists and has required structure
      if (!lov || typeof lov !== 'object') {
        console.error('🚨 LovableTagger SafeGuard: lov object corrupted or missing');
        this.performRecovery();
        return;
      }

      // Check required properties
      const requiredProps = ['initialized', 'tagger', 'config', 'utils'];
      const missingProps = requiredProps.filter(prop => lov[prop] === undefined);
      
      if (missingProps.length > 0) {
        console.warn(`🚨 LovableTagger SafeGuard: Missing properties: ${missingProps.join(', ')}`);
        this.performRecovery();
        return;
      }

      // Reset recovery attempts on successful check
      this.recoveryAttempts = 0;
      
    } catch (error) {
      console.error('🚨 LovableTagger SafeGuard: Health check failed:', error);
      this.performRecovery();
    }
  }

  private performRecovery() {
    if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
      console.error('🚨 LovableTagger SafeGuard: Max recovery attempts reached, disabling auto-recovery');
      return;
    }

    this.recoveryAttempts++;
    console.log(`🔄 LovableTagger SafeGuard: Performing recovery attempt ${this.recoveryAttempts}/${this.maxRecoveryAttempts}`);

    try {
      // Restore from last known good state
      if (this.lastKnownGoodState) {
        (window as any).lov = { ...this.lastKnownGoodState };
        console.log('✅ LovableTagger SafeGuard: Successfully restored lov object');
      } else {
        // Create fresh lov object
        this.ensureLovExists();
        console.log('✅ LovableTagger SafeGuard: Created fresh lov object');
      }
    } catch (error) {
      console.error('❌ LovableTagger SafeGuard: Recovery failed:', error);
    }
  }

  public getStatus() {
    return {
      isActive: true,
      recoveryAttempts: this.recoveryAttempts,
      maxRecoveryAttempts: this.maxRecoveryAttempts,
      lastKnownGoodState: this.lastKnownGoodState,
      currentLovState: typeof window !== 'undefined' ? (window as any).lov : null
    };
  }

  public forceRecovery() {
    console.log('🔧 LovableTagger SafeGuard: Manual recovery triggered');
    this.recoveryAttempts = 0; // Reset attempts for manual recovery
    this.performRecovery();
  }

  public destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    console.log('🛡️ LovableTagger SafeGuard: Destroyed');
  }
}

// Create global instance
const lovableTaggerSafeGuard = new LovableTaggerSafeGuard();

// Export for debugging and manual control
export { lovableTaggerSafeGuard };

// Helper function to ensure safe access to lov properties
export const safeLovAccess = (callback: () => any, fallback: any = null) => {
  try {
    if (typeof window === 'undefined' || !(window as any).lov) {
      return fallback;
    }
    return callback();
  } catch (error) {
    console.warn('🚨 LovableTagger SafeGuard: Safe access caught error:', error);
    lovableTaggerSafeGuard.forceRecovery();
    return fallback;
  }
};

// Helper to check if lov is healthy
export const isLovHealthy = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const lov = (window as any).lov;
    return lov && 
           typeof lov === 'object' && 
           lov.hasOwnProperty('initialized') &&
           lov.hasOwnProperty('tagger') &&
           lov.hasOwnProperty('config') &&
           lov.hasOwnProperty('utils');
  } catch {
    return false;
  }
};