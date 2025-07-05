// Coding Standards for Hook Safety and Component Architecture

export const CODING_STANDARDS = {
  HOOK_SAFETY: {
    // Rules for safe hook usage
    rules: [
      'Always call hooks at the top level of React functions',
      'Never call hooks inside loops, conditions, or nested functions',
      'Use safe hook wrappers (safeUseState, safeUseEffect) for critical components',
      'Wrap hook-dependent components in error boundaries',
      'Defer hook calls until React is ready when needed'
    ],
    
    // Patterns to avoid
    antiPatterns: [
      'Conditional hook calls: if (condition) { useState(...) }',
      'Hooks in callbacks: onClick={() => useState(...)}',
      'Hooks in useEffect: useEffect(() => { useState(...) })',
      'Hooks in loops: array.map(() => useState(...))',
      'Early hook calls before React initialization'
    ],
    
    // Safe alternatives
    safeAlternatives: [
      'Use hook values conditionally, not hooks themselves',
      'Use safeHookCall for potentially unsafe contexts',
      'Implement progressive enhancement patterns',
      'Use static fallbacks for initial renders',
      'Queue hook calls until React is ready'
    ]
  },

  COMPONENT_ARCHITECTURE: {
    // Component design principles
    principles: [
      'Single Responsibility: Each component should have one clear purpose',
      'Progressive Enhancement: Start static, add interactivity after load',
      'Error Resilience: Always provide fallback components',
      'Hook Isolation: Separate hook logic from rendering logic',
      'Lazy Loading: Load interactive features after critical path'
    ],
    
    // Required patterns for critical components
    requiredPatterns: [
      'SafeErrorBoundary wrapper for all major components',
      'Static fallback versions for hook-dependent components',
      'Progressive loading for non-critical features',
      'Component auditing for development builds',
      'Performance monitoring for hook usage'
    ]
  },

  ERROR_HANDLING: {
    // Error boundary requirements
    requirements: [
      'All pages must be wrapped in SafeErrorBoundary',
      'Critical components need individual error boundaries',
      'Error boundaries must provide meaningful fallbacks',
      'Development builds should show detailed error info',
      'Production builds should gracefully degrade'
    ],
    
    // Recovery strategies
    recoveryStrategies: [
      'Automatic retry for transient hook errors',
      'Fallback to static versions when hooks fail',
      'Progressive re-enabling of interactive features',
      'User notification for persistent errors',
      'Graceful degradation rather than white screens'
    ]
  },

  PERFORMANCE: {
    // Performance guidelines
    guidelines: [
      'Avoid blocking the main thread during initial render',
      'Use lazy loading for non-critical components',
      'Implement code splitting at route level',
      'Monitor and limit hook call frequency',
      'Cache expensive computations appropriately'
    ],
    
    // Monitoring requirements
    monitoring: [
      'Track component render times',
      'Monitor hook call patterns',
      'Measure time to interactive',
      'Track error rates by component',
      'Monitor memory usage of hook state'
    ]
  }
};

// Development utilities for enforcing standards
export class CodingStandardsEnforcer {
  private static instance: CodingStandardsEnforcer;
  private violations: Array<{
    rule: string;
    component: string;
    severity: 'error' | 'warning';
    timestamp: Date;
  }> = [];

  static getInstance(): CodingStandardsEnforcer {
    if (!CodingStandardsEnforcer.instance) {
      CodingStandardsEnforcer.instance = new CodingStandardsEnforcer();
    }
    return CodingStandardsEnforcer.instance;
  }

  recordViolation(rule: string, component: string, severity: 'error' | 'warning' = 'warning'): void {
    if (process.env.NODE_ENV === 'development') {
      this.violations.push({
        rule,
        component,
        severity,
        timestamp: new Date()
      });

      console.warn(`[CodingStandards] ${severity.toUpperCase()}: ${rule} in ${component}`);
    }
  }

  getViolations(): typeof this.violations {
    return [...this.violations];
  }

  generateComplianceReport(): string {
    const errors = this.violations.filter(v => v.severity === 'error');
    const warnings = this.violations.filter(v => v.severity === 'warning');

    let report = '=== Coding Standards Compliance Report ===\n\n';
    report += `Total Violations: ${this.violations.length}\n`;
    report += `Errors: ${errors.length}\n`;
    report += `Warnings: ${warnings.length}\n\n`;

    if (errors.length > 0) {
      report += '=== ERRORS ===\n';
      errors.forEach(error => {
        report += `${error.component}: ${error.rule}\n`;
      });
      report += '\n';
    }

    if (warnings.length > 0) {
      report += '=== WARNINGS ===\n';
      warnings.forEach(warning => {
        report += `${warning.component}: ${warning.rule}\n`;
      });
    }

    return report;
  }

  clearViolations(): void {
    this.violations = [];
  }
}

// Singleton instance
export const codingStandardsEnforcer = CodingStandardsEnforcer.getInstance();

// Hook usage validator
export const validateHookUsage = (hookName: string, componentName: string): void => {
  try {
    // Check if we're in a valid hook context
    const error = new Error();
    const stack = error.stack || '';
    
    // Simple heuristics to detect unsafe hook usage
    if (stack.includes('useEffect') && hookName !== 'useEffect') {
      codingStandardsEnforcer.recordViolation(
        `${hookName} called inside useEffect`,
        componentName,
        'error'
      );
    }
    
    if (stack.includes('useCallback') && hookName !== 'useCallback') {
      codingStandardsEnforcer.recordViolation(
        `${hookName} called inside useCallback`,
        componentName,
        'error'
      );
    }
    
    if (stack.includes('setTimeout') || stack.includes('setInterval')) {
      codingStandardsEnforcer.recordViolation(
        `${hookName} called inside timer callback`,
        componentName,
        'error'
      );
    }
  } catch (error) {
    // Silent fail - validation is optional
  }
};

// Component pattern validator
export const validateComponentPattern = (componentName: string, hasErrorBoundary: boolean): void => {
  if (!hasErrorBoundary) {
    codingStandardsEnforcer.recordViolation(
      'Component missing error boundary wrapper',
      componentName,
      'warning'
    );
  }
};

export default CODING_STANDARDS;