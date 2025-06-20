
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthForm from '@/components/auth/AuthForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Register;
