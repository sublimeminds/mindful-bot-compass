
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SafeAccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  announcements: boolean;
}

interface SafeAccessibilityContextType {
  settings: SafeAccessibilitySettings;
  isSupported: boolean;
  updateSetting: (key: keyof SafeAccessibilitySettings, value: boolean) => void;
  announceToScreenReader: (message: string) => void;
  applySettings: () => void;
}

const defaultSettings: SafeAccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  announcements: true,
};

const SafeAccessibilityContext = createContext<SafeAccessibilityContextType | undefined>(undefined);

interface SafeAccessibilityProviderProps {
  children: React.ReactNode;
}

export const SafeAccessibilityProvider: React.FC<SafeAccessibilityProviderProps> = ({ children }) => {
  // Check if we're in a browser environment
  const isSupported = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  const [settings, setSettings] = useState<SafeAccessibilitySettings>(defaultSettings);
  const [announcementElement, setAnnouncementElement] = useState<HTMLElement | null>(null);

  // Initialize accessibility features only if supported
  useEffect(() => {
    if (!isSupported) return;

    // Create screen reader announcement element
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    
    document.body.appendChild(announcer);
    setAnnouncementElement(announcer);

    // Load saved settings
    try {
      const saved = localStorage.getItem('safe-accessibility-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }

    return () => {
      if (announcer && document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    };
  }, [isSupported]);

  // Save settings when they change
  useEffect(() => {
    if (!isSupported) return;
    
    try {
      localStorage.setItem('safe-accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings, isSupported]);

  // Apply accessibility styles
  useEffect(() => {
    if (!isSupported) return;

    const root = document.documentElement;
    
    // Apply or remove classes based on settings
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Set CSS custom properties for more granular control
    root.style.setProperty('--accessibility-high-contrast', settings.highContrast ? '1' : '0');
    root.style.setProperty('--accessibility-large-text', settings.largeText ? '1.2' : '1');
    root.style.setProperty('--accessibility-reduced-motion', settings.reducedMotion ? '1' : '0');
  }, [settings, isSupported]);

  const updateSetting = React.useCallback((key: keyof SafeAccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const announceToScreenReader = React.useCallback((message: string) => {
    if (!isSupported || !announcementElement || !settings.announcements) return;
    
    announcementElement.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      if (announcementElement) {
        announcementElement.textContent = '';
      }
    }, 1000);
  }, [isSupported, announcementElement, settings.announcements]);

  const applySettings = React.useCallback(() => {
    if (!isSupported) return;
    
    // Force re-application of all accessibility settings
    const root = document.documentElement;
    
    Object.entries(settings).forEach(([key, value]) => {
      switch (key) {
        case 'highContrast':
          root.classList.toggle('high-contrast', value);
          break;
        case 'largeText':
          root.classList.toggle('large-text', value);
          break;
        case 'reducedMotion':
          root.classList.toggle('reduced-motion', value);
          break;
      }
    });
  }, [isSupported, settings]);

  const value: SafeAccessibilityContextType = {
    settings,
    isSupported,
    updateSetting,
    announceToScreenReader,
    applySettings,
  };

  return (
    <SafeAccessibilityContext.Provider value={value}>
      {children}
    </SafeAccessibilityContext.Provider>
  );
};

export const useSafeAccessibility = (): SafeAccessibilityContextType => {
  const context = useContext(SafeAccessibilityContext);
  if (!context) {
    // Return a safe fallback if context is not available
    return {
      settings: defaultSettings,
      isSupported: false,
      updateSetting: () => {},
      announceToScreenReader: () => {},
      applySettings: () => {},
    };
  }
  return context;
};
