import React from 'react';

interface DevAuthControlsProps {
  user: any;
  skipAuth: () => void;
  enableAuth: () => void;
}

export const DevAuthControls: React.FC<DevAuthControlsProps> = ({ user, skipAuth, enableAuth }) => {
  // Completely disabled - no dev controls shown
  return null;
};