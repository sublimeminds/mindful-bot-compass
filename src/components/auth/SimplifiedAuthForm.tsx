import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSafeNavigation } from '@/components/bulletproof/SafeRouter';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const SimplifiedAuthForm = () => {
  const { signUp, signIn, loading: authLoading } = useAuth();
  const { navigate } = useSafeNavigation();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            description: error.message || "Failed to create account",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        navigate('/dashboard');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message || "Failed to sign in",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        navigate('/dashboard');
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

  return (
    <SafeComponentWrapper name="SimplifiedAuthForm">
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-card border shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                {isSignUp 
                  ? 'Join your mental wellness journey' 
                  : 'Continue your mental wellness journey'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold mt-6"
                  disabled={loading || authLoading}
                >
                  {(loading || authLoading) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  disabled={loading || authLoading}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : 'Need an account? Sign up'
                  }
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Protected by enterprise-grade security</p>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default SimplifiedAuthForm;