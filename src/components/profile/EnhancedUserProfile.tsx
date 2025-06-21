
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Shield } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import EmailVerificationWarning from './EmailVerificationWarning';

const EnhancedUserProfile = () => {
  const { user } = useSimpleApp();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        bio: user.user_metadata?.bio || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <EmailVerificationWarning />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {formData.avatar_url ? (
                <AvatarImage src={formData.avatar_url} alt={formData.name} />
              ) : (
                <AvatarFallback>{formData.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Profile picture updates will be available soon</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              disabled
              className="bg-gray-50"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed from this interface
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              disabled
              className="bg-gray-50"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Profile editing will be available soon
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your password and security settings
          </p>
          <Button variant="outline" disabled>
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserProfile;
