
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  isAccessibilityEnabled: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReader: false,
};

const SafeAccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const SafeAccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);

  // Safe effect that won't crash in Electron
  useEffect(() => {
    try {
      // Check if we're in a proper browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      }

      // Detect if any accessibility features are enabled
      const hasAccessibilityFeatures = Object.values(settings).some(Boolean);
      setIsAccessibilityEnabled(hasAccessibilityFeatures);
    } catch (error) {
      console.log('Accessibility context: using default settings due to environment limitations');
    }
  }, []);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      }
      
      const hasAccessibilityFeatures = Object.values(newSettings).some(Boolean);
      setIsAccessibilityEnabled(hasAccessibilityFeatures);
    } catch (error) {
      console.log('Failed to update accessibility setting:', error);
    }
  };

  const value = {
    settings,
    updateSetting,
    isAccessibilityEnabled,
  };

  return (
    <SafeAccessibilityContext.Provider value={value}>
      {children}
    </SafeAccessibilityContext.Provider>
  );
};

export const useSafeAccessibility = () => {
  const context = useContext(SafeAccessibilityContext);
  if (context === undefined) {
    // Return safe defaults if context is not available
    return {
      settings: defaultSettings,
      updateSetting: () => {},
      isAccessibilityEnabled: false,
    };
  }
  return context;
};
