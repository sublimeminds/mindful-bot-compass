import React from 'react';
import MinimalSafeHeader from '@/components/MinimalSafeHeader';

console.log('[SafeHeaderNew] Loading new safe header - React available:', !!React);

// Simple header component that always works
const SafeHeaderNew = () => {
  console.log('[SafeHeaderNew] Rendering new safe header');
  
  // For now, just use the minimal header to ensure it works
  // Later we can add complexity back gradually
  return <MinimalSafeHeader />;
};

export default SafeHeaderNew;