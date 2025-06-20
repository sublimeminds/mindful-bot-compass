
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

const Auth = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register' || location.search.includes('register');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 flex items-center justify-center p-4">
        {isRegister ? <EnhancedAuthForm /> : <AuthForm />}
      </div>
      <Footer />
    </>
  );
};

export default Auth;
