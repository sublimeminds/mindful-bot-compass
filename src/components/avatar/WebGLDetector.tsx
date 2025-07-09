import React, { useState, useEffect } from 'react';

interface WebGLDetectorProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const WebGLDetector: React.FC<WebGLDetectorProps> = ({ children, fallback }) => {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [canvasSupported, setCanvasSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const detectWebGL = () => {
      try {
        // Simple WebGL detection without complex checks
        const canvas = document.createElement('canvas');
        if (!canvas.getContext) {
          setWebGLSupported(false);
          setCanvasSupported(false);
          return;
        }

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebGLSupported(!!gl);
        setCanvasSupported(true);
      } catch (error) {
        console.warn('WebGL detection failed:', error);
        setWebGLSupported(false);
        setCanvasSupported(false);
      }
    };

    // Delay detection to avoid blocking
    const timer = setTimeout(detectWebGL, 100);
    return () => clearTimeout(timer);
  }, []);

  // Still checking
  if (webGLSupported === null || canvasSupported === null) {
    return <>{fallback}</>;
  }

  // WebGL not supported
  if (!webGLSupported || !canvasSupported) {
    return <>{fallback}</>;
  }

  // WebGL supported
  return <>{children}</>;
};

export default WebGLDetector;