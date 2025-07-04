
import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import NativeProgressTracker from '@/components/native/NativeProgressTracker';

const ProgressTracker = () => {
  console.log('ProgressTracker: Checking React health before render');
  
  // Check React health before attempting to use hooks
  const validation = reactHookValidator.validateReactContext();
  
  if (!validation.isValid) {
    console.warn('ProgressTracker: React hooks not safe, using native version:', validation.error);
    return <NativeProgressTracker />;
  }

  console.log('ProgressTracker: React is healthy, using native version for stability');
  return <NativeProgressTracker />;
};

export default ProgressTracker;
