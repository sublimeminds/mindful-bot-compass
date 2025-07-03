import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield, Key, Smartphone, Clock, Eye, EyeOff, Check, X, Lock, Users, Globe, Database, FileText, Settings, Bell, Activity, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock 2FA status loading
    setIsLoading(true);
    setTimeout(() => {
      setIsTwoFactorEnabled(false);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleEnableTwoFactor = () => {
    // Mock 2FA enable
    setIsLoading(true);
    setTimeout(() => {
      setIsTwoFactorEnabled(true);
      setIsLoading(false);
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Your account is now protected with two-factor authentication.",
      });
    }, 1000);
  };

  const handleDisableTwoFactor = () => {
    // Mock 2FA disable
    setIsLoading(true);
    setTimeout(() => {
      setIsTwoFactorEnabled(false);
      setIsLoading(false);
      toast({
        title: "Two-Factor Authentication Disabled",
        description: "Two-factor authentication has been disabled for your account.",
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    // Mock change password
    toast({
      title: "Password Change Initiated",
      description: "A password reset link has been sent to your email address.",
    });
  };

  const handleViewLoginHistory = () => {
    // Mock view login history
    toast({
      title: "Login History",
      description: "Redirecting to your login history page.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <Switch
                id="2fa"
                checked={isTwoFactorEnabled}
                onCheckedChange={isTwoFactorEnabled ? handleDisableTwoFactor : handleEnableTwoFactor}
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {isTwoFactorEnabled
                ? "Two-factor authentication is enabled for added security."
                : "Enable two-factor authentication to add an extra layer of security to your account."}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                disabled
                className="bg-gray-50"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 rounded-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Login History</Label>
            <p className="text-sm text-muted-foreground">
              Review your recent login activity.
            </p>
            <Button variant="outline" onClick={handleViewLoginHistory}>
              View Login History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
