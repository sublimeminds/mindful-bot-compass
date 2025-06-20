
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

const Auth = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 flex items-center justify-center p-4">
        <EnhancedAuthForm />
      </div>
      <Footer />
    </>
  );
};

export default Auth;
