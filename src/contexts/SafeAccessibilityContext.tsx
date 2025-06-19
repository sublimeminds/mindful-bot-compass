
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import { DebugLogger } from '@/utils/debugLogger';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  announceToScreenReader: (message: string) => void;
  focusManagement: {
    trapFocus: (element: HTMLElement) => () => void;
    restoreFocus: (element?: HTMLElement) => void;
  };
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  focusIndicators: true,
};

const SafeAccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const SafeAccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Validate React hooks before using them
  const reactValidation = reactHookValidator.validateReactInit();
  
  if (!reactValidation.isValid) {
    DebugLogger.error('SafeAccessibilityProvider: React hooks not available', reactValidation.error!, {
      component: 'SafeAccessibilityProvider'
    });
    
    // Return children without context if React hooks aren't working
    return React.createElement(React.Fragment, {}, children);
  }

  try {
    reactHookValidator.trackComponentRender('SafeAccessibilityProvider');
    
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
      reactHookValidator.trackHookCall('useState', ['AccessibilitySettings']);
      return defaultSettings;
    });
    
    const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(() => {
      reactHookValidator.trackHookCall('useState', ['lastFocusedElement']);
      return null;
    });

    useEffect(() => {
      reactHookValidator.trackHookCall('useEffect', ['settings']);
      
      try {
        // Check for system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

        setSettings(prev => ({
          ...prev,
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast,
        }));

        // Apply CSS classes based on settings
        document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion);
        document.documentElement.classList.toggle('high-contrast', settings.highContrast);
        document.documentElement.classList.toggle('large-text', settings.largeText);
        document.documentElement.classList.toggle('screen-reader-optimized', settings.screenReaderOptimized);
      } catch (error) {
        DebugLogger.error('SafeAccessibilityProvider: useEffect error', error as Error, {
          component: 'SafeAccessibilityProvider'
        });
      }
    }, [settings]);

    const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
      try {
        setSettings(prev => ({ ...prev, [key]: value }));
      } catch (error) {
        DebugLogger.error('SafeAccessibilityProvider: updateSetting error', error as Error, {
          component: 'SafeAccessibilityProvider',
          key,
          value
        });
      }
    };

    const announceToScreenReader = (message: string) => {
      try {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      } catch (error) {
        DebugLogger.error('SafeAccessibilityProvider: announceToScreenReader error', error as Error, {
          component: 'SafeAccessibilityProvider',
          message
        });
      }
    };

    const trapFocus = (element: HTMLElement) => {
      try {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement?.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement?.focus();
                e.preventDefault();
              }
            }
          }
        };

        element.addEventListener('keydown', handleTabKey);
        firstElement?.focus();

        return () => {
          element.removeEventListener('keydown', handleTabKey);
        };
      } catch (error) {
        DebugLogger.error('SafeAccessibilityProvider: trapFocus error', error as Error, {
          component: 'SafeAccessibilityProvider'
        });
        return () => {};
      }
    };

    const restoreFocus = (element?: HTMLElement) => {
      try {
        const targetElement = element || lastFocusedElement;
        if (targetElement) {
          targetElement.focus();
          setLastFocusedElement(null);
        }
      } catch (error) {
        DebugLogger.error('SafeAccessibilityProvider: restoreFocus error', error as Error, {
          component: 'SafeAccessibilityProvider'
        });
      }
    };

    const focusManagement = {
      trapFocus,
      restoreFocus,
    };

    return React.createElement(SafeAccessibilityContext.Provider, {
      value: {
        settings,
        updateSetting,
        announceToScreenReader,
        focusManagement,
      }
    }, children);

  } catch (error) {
    DebugLogger.error('SafeAccessibilityProvider: Component render error', error as Error, {
      component: 'SafeAccessibilityProvider'
    });
    
    // Return children without context if there's an error
    return React.createElement(React.Fragment, {}, children);
  }
};

export const useSafeAccessibility = () => {
  try {
    reactHookValidator.trackHookCall('useContext', ['SafeAccessibilityContext']);
    const context = useContext(SafeAccessibilityContext);
    
    if (!context) {
      DebugLogger.warn('useSafeAccessibility: Context not available, returning defaults', {
        component: 'useSafeAccessibility'
      });
      
      // Return safe defaults if context is not available
      return {
        settings: defaultSettings,
        updateSetting: () => {},
        announceToScreenReader: () => {},
        focusManagement: {
          trapFocus: () => () => {},
          restoreFocus: () => {},
        },
      };
    }
    
    return context;
  } catch (error) {
    DebugLogger.error('useSafeAccessibility: Hook error', error as Error, {
      component: 'useSafeAccessibility'
    });
    
    // Return safe defaults on error
    return {
      settings: defaultSettings,
      updateSetting: () => {},
      announceToScreenReader: () => {},
      focusManagement: {
        trapFocus: () => () => {},
        restoreFocus: () => {},
      },
    };
  }
};
