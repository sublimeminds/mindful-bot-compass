import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const EmailVerificationWarning = () => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);

  // Check if email is verified
  const isEmailVerified = user?.email_confirmed_at !== null;

  if (isEmailVerified || !user) {
    return null;
  }

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }

      toast("Verification email sent! Please check your inbox and spam folder.");
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast("Failed to send verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-amber-600" />
          <span className="text-amber-800">
            Your email address ({user.email}) is not verified. Please check your email to verify your account.
          </span>
        </div>
        <Button
          onClick={handleResendVerification}
          disabled={isResending}
          variant="outline"
          size="sm"
          className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          {isResending ? 'Sending...' : 'Resend Email'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationWarning;
