
import React from 'react';
import SimplifiedAuthForm from '@/components/auth/SimplifiedAuthForm';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const EnhancedAuth = () => {
  return (
    <SafeComponentWrapper name="AuthPage">
      <SimplifiedAuthForm />
    </SafeComponentWrapper>
  );
};

export default EnhancedAuth;
