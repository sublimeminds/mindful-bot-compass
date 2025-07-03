/**
 * Self-Healing System - Automated issue prevention and predictive recovery
 */

import { recoveryAnalytics } from './recoveryAnalytics';
import { enhancedRecoveryChain } from './enhancedRecoveryChain';

interface HealthPattern {
  pattern: string;
  threshold: number;
  action: () => Promise<void>;
  lastTriggered: number;
  cooldownPeriod: number;
}

class SelfHealingSystem {
  private patterns: HealthPattern[] = [
    {
      pattern: 'router_context_missing',
      threshold: 0.1,
      action: async () => {
        console.log('SelfHealing: Router context issue detected, attempting fix...');
        // Clear router cache and reinitialize
        if ('__webpack_require__' in window) {
          const cache = (window as any).__webpack_require__.cache;
          Object.keys(cache).forEach(key => {
            if (key.includes('react-router')) {
              delete cache[key];
            }
          });
        }
        await enhancedRecoveryChain.attemptCurrentLevel();
      },
      lastTriggered: 0,
      cooldownPeriod: 30000
    },
    {
      pattern: 'memory_leak',
      threshold: 0.8,
      action: async () => {
        console.log('SelfHealing: Memory leak detected, cleaning up...');
        if (window.gc) window.gc();
        
        // Trigger recovery to minimal mode
        enhancedRecoveryChain.escalate();
        await enhancedRecoveryChain.attemptCurrentLevel();
      },
      lastTriggered: 0,
      cooldownPeriod: 60000
    }
  ];

  private monitoringInterval?: number;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    this.monitoringInterval = window.setInterval(() => {
      this.checkHealthPatterns();
    }, 5000);

    // Listen for runtime errors
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handleError.bind(this));
  }

  private async checkHealthPatterns(): Promise<void> {
    const now = Date.now();
    
    for (const pattern of this.patterns) {
      if (now - pattern.lastTriggered < pattern.cooldownPeriod) continue;
      
      const shouldTrigger = await this.evaluatePattern(pattern);
      if (shouldTrigger) {
        pattern.lastTriggered = now;
        try {
          await pattern.action();
          recoveryAnalytics.recordEvent('auto_fix', { 
            level: 'self_healing', 
            strategy: pattern.pattern 
          });
        } catch (error) {
          console.error(`SelfHealing: Pattern ${pattern.pattern} failed:`, error);
        }
      }
    }
  }

  private async evaluatePattern(pattern: HealthPattern): Promise<boolean> {
    switch (pattern.pattern) {
      case 'router_context_missing':
        return this.detectRouterIssues();
      case 'memory_leak':
        return this.detectMemoryLeaks();
      default:
        return false;
    }
  }

  private detectRouterIssues(): boolean {
    // Check for router context errors
    const events = recoveryAnalytics.getRecentEvents(10);
    const routerErrors = events.filter(e => 
      e.errorMessage?.includes('useContext') || 
      e.errorMessage?.includes('router')
    );
    return routerErrors.length > 0;
  }

  private detectMemoryLeaks(): boolean {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;
      return usageRatio > 0.8;
    }
    return false;
  }

  private handleError(event: any): void {
    const error = event.error || event.reason;
    if (error?.message?.includes('useContext')) {
      // Router context error detected
      this.triggerRouterFix();
    }
  }

  private async triggerRouterFix(): Promise<void> {
    console.log('SelfHealing: Immediate router fix triggered');
    try {
      await this.patterns[0].action();
    } catch (error) {
      console.error('SelfHealing: Router fix failed:', error);
    }
  }

  cleanup(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleError);
  }
}

export const selfHealingSystem = new SelfHealingSystem();