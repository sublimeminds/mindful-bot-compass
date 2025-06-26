
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  screenReader: boolean;
  toggleScreenReader: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add safety check for React hooks
  if (!React || typeof React.useState !== 'function') {
    console.error('React hooks are not available');
    return <div>{children}</div>;
  }

  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion');
    const savedScreenReader = localStorage.getItem('accessibility-screen-reader');

    if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
    if (savedFontSize) setFontSize(savedFontSize as 'small' | 'medium' | 'large');
    if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion));
    if (savedScreenReader) setScreenReader(JSON.parse(savedScreenReader));
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('accessibility-high-contrast', JSON.stringify(newValue));
  };

  const handleSetFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('accessibility-font-size', size);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reduced-motion', JSON.stringify(newValue));
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    localStorage.setItem('accessibility-screen-reader', JSON.stringify(newValue));
  };

  const value: AccessibilityContextType = {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize: handleSetFontSize,
    reducedMotion,
    toggleReducedMotion,
    screenReader,
    toggleScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
