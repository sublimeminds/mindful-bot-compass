
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationWarning from './EmailVerificationWarning';

const AccountSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
  });

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
            <Lock className="h-5 w-5 mr-2" />
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

export default AccountSettings;
