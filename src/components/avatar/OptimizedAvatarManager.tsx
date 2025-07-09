import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface AvatarManagerState {
  activeAvatars: Set<string>;
  maxActiveAvatars: number;
  webglContexts: Map<string, WebGLRenderingContext>;
}

interface AvatarManagerContextType {
  canRenderAvatar: (therapistId: string) => boolean;
  requestAvatarRender: (therapistId: string, priority: number) => boolean;
  releaseAvatarRender: (therapistId: string) => void;
  getSharedWebGLContext: () => WebGLRenderingContext | null;
}

const AvatarManagerContext = createContext<AvatarManagerContextType | null>(null);

interface AvatarManagerProviderProps {
  children: React.ReactNode;
  maxActiveAvatars?: number;
}

export const AvatarManagerProvider: React.FC<AvatarManagerProviderProps> = ({
  children,
  maxActiveAvatars = 3
}) => {
  const [state, setState] = useState<AvatarManagerState>({
    activeAvatars: new Set(),
    maxActiveAvatars,
    webglContexts: new Map()
  });
  
  const sharedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sharedContextRef = useRef<WebGLRenderingContext | null>(null);

  // Initialize shared WebGL context
  useEffect(() => {
    const initializeSharedContext = () => {
      try {
        if (!sharedCanvasRef.current) {
          sharedCanvasRef.current = document.createElement('canvas');
          sharedCanvasRef.current.width = 1;
          sharedCanvasRef.current.height = 1;
        }

        const gl = sharedCanvasRef.current.getContext('webgl2') ||
                  sharedCanvasRef.current.getContext('webgl') ||
                  sharedCanvasRef.current.getContext('experimental-webgl') as WebGLRenderingContext | null;

        if (gl) {
          sharedContextRef.current = gl;
        }
      } catch (error) {
        console.warn('Failed to initialize shared WebGL context:', error);
      }
    };

    initializeSharedContext();

    return () => {
      if (sharedCanvasRef.current) {
        sharedCanvasRef.current = null;
      }
      sharedContextRef.current = null;
    };
  }, []);

  const canRenderAvatar = useCallback((therapistId: string): boolean => {
    return state.activeAvatars.has(therapistId) || 
           state.activeAvatars.size < state.maxActiveAvatars;
  }, [state.activeAvatars, state.maxActiveAvatars]);

  const requestAvatarRender = useCallback((therapistId: string, priority: number): boolean => {
    setState(prevState => {
      if (prevState.activeAvatars.has(therapistId)) {
        return prevState; // Already active
      }

      if (prevState.activeAvatars.size < prevState.maxActiveAvatars) {
        const newActiveAvatars = new Set(prevState.activeAvatars);
        newActiveAvatars.add(therapistId);
        return {
          ...prevState,
          activeAvatars: newActiveAvatars
        };
      }

      // If at capacity, could implement priority-based replacement here
      return prevState;
    });

    return state.activeAvatars.has(therapistId) || 
           state.activeAvatars.size < state.maxActiveAvatars;
  }, [state.activeAvatars, state.maxActiveAvatars]);

  const releaseAvatarRender = useCallback((therapistId: string) => {
    setState(prevState => {
      if (!prevState.activeAvatars.has(therapistId)) {
        return prevState;
      }

      const newActiveAvatars = new Set(prevState.activeAvatars);
      newActiveAvatars.delete(therapistId);
      
      // Clean up any WebGL context for this avatar
      const newWebglContexts = new Map(prevState.webglContexts);
      newWebglContexts.delete(therapistId);

      return {
        ...prevState,
        activeAvatars: newActiveAvatars,
        webglContexts: newWebglContexts
      };
    });
  }, []);

  const getSharedWebGLContext = useCallback((): WebGLRenderingContext | null => {
    return sharedContextRef.current;
  }, []);

  const contextValue: AvatarManagerContextType = {
    canRenderAvatar,
    requestAvatarRender,
    releaseAvatarRender,
    getSharedWebGLContext
  };

  return (
    <AvatarManagerContext.Provider value={contextValue}>
      {children}
    </AvatarManagerContext.Provider>
  );
};

export const useAvatarManager = () => {
  const context = useContext(AvatarManagerContext);
  if (!context) {
    throw new Error('useAvatarManager must be used within an AvatarManagerProvider');
  }
  return context;
};