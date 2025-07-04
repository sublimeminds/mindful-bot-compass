
import React from 'react';

interface ImportValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

interface LucideIconValidationResult {
  isValid: boolean;
  invalidIcons: string[];
  suggestions: string[];
}

class ImportValidator {
  private static instance: ImportValidator;
  private validatedFiles: Set<string> = new Set();
  private invalidLucideIcons = ['Print']; // Icons that don't exist
  private validLucideIcons = ['Printer', 'ArrowLeft', 'Clock', 'Calendar', 'BookOpen', 'ThumbsUp', 'Share2'];

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

    } catch (error) {
      console.error('ImportValidator: Error during validation', error);
      issues.push(`Validation error: ${(error as Error).message}`);
      suggestions.push('Check console for detailed error information');
      isValid = false;
    }

    return { isValid, issues, suggestions };
  }

  validateLucideIcons(code: string): LucideIconValidationResult {
    const invalidIcons: string[] = [];
    const suggestions: string[] = [];

    // Check for invalid lucide-react icon imports
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      const imports = match[1].split(',').map(imp => imp.trim());
      
      for (const imp of imports) {
        if (this.invalidLucideIcons.includes(imp)) {
          invalidIcons.push(imp);
          
          if (imp === 'Print') {
            suggestions.push('Replace "Print" with "Printer" - the Print icon does not exist in lucide-react');
          }
        }
      }
    }

    return {
      isValid: invalidIcons.length === 0,
      invalidIcons,
      suggestions
    };
  }

  validateFileImports(filename: string, code?: string): void {
    if (this.validatedFiles.has(filename)) {
      return; // Already validated
    }

    const reactValidation = this.validateReactImports();
    
    if (!reactValidation.isValid) {
      console.warn(`ImportValidator: React issues found in ${filename}`, {
        filename,
        issues: reactValidation.issues,
        suggestions: reactValidation.suggestions
      });
    }

    // Validate Lucide icons if code is provided
    if (code) {
      const lucideValidation = this.validateLucideIcons(code);
      
      if (!lucideValidation.isValid) {
        console.error(`ImportValidator: Invalid Lucide icons found in ${filename}`, {
          filename,
          invalidIcons: lucideValidation.invalidIcons,
          suggestions: lucideValidation.suggestions
        });
      }
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
      invalidLucideIcons: this.invalidLucideIcons,
      validLucideIcons: this.validLucideIcons,
      timestamp: new Date().toISOString()
    };
  }

  reset(): void {
    this.validatedFiles.clear();
  }
}

export const importValidator = ImportValidator.getInstance();

// Make import validation lazy to avoid startup conflicts
export const validateComponentImports = (componentName: string, code?: string): void => {
  // Only validate if explicitly requested, not during startup
  if (import.meta.env.DEV && globalThis.enableImportValidation) {
    importValidator.validateFileImports(componentName, code);
  }
};
