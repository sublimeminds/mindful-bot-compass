import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, Shield } from 'lucide-react';
import { useEmailPinAuth } from '@/hooks/useEmailPinAuth';

interface EmailPinAuthProps {
  email?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EmailPinAuth: React.FC<EmailPinAuthProps> = ({
  email,
  onSuccess,
  onCancel
}) => {
  const [pin, setPin] = useState('');
  const { sendEmailPin, verifyEmailPin, isLoading, pinSent, expiresAt } = useEmailPinAuth();

  const handleSendPin = async () => {
    try {
      await sendEmailPin(email);
    } catch (error) {
      console.error('Failed to send PIN:', error);
    }
  };

  const handleVerifyPin = async () => {
    try {
      const result = await verifyEmailPin(pin, email);
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to verify PIN:', error);
    }
  };

  const getRemainingTime = () => {
    if (!expiresAt) return null;
    const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return remaining > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : null;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>Email PIN Verification</CardTitle>
        <CardDescription>
          {pinSent 
            ? 'Enter the 6-digit PIN sent to your email'
            : 'Verify your identity with a secure PIN sent to your email'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!pinSent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {email && <span>PIN will be sent to {email}</span>}
            </div>
            
            <Button 
              onClick={handleSendPin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending PIN...' : 'Send PIN to Email'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium">
                Enter 6-digit PIN
              </label>
              <Input
                id="pin"
                type="text"
                placeholder="000000"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg font-mono tracking-widest"
                autoComplete="one-time-code"
              />
            </div>

            {expiresAt && getRemainingTime() && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Clock className="h-4 w-4" />
                <span>Expires in {getRemainingTime()}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSendPin}
                disabled={isLoading}
                className="flex-1"
              >
                Resend PIN
              </Button>
              
              <Button
                onClick={handleVerifyPin}
                disabled={isLoading || pin.length !== 6}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify PIN'}
              </Button>
            </div>
          </div>
        )}

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>This PIN will expire in 10 minutes for security.</p>
          <p>If you don't receive the email, check your spam folder.</p>
        </div>
      </CardContent>
    </Card>
  );
};