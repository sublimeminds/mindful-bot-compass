
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-therapy-600">
            Join TherapySync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedAuthForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
