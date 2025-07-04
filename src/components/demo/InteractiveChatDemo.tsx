import React from 'react';
import NativeChatDemo from '@/components/native/NativeChatDemo';

interface InteractiveChatDemoProps {
  autoStart?: boolean;
}

const InteractiveChatDemo: React.FC<InteractiveChatDemoProps> = (props) => {
  // Always use NativeChatDemo for stability and to avoid validation loops
  return <NativeChatDemo {...props} />;
};

export default InteractiveChatDemo;