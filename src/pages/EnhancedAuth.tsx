import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { 
  Mail, Lock, User, Heart, ArrowRight, Loader2, CheckCircle, 
  Shield, Star, Users, Brain, QrCode, Smartphone, Key,
  ChevronRight, Globe, Award, Clock, Zap
} from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TwoFactorSetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

const EnhancedAuth = () => {
  const { signUp, signIn } = useAuth();
  const { setupTOTP, confirmTOTP, setupSMS, confirmSMS } = useTwoFactorAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth' | '2fa-choice' | '2fa-setup' | 'complete'>('auth');
  const [twoFactorMethod, setTwoFactorMethod] = useState<'totp' | 'sms' | null>(null);
  const [totpSetupData, setTotpSetupData] = useState<TwoFactorSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  // Get selected plan from state or localStorage
  const selectedPlan = (() => {
    try {
      const saved = localStorage.getItem('selectedPlan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Account Created!",
          description: "Welcome to TherapySync. Let's secure your account.",
        });
        setStep('2fa-choice');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        const redirect = searchParams.get('redirect');
        navigate(redirect || '/onboarding');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${searchParams.get('redirect') || '/onboarding'}`
        }
      });

      if (error) {
        toast({
          title: `${provider} Sign In Failed`,
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with social provider. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTOTP = async () => {
    setLoading(true);
    try {
      const setupData = await setupTOTP();
      if (setupData) {
        setTotpSetupData(setupData);
        setTwoFactorMethod('totp');
        setStep('2fa-setup');
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to setup authenticator app. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSMS = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to receive SMS codes.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await setupSMS(phoneNumber);
      if (success) {
        setTwoFactorMethod('sms');
        setStep('2fa-setup');
        toast({
          title: "Verification Code Sent",
          description: `A verification code has been sent to ${phoneNumber}`,
        });
      }
    } catch (error) {
      toast({
        title: "SMS Setup Failed",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Verification Code Required",
        description: "Please enter the verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let success = false;
      
      if (twoFactorMethod === 'totp' && totpSetupData) {
        success = await confirmTOTP(totpSetupData.secret, verificationCode, totpSetupData.backupCodes);
      } else if (twoFactorMethod === 'sms') {
        success = await confirmSMS(phoneNumber, verificationCode);
      }

      if (success) {
        setStep('complete');
        setTimeout(() => {
          const redirect = searchParams.get('redirect');
          navigate(redirect || '/onboarding');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full py-3 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200 group"
          onClick={() => handleSocialAuth('google')}
          disabled={loading}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Button>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-3 text-base font-medium border-2 hover:bg-gray-50"
            onClick={() => handleSocialAuth('facebook')}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-3 text-base font-medium border-2 hover:bg-gray-50"
            onClick={() => handleSocialAuth('apple')}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="#000000" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple
          </Button>
        </div>
      </div>

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-slate-500">or continue with email</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {isSignUp && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="pl-10 border-2 focus:border-therapy-300"
                  required={isSignUp}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="pl-10 border-2 focus:border-therapy-300"
                  required={isSignUp}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 border-2 focus:border-therapy-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 border-2 focus:border-therapy-300"
              required
            />
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10 border-2 focus:border-therapy-300"
                required={isSignUp}
              />
            </div>
          </div>
        )}

        <GradientButton
          type="submit"
          className="w-full py-3 text-lg font-semibold mt-6"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
        </GradientButton>
      </form>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-therapy-600 hover:text-therapy-700 font-medium transition-colors"
          disabled={loading}
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : 'Need an account? Sign up'
          }
        </button>
      </div>
    </div>
  );

  const renderTwoFactorChoice = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Secure Your Account</h3>
        <p className="text-slate-600">Choose your preferred two-factor authentication method</p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full p-6 h-auto text-left border-2 hover:border-therapy-300 transition-all group"
          onClick={handleSetupTOTP}
          disabled={loading}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-therapy-100 rounded-lg flex items-center justify-center mr-4">
              <QrCode className="h-6 w-6 text-therapy-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-slate-600">Use apps like Google Authenticator, Authy, or 1Password</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Button>

        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border-2 focus:border-therapy-300"
          />
          <Button
            variant="outline"
            className="w-full p-6 h-auto text-left border-2 hover:border-therapy-300 transition-all group"
            onClick={handleSetupSMS}
            disabled={loading || !phoneNumber.trim()}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">SMS Text Message</h4>
                <p className="text-sm text-slate-600">Receive codes via text message</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          const redirect = searchParams.get('redirect');
          navigate(redirect || '/onboarding');
        }}
      >
        Skip for now (not recommended)
      </Button>
    </div>
  );

  const renderTwoFactorSetup = () => (
    <div className="space-y-6">
      {twoFactorMethod === 'totp' && totpSetupData && (
        <>
          <div className="text-center">
            <QrCode className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
            <p className="text-slate-600">Use your authenticator app to scan this QR code</p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2">
              <img 
                src={totpSetupData.qrCodeUrl} 
                alt="QR Code for TOTP setup"
                className="w-48 h-48"
              />
            </div>
          </div>

          <div className="text-center text-sm text-slate-600">
            <p>Can't scan? Enter this code manually:</p>
            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
              {totpSetupData.secret}
            </code>
          </div>
        </>
      )}

      {twoFactorMethod === 'sms' && (
        <div className="text-center">
          <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Verify Phone Number</h3>
          <p className="text-slate-600">Enter the verification code sent to {phoneNumber}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="text-center text-xl font-mono border-2 focus:border-therapy-300"
            maxLength={6}
          />
        </div>

        <GradientButton
          onClick={handleVerifyTwoFactor}
          className="w-full py-3"
          disabled={loading || verificationCode.length < 6}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Verify & Complete Setup
        </GradientButton>
      </div>

      {twoFactorMethod === 'totp' && totpSetupData && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">Save Your Backup Codes</h4>
          <p className="text-sm text-amber-700 mb-3">
            Store these codes safely. You can use them to access your account if you lose your authenticator.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {totpSetupData.backupCodes.map((code, index) => (
              <div key={index} className="bg-white p-2 rounded border">
                {code}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Account Secured!</h3>
        <p className="text-slate-600">
          Two-factor authentication has been enabled. Your account is now protected.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          You'll be redirected to your dashboard in a moment...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 dark:from-harmony-950 dark:via-therapy-950 dark:to-flow-950">
      {/* Header with branding */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold therapy-text-gradient">TherapySync</h1>
                <p className="text-xs text-slate-500">AI-Powered Mental Wellness</p>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="hidden md:flex items-center space-x-6 text-xs text-slate-600">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>Global Access</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Main Auth Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                {step === 'auth' && <Heart className="h-8 w-8 text-white" />}
                {step === '2fa-choice' && <Shield className="h-8 w-8 text-white" />}
                {step === '2fa-setup' && <Key className="h-8 w-8 text-white" />}
                {step === 'complete' && <CheckCircle className="h-8 w-8 text-white" />}
              </div>
              
              <h2 className="text-3xl font-bold therapy-text-gradient mb-2">
                {step === 'auth' && (isSignUp ? 'Create Your Account' : 'Welcome Back')}
                {step === '2fa-choice' && 'Secure Your Account'}
                {step === '2fa-setup' && 'Complete Setup'}
                {step === 'complete' && 'All Set!'}
              </h2>
              
              <p className="text-slate-600 text-lg">
                {step === 'auth' && (isSignUp 
                  ? 'Join thousands who have found healing with TherapySync' 
                  : 'Continue your mental wellness journey'
                )}
                {step === '2fa-choice' && 'Add an extra layer of protection to your account'}
                {step === '2fa-setup' && 'Almost done! Just verify your setup'}
                {step === 'complete' && 'Your account is now fully secured and ready'}
              </p>
              
              {selectedPlan && step === 'auth' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-therapy-50 to-harmony-50 rounded-xl border border-therapy-200">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-therapy-600 mr-2" />
                    <span className="font-medium text-therapy-700">Plan Selected</span>
                  </div>
                  <p className="text-sm font-bold text-therapy-800">
                    {selectedPlan.name} - {selectedPlan.price}{selectedPlan.period}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 'auth' && renderAuthForm()}
              {step === '2fa-choice' && renderTwoFactorChoice()}
              {step === '2fa-setup' && renderTwoFactorSetup()}
              {step === 'complete' && renderComplete()}
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="text-center mt-6 space-y-2">
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>24/7 Support</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Protected by enterprise-grade security • HIPAA compliant
            </p>
          </div>

          {/* Features preview */}
          {step === 'auth' && (
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white/60 rounded-lg">
                <Brain className="h-6 w-6 text-therapy-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">AI Therapy</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <Users className="h-6 w-6 text-harmony-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Community</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <Zap className="h-6 w-6 text-flow-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Progress</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;