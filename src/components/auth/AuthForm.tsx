
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSocialSuccess = () => {
    // Social login success is handled by redirect
    console.log('Social login initiated');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <SocialLoginButtons onSuccess={handleSocialSuccess} />
          
          {/* Traditional Email/Password Forms */}
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignUpForm onToggleMode={toggleMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
