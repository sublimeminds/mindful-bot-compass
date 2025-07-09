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
        // Check if canvas is supported
        const canvas = document.createElement('canvas');
        const canvasSupport = !!(canvas.getContext && canvas.getContext('2d'));
        setCanvasSupported(canvasSupport);

        if (!canvasSupport) {
          setWebGLSupported(false);
          return;
        }

        // Check WebGL support
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const webglSupport = !!gl;
        setWebGLSupported(webglSupport);

        // Additional WebGL capability checks
        if (webglSupport && gl && gl instanceof WebGLRenderingContext) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            console.log('WebGL Renderer:', renderer);
            
            // Check for software rendering (which might cause issues)
            if (typeof renderer === 'string' && 
                (renderer.toLowerCase().includes('software') || 
                 renderer.toLowerCase().includes('swiftshader'))) {
              console.warn('Software WebGL detected - 3D performance may be limited');
            }
          }
        }
      } catch (error) {
        console.warn('WebGL detection failed:', error);
        setWebGLSupported(false);
        setCanvasSupported(false);
      }
    };

    detectWebGL();
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