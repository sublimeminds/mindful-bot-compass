import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EmailPinAuth } from './EmailPinAuth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';

interface AuthWithEmailPinProps {
  onComplete: () => void;
}

export const AuthWithEmailPin: React.FC<AuthWithEmailPinProps> = ({ onComplete }) => {
  const { signIn } = useAuth();
  const [step, setStep] = useState<'login' | 'email-pin'>('login');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password) as any;
      
      if (result.error) {
        toast({
          title: "Sign In Failed",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (result.needsEmailPin) {
        // User doesn't have 2FA configured, show email PIN
        setUserEmail(result.userEmail || formData.email);
        setStep('email-pin');
      } else {
        // Normal successful login
        onComplete();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPinSuccess = () => {
    toast({
      title: "Login Successful",
      description: "You have been authenticated successfully.",
    });
    onComplete();
  };

  if (step === 'email-pin') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Additional Security Required</h2>
          <p className="text-muted-foreground">
            For your security, we need to verify your identity with an email PIN.
          </p>
        </div>
        
        <EmailPinAuth
          email={userEmail}
          onSuccess={handleEmailPinSuccess}
          onCancel={() => setStep('login')}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <p className="text-muted-foreground">Sign in to your account</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <Separator />
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button className="text-primary hover:underline font-medium">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};