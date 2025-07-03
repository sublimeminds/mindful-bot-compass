/**
 * Enhanced Recovery Chain - Multiple recovery levels with intelligent fallback
 */

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
      errorTypes: ['import', 'network', 'timeout']
    },
    {
      name: 'minimal',
      component: () => import('@/components/AppInitializer').then(m => m.default),
      priority: 2,
      errorTypes: ['dependency', 'auth', 'routing']
    },
    {
      name: 'smart',
      component: () => import('@/components/SmartRecoveryMode').then(m => m.default),
      priority: 3,
      errorTypes: ['component', 'render', 'runtime']
    },
    {
      name: 'safe',
      component: () => import('@/components/SafeMinimalApp').then(m => m.default),
      priority: 4,
      errorTypes: ['critical', 'complete']
    }
  ];

  private state: RecoveryChainState = {
    currentLevel: 0,
    attempts: {},
    errors: {}
  };

  /**
   * Attempt recovery at current level
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