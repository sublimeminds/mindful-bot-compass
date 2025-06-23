
import React from 'react';
import UltraSimpleIndex from './UltraSimpleIndex';

// Use the ultra-simple version to avoid hook initialization issues
const Index = () => {
  console.log('Index: Rendering ultra-simple index page');
  return <UltraSimpleIndex />;
};

export default Index;
