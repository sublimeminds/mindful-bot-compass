import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';

const SuperAdminLogin = () => {
  const { admin, login, loading, secureUrlPrefix } = useSuperAdmin();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (admin && secureUrlPrefix) {
    return <Navigate to={`/${secureUrlPrefix}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLogging(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        toast.success('Successfully logged in');
        // Navigation will be handled by the redirect above
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-slate-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-100">
            Super Admin Access
          </CardTitle>
          <CardDescription className="text-slate-400">
            Secure administrative portal - authorized personnel only
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
                <Lock className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500"
                placeholder="Enter your username"
                disabled={isLogging}
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500 pr-10"
                  placeholder="Enter your password"
                  disabled={isLogging}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLogging}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLogging}
            >
              {isLogging ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Portal'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              All access attempts are logged and monitored
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLogin;