
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail as Google, Linkedin } from 'lucide-react';

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    setIsLoading(provider);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        setError(`Failed to sign in with ${provider}: ${error.message}`);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setError(`An unexpected error occurred with ${provider} login`);
      toast({
        title: "Authentication Error",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'google' as const,
      name: 'Google',
      icon: Google,
      bgColor: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'github' as const,
      name: 'GitHub',
      icon: Github,
      bgColor: 'bg-gray-800 hover:bg-gray-900',
    },
    {
      id: 'linkedin_oidc' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {socialProviders.map((provider) => {
          const Icon = provider.icon;
          return (
            <Button
              key={provider.id}
              variant="outline"
              onClick={() => handleSocialLogin(provider.id)}
              disabled={isLoading !== null}
              className="w-full"
            >
              <Icon className="h-4 w-4 mr-2" />
              {isLoading === provider.id ? 'Connecting...' : `Continue with ${provider.name}`}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLogin;
