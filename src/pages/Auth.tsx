
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';
import GradientLogo from '@/components/ui/GradientLogo';

const Auth = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GradientLogo 
                size="lg"
                className="drop-shadow-lg animate-swirl-breathe"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
              Welcome to TherapySync
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Your AI-powered wellness companion
            </p>
          </div>
          <EnhancedAuthForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
