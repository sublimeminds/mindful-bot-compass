
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import GradientLogo from '@/components/ui/GradientLogo';
import SafeComponent from '@/components/SafeComponent';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useSafeAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      toast("Welcome back! You have successfully signed in to TherapySync.");
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeComponent componentName="AuthForm">
      <Card className="w-full max-w-md mx-auto shadow-xl border-harmony-200">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <GradientLogo size="md" className="drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to your TherapySync account
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-harmony-600 hover:text-harmony-700"
                onClick={() => navigate('/register')}
              >
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </SafeComponent>
  );
};

export default AuthForm;
