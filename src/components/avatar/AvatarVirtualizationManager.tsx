import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface AvatarInstance {
  id: string;
  isVisible: boolean;
  isRendering: boolean;
  priority: number;
}

interface AvatarVirtualizationContextType {
  requestAvatarRender: (id: string, priority?: number) => boolean;
  releaseAvatarRender: (id: string) => void;
  isAvatarAllowedToRender: (id: string) => boolean;
  maxConcurrentAvatars: number;
}

const AvatarVirtualizationContext = createContext<AvatarVirtualizationContextType | null>(null);

const MAX_CONCURRENT_AVATARS = 3;

export const AvatarVirtualizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatars, setAvatars] = useState<Map<string, AvatarInstance>>(new Map());
  const activeRenderCount = useRef(0);

  const requestAvatarRender = useCallback((id: string, priority = 0): boolean => {
    if (activeRenderCount.current >= MAX_CONCURRENT_AVATARS) {
      // Check if we can preempt a lower priority avatar
      const currentAvatars = Array.from(avatars.values());
      const renderingAvatars = currentAvatars.filter(a => a.isRendering);
      const lowestPriority = Math.min(...renderingAvatars.map(a => a.priority));
      
      if (priority <= lowestPriority) {
        return false; // Cannot render
      }
      
      // Preempt lowest priority avatar
      const avatarToPreempt = renderingAvatars.find(a => a.priority === lowestPriority);
      if (avatarToPreempt) {
        releaseAvatarRender(avatarToPreempt.id);
      }
    }

    setAvatars(prev => {
      const newMap = new Map(prev);
      newMap.set(id, {
        id,
        isVisible: true,
        isRendering: true,
        priority
      });
      return newMap;
    });

    activeRenderCount.current++;
    return true;
  }, [avatars]);

  const releaseAvatarRender = useCallback((id: string) => {
    setAvatars(prev => {
      const newMap = new Map(prev);
      const avatar = newMap.get(id);
      if (avatar?.isRendering) {
        activeRenderCount.current--;
        newMap.set(id, { ...avatar, isRendering: false });
      }
      return newMap;
    });
  }, []);

  const isAvatarAllowedToRender = useCallback((id: string): boolean => {
    const avatar = avatars.get(id);
    return avatar?.isRendering ?? false;
  }, [avatars]);

  return (
    <AvatarVirtualizationContext.Provider value={{
      requestAvatarRender,
      releaseAvatarRender,
      isAvatarAllowedToRender,
      maxConcurrentAvatars: MAX_CONCURRENT_AVATARS
    }}>
      {children}
    </AvatarVirtualizationContext.Provider>
  );
};

export const useAvatarVirtualization = () => {
  const context = useContext(AvatarVirtualizationContext);
  if (!context) {
    throw new Error('useAvatarVirtualization must be used within AvatarVirtualizationProvider');
  }
  return context;
};