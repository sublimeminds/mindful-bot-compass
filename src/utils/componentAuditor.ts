import React from 'react';

// Component Auditor - identifies components with unsafe hook usage
export interface ComponentAuditResult {
  componentName: string;
  filePath: string;
  issues: ComponentIssue[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface ComponentIssue {
  type: 'unsafe-hook-timing' | 'conditional-hook' | 'hook-in-callback' | 'missing-error-boundary';
  line?: number;
  description: string;
  severity: 'warning' | 'error';
}

class ComponentAuditor {
  private static instance: ComponentAuditor;
  private auditResults: Map<string, ComponentAuditResult> = new Map();
  private monitoringEnabled = process.env.NODE_ENV === 'development';

  static getInstance(): ComponentAuditor {
    if (!ComponentAuditor.instance) {
      ComponentAuditor.instance = new ComponentAuditor();
    }
    return ComponentAuditor.instance;
  }

  // Runtime hook usage monitor
  monitorHookUsage(componentName: string, hookName: string, stackTrace?: string): void {
    if (!this.monitoringEnabled) return;

    try {
      // Check if hook is called at component root level
      const isRootLevel = this.isHookCalledAtRootLevel(stackTrace);
      const isConditional = this.isHookConditional(stackTrace);

      if (!isRootLevel || isConditional) {
        this.recordIssue(componentName, {
          type: 'unsafe-hook-timing',
          description: `${hookName} called ${!isRootLevel ? 'not at root level' : 'conditionally'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.warn('ComponentAuditor: Error monitoring hook usage:', error);
    }
  }

  private isHookCalledAtRootLevel(stackTrace?: string): boolean {
    if (!stackTrace) return true; // Assume safe if no stack trace
    
    // Simple heuristic: check if hook is in a callback, effect, or conditional
    const unsafePatterns = [
      'useEffect',
      'useCallback',
      'useMemo',
      'setTimeout',
      'setInterval',
      'Promise',
      'addEventListener'
    ];
    
    return !unsafePatterns.some(pattern => stackTrace.includes(pattern));
  }

  private isHookConditional(stackTrace?: string): boolean {
    if (!stackTrace) return false;
    
    const conditionalPatterns = ['if (', 'switch (', '? ', '&&', '||'];
    return conditionalPatterns.some(pattern => stackTrace.includes(pattern));
  }

  private recordIssue(componentName: string, issue: ComponentIssue): void {
    const existing = this.auditResults.get(componentName) || {
      componentName,
      filePath: 'unknown',
      issues: [],
      riskLevel: 'low' as const,
      recommendations: []
    };

    existing.issues.push(issue);
    existing.riskLevel = this.calculateRiskLevel(existing.issues);
    existing.recommendations = this.generateRecommendations(existing.issues);

    this.auditResults.set(componentName, existing);
  }

  private calculateRiskLevel(issues: ComponentIssue[]): 'low' | 'medium' | 'high' {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    if (errorCount > 2) return 'high';
    if (errorCount > 0 || warningCount > 3) return 'medium';
    return 'low';
  }

  private generateRecommendations(issues: ComponentIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(i => i.type));

    if (issueTypes.has('unsafe-hook-timing')) {
      recommendations.push('Move hooks to component root level');
      recommendations.push('Use safeUseState/safeUseEffect wrappers');
      recommendations.push('Consider progressive enhancement pattern');
    }

    if (issueTypes.has('conditional-hook')) {
      recommendations.push('Remove conditional hook calls');
      recommendations.push('Use hook values conditionally, not hooks themselves');
    }

    if (issueTypes.has('missing-error-boundary')) {
      recommendations.push('Wrap component in SafeErrorBoundary');
      recommendations.push('Add fallback UI for hook failures');
    }

    return recommendations;
  }

  // Public API
  getAuditResults(): ComponentAuditResult[] {
    return Array.from(this.auditResults.values());
  }

  getComponentAudit(componentName: string): ComponentAuditResult | undefined {
    return this.auditResults.get(componentName);
  }

  getHighRiskComponents(): ComponentAuditResult[] {
    return this.getAuditResults().filter(result => result.riskLevel === 'high');
  }

  clearAuditResults(): void {
    this.auditResults.clear();
  }

  enableMonitoring(enabled: boolean = true): void {
    this.monitoringEnabled = enabled;
  }

  // Generate audit report
  generateReport(): string {
    const results = this.getAuditResults();
    const highRisk = results.filter(r => r.riskLevel === 'high');
    const mediumRisk = results.filter(r => r.riskLevel === 'medium');
    
    let report = '=== Component Audit Report ===\n\n';
    report += `Total Components Audited: ${results.length}\n`;
    report += `High Risk: ${highRisk.length}\n`;
    report += `Medium Risk: ${mediumRisk.length}\n`;
    report += `Low Risk: ${results.length - highRisk.length - mediumRisk.length}\n\n`;

    if (highRisk.length > 0) {
      report += '=== HIGH RISK COMPONENTS ===\n';
      highRisk.forEach(component => {
        report += `\n${component.componentName}:\n`;
        component.issues.forEach(issue => {
          report += `  - ${issue.description}\n`;
        });
        report += `  Recommendations:\n`;
        component.recommendations.forEach(rec => {
          report += `    • ${rec}\n`;
        });
      });
    }

    return report;
  }
}

// Singleton instance
export const componentAuditor = ComponentAuditor.getInstance();

// Hook wrapper that reports usage
export const withAuditedHooks = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    // Monitor hook usage in this component
    React.useEffect(() => {
      componentAuditor.monitorHookUsage(componentName, 'useEffect', new Error().stack);
    }, []);

    try {
      const componentProps = { ...props } as P;
      return React.createElement(Component, componentProps);
    } catch (error) {
      componentAuditor.monitorHookUsage(componentName, 'render-error', (error as Error).stack);
      throw error;
    }
  });
};

export default componentAuditor;