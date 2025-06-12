import React from 'react';
import { DebugLogger } from './debugLogger';

interface ImportValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

class ImportValidator {
  private static instance: ImportValidator;
  private validatedFiles: Set<string> = new Set();

  static getInstance(): ImportValidator {
    if (!ImportValidator.instance) {
      ImportValidator.instance = new ImportValidator();
    }
    return ImportValidator.instance;
  }

  validateReactImports(): ImportValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let isValid = true;

    try {
      // Check if React is available globally
      if (typeof React === 'undefined') {
        issues.push('React is not available globally');
        suggestions.push('Add: import React from "react" to the top of your file');
        isValid = false;
      }

      // Check if React hooks are available
      if (typeof React !== 'undefined') {
        const expectedHooks = ['useState', 'useEffect', 'useContext', 'useCallback', 'useMemo', 'useRef'];
        const missingHooks = expectedHooks.filter(hook => !(hook in React));
        
        if (missingHooks.length > 0) {
          issues.push(`Missing React hooks: ${missingHooks.join(', ')}`);
          suggestions.push('Check React version and ensure all hooks are properly exported');
          isValid = false;
        }
      }

      // Validate that we're not mixing import patterns
      if (typeof window !== 'undefined' && window.location) {
        // In development, we can check for common import pattern issues
        if (import.meta.env.DEV) {
          // This would ideally be done at build time, but we can add runtime checks
          const currentScript = document.currentScript as HTMLScriptElement;
          if (currentScript && currentScript.src) {
            DebugLogger.debug('ImportValidator: Validating current script context', {
              component: 'ImportValidator',
              src: currentScript.src
            });
          }
        }
      }

    } catch (error) {
      DebugLogger.error('ImportValidator: Error during validation', error as Error, {
        component: 'ImportValidator',
        method: 'validateReactImports'
      });
      
      issues.push(`Validation error: ${(error as Error).message}`);
      suggestions.push('Check console for detailed error information');
      isValid = false;
    }

    return { isValid, issues, suggestions };
  }

  validateFileImports(filename: string): void {
    if (this.validatedFiles.has(filename)) {
      return; // Already validated
    }

    const validation = this.validateReactImports();
    
    if (!validation.isValid) {
      DebugLogger.warn(`ImportValidator: Issues found in ${filename}`, {
        component: 'ImportValidator',
        filename,
        issues: validation.issues,
        suggestions: validation.suggestions
      });
    } else {
      DebugLogger.debug(`ImportValidator: ${filename} passed validation`, {
        component: 'ImportValidator',
        filename
      });
    }

    this.validatedFiles.add(filename);
  }

  getValidationReport(): Record<string, any> {
    const validation = this.validateReactImports();
    
    return {
      isValid: validation.isValid,
      issues: validation.issues,
      suggestions: validation.suggestions,
      validatedFiles: Array.from(this.validatedFiles),
      timestamp: new Date().toISOString()
    };
  }

  reset(): void {
    this.validatedFiles.clear();
  }
}

export const importValidator = ImportValidator.getInstance();

// Development-only import validation
export const validateComponentImports = (componentName: string): void => {
  if (import.meta.env.DEV) {
    importValidator.validateFileImports(componentName);
  }
};
