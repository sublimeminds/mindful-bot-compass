import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import NativeChatDemo from '@/components/native/NativeChatDemo';

interface InteractiveChatDemoProps {
  autoStart?: boolean;
}

const InteractiveChatDemo: React.FC<InteractiveChatDemoProps> = (props) => {
  console.log('InteractiveChatDemo: Checking React health before render');
  
  // Check React health before attempting to use hooks
  const validation = reactHookValidator.validateReactContext();
  
  if (!validation.isValid) {
    console.warn('InteractiveChatDemo: React hooks not safe, using native version:', validation.error);
    return <NativeChatDemo {...props} />;
  }

  console.log('InteractiveChatDemo: React is healthy, using native version for stability');
  return <NativeChatDemo {...props} />;
};

export default InteractiveChatDemo;