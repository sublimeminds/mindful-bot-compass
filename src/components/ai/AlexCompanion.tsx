import React from 'react';
import Alex2DCompanion from './Alex2DCompanion';

interface AlexCompanionProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AlexCompanion: React.FC<AlexCompanionProps> = (props) => {
  return <Alex2DCompanion {...props} />;
};

export default AlexCompanion;