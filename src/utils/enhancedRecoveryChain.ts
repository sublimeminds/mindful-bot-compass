/**
 * Enhanced Recovery Chain - Multiple recovery levels with intelligent fallback
 */
import { smartDiagnosticsEngine } from './smartDiagnosticsEngine';
import { autoRecoverySystem } from './autoRecoverySystem';

interface RecoveryLevel {
  name: string;
  component: () => Promise<React.ComponentType>;
  priority: number;
  errorTypes: string[];
}

interface RecoveryChainState {
  currentLevel: number;
  attempts: Record<string, number>;
  errors: Record<string, string>;
  lastSuccessful?: string;
}

class EnhancedRecoveryChain {
  private levels: RecoveryLevel[] = [
    {
      name: 'full',
      component: () => import('@/components/ProgressiveAppLoader').then(m => m.default),
      priority: 1,
      errorTypes: ['import', 'network', 'timeout', 'dependency']
    },
    {
      name: 'minimal',
      component: () => import('@/components/AppInitializer').then(m => m.default),
      priority: 2,
      errorTypes: ['auth', 'routing', 'component']
    },
    {
      name: 'smart',
      component: () => import('@/components/SmartRecoveryMode').then(m => m.default),
      priority: 3,
      errorTypes: ['render', 'runtime', 'state']
    },
    {
      name: 'safe',
      component: () => import('@/components/SafeMinimalApp').then(m => m.default),
      priority: 4,
      errorTypes: ['critical', 'complete', 'fatal']
    }
  ];

  private state: RecoveryChainState = {
    currentLevel: 0,
    attempts: {},
    errors: {}
  };

  /**
   * Attempt recovery at current level with smart diagnostics
   */
  async attemptCurrentLevel(): Promise<{ success: boolean; component?: React.ComponentType; error?: string }> {
    const level = this.levels[this.state.currentLevel];
    if (!level) {
      return { success: false, error: 'No more recovery levels available' };
    }

    const attemptKey = level.name;
    this.state.attempts[attemptKey] = (this.state.attempts[attemptKey] || 0) + 1;

    try {
      console.log(`RecoveryChain: Attempting level ${level.name} (attempt ${this.state.attempts[attemptKey]})`);
      
      // Run diagnostics before attempting recovery
      const healthStatus = await smartDiagnosticsEngine.runDiagnostics();
      console.log(`RecoveryChain: Health status for ${level.name}:`, healthStatus.overall);
      
      const component = await Promise.race([
        level.component(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Recovery timeout')), 5000)
        )
      ]);

      this.state.lastSuccessful = level.name;
      console.log(`RecoveryChain: Success at level ${level.name}`);
      return { success: true, component };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.state.errors[attemptKey] = errorMsg;
      
      console.warn(`RecoveryChain: Level ${level.name} failed:`, errorMsg);
      
      // Attempt auto-recovery before escalating
      const autoRecovered = await autoRecoverySystem.attemptRecovery(error);
      if (autoRecovered) {
        console.log(`RecoveryChain: Auto-recovery successful for ${level.name}, retrying...`);
        // Retry the current level after auto-recovery
        try {
          const component = await level.component();
          this.state.lastSuccessful = level.name;
          return { success: true, component };
        } catch (retryError) {
          console.warn(`RecoveryChain: Retry after auto-recovery failed:`, retryError);
        }
      }
      
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Move to next recovery level
   */
  escalate(): boolean {
    if (this.state.currentLevel < this.levels.length - 1) {
      this.state.currentLevel++;
      console.log(`RecoveryChain: Escalated to level ${this.levels[this.state.currentLevel].name}`);
      return true;
    }
    return false;
  }

  /**
   * Get current recovery level info
   */
  getCurrentLevel(): RecoveryLevel | null {
    return this.levels[this.state.currentLevel] || null;
  }

  /**
   * Reset to first level
   */
  reset(): void {
    this.state.currentLevel = 0;
    this.state.attempts = {};
    this.state.errors = {};
    console.log('RecoveryChain: Reset to first level');
  }

  /**
   * Get recovery status
   */
  getStatus() {
    return {
      ...this.state,
      currentLevelName: this.levels[this.state.currentLevel]?.name || 'unknown',
      totalLevels: this.levels.length
    };
  }
}

export const enhancedRecoveryChain = new EnhancedRecoveryChain();