import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmailPinAuth } from '@/components/auth/EmailPinAuth';
import { toast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const EmailPinAuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleSuccess = () => {
    toast({
      title: "Login Successful",
      description: "You have been authenticated successfully.",
    });
    navigate('/onboarding');
  };

  const handleCancel = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Security Verification</h1>
          <p className="text-muted-foreground">
            For your security, we need to verify your identity with an email PIN since you don't have two-factor authentication set up.
          </p>
        </div>
        
        <EmailPinAuth
          email={email}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want to set up two-factor authentication?{' '}
            <button 
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/profile/security')}
            >
              Configure 2FA
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailPinAuthPage;