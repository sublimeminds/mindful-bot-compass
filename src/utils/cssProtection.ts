/**
 * CSS Loading Protection Utilities
 * Ensures critical styles load even when CSS files fail
 */

export class CSSProtection {
  private static initialized = false;
  private static fallbackStylesId = 'css-protection-fallback';

  /**
   * Initialize CSS protection by injecting critical fallback styles
   */
  static init() {
    if (this.initialized) return;

    try {
      this.injectFallbackStyles();
      this.checkCSSLoading();
      this.initialized = true;
      console.log('CSS Protection: Initialized successfully');
    } catch (error) {
      console.error('CSS Protection: Failed to initialize', error);
    }
  }

  /**
   * Inject critical fallback styles directly into the document
   */
  private static injectFallbackStyles() {
    if (document.getElementById(this.fallbackStylesId)) return;

    const style = document.createElement('style');
    style.id = this.fallbackStylesId;
    style.textContent = `
      /* Critical CSS Protection Fallbacks */
      .css-safe-container {
        max-width: 1200px !important;
        margin: 0 auto !important;
        padding: 16px !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }
      
      .css-safe-card {
        background: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 8px !important;
        padding: 16px !important;
        margin-bottom: 16px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      }
      
      .css-safe-button {
        background: #1f2937 !important;
        color: #ffffff !important;
        border: none !important;
        padding: 8px 16px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      
      .css-safe-button:hover {
        background: #374151 !important;
      }
      
      .css-safe-input {
        width: 100% !important;
        padding: 8px 12px !important;
        border: 1px solid #d1d5db !important;
        border-radius: 6px !important;
        font-size: 14px !important;
        background: #ffffff !important;
      }
      
      .css-safe-input:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
        border-color: #3b82f6 !important;
      }
      
      .css-safe-text {
        color: #1f2937 !important;
        line-height: 1.5 !important;
      }
      
      .css-safe-heading {
        color: #111827 !important;
        font-weight: 600 !important;
        margin-bottom: 16px !important;
      }
      
      .css-safe-spinner {
        width: 24px !important;
        height: 24px !important;
        border: 2px solid #e5e7eb !important;
        border-top: 2px solid #3b82f6 !important;
        border-radius: 50% !important;
        animation: css-safe-spin 1s linear infinite !important;
      }
      
      @keyframes css-safe-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .css-safe-error {
        background: #fef2f2 !important;
        border: 1px solid #fecaca !important;
        color: #dc2626 !important;
        padding: 16px !important;
        border-radius: 8px !important;
        margin: 16px !important;
      }
      
      .css-safe-success {
        background: #f0fdf4 !important;
        border: 1px solid #bbf7d0 !important;
        color: #166534 !important;
        padding: 16px !important;
        border-radius: 8px !important;
        margin: 16px !important;
      }
      
      .css-safe-loading {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 40px !important;
        font-size: 14px !important;
        color: #6b7280 !important;
      }
      
      /* Critical layout utilities */
      .css-safe-flex {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      
      .css-safe-grid {
        display: grid !important;
        gap: 16px !important;
      }
      
      .css-safe-center {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 400px !important;
      }
      
      /* Responsive utilities */
      @media (max-width: 768px) {
        .css-safe-container {
          padding: 12px !important;
        }
        
        .css-safe-card {
          padding: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Check if main CSS has loaded properly
   */
  private static checkCSSLoading() {
    // Create a test element to check if Tailwind CSS loaded
    const testElement = document.createElement('div');
    testElement.className = 'bg-blue-500';
    testElement.style.position = 'absolute';
    testElement.style.top = '-9999px';
    document.body.appendChild(testElement);

    // Check if the background color was applied
    const styles = window.getComputedStyle(testElement);
    const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';

    document.body.removeChild(testElement);

    if (!hasBackground) {
      console.warn('CSS Protection: Main CSS may not have loaded properly, using fallbacks');
      document.body.classList.add('css-fallback-mode');
    }
  }

  /**
   * Apply safe CSS classes to an element
   */
  static applySafeClasses(element: HTMLElement, classes: string[]) {
    try {
      const safeClasses = classes.map(cls => `css-safe-${cls}`);
      element.classList.add(...safeClasses);
    } catch (error) {
      console.error('CSS Protection: Failed to apply safe classes', error);
    }
  }

  /**
   * Create a safe loading indicator
   */
  static createSafeSpinner(): HTMLDivElement {
    const spinner = document.createElement('div');
    spinner.className = 'css-safe-spinner';
    return spinner;
  }

  /**
   * Create a safe error message
   */
  static createSafeError(message: string): HTMLDivElement {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'css-safe-error';
    errorDiv.textContent = message;
    return errorDiv;
  }
}

// Auto-initialize when the script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CSSProtection.init());
  } else {
    CSSProtection.init();
  }
}