
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface AccessibilityState {
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface AccessibilityContextType {
  state: AccessibilityState;
  updateSettings: (settings: Partial<AccessibilityState>) => void;
  resetSettings: () => void;
}

const defaultState: AccessibilityState = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(defaultState);

  const updateSettings = useCallback((newSettings: Partial<AccessibilityState>) => {
    setState(prevState => ({ ...prevState, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setState(defaultState);
  }, []);

  const value: AccessibilityContextType = {
    state,
    updateSettings,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
