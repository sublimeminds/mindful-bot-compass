
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
  // Check if React is available and hooks can be used safely
  if (typeof React === 'undefined' || typeof React.useState === 'undefined') {
    console.error('React is not available, returning children without context');
    return React.createElement(React.Fragment, {}, children);
  }

  // Validate React hooks before using them
  try {
    const reactValidation = reactHookValidator.validateReactInit();
    
    if (!reactValidation.isValid) {
      console.error('React hooks not available, returning children without context:', reactValidation.error);
      return React.createElement(React.Fragment, {}, children);
    }
  } catch (error) {
    console.error('Error validating React:', error);
    return React.createElement(React.Fragment, {}, children);
  }

  try {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
    const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
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
        if (document?.documentElement) {
          document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion);
          document.documentElement.classList.toggle('high-contrast', settings.highContrast);
          document.documentElement.classList.toggle('large-text', settings.largeText);
          document.documentElement.classList.toggle('screen-reader-optimized', settings.screenReaderOptimized);
        }
      } catch (error) {
        console.error('SafeAccessibilityProvider: useEffect error', error);
      }
    }, [settings]);

    const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
      try {
        setSettings(prev => ({ ...prev, [key]: value }));
      } catch (error) {
        console.error('SafeAccessibilityProvider: updateSetting error', error);
      }
    };

    const announceToScreenReader = (message: string) => {
      try {
        if (!document?.body) return;
        
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
          }
        }, 1000);
      } catch (error) {
        console.error('SafeAccessibilityProvider: announceToScreenReader error', error);
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
        console.error('SafeAccessibilityProvider: trapFocus error', error);
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
        console.error('SafeAccessibilityProvider: restoreFocus error', error);
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
    console.error('SafeAccessibilityProvider: Component render error', error);
    return React.createElement(React.Fragment, {}, children);
  }
};

export const useSafeAccessibility = () => {
  try {
    // Double-check React availability
    if (typeof React === 'undefined' || typeof React.useContext === 'undefined') {
      console.warn('React.useContext not available, returning defaults');
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

    const context = useContext(SafeAccessibilityContext);
    
    if (!context) {
      console.warn('useSafeAccessibility: Context not available, returning defaults');
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
    console.error('useSafeAccessibility: Hook error', error);
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
