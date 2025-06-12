
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

const Auth = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <EnhancedAuthForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
