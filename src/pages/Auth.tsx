
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 flex items-center justify-center p-4">
        <AuthForm />
      </div>
      <Footer />
    </>
  );
};

export default Auth;
