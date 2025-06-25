
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfilePictureUpload from './ProfilePictureUpload';
import EmailVerificationWarning from './EmailVerificationWarning';

const EnhancedAccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || user?.email || '',
          bio: data.bio || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          avatar_url: data.avatar_url || '',
        });
      } else {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            name: user?.user_metadata?.name || '',
            email: user?.email || '',
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = (url: string) => {
    setFormData(prev => ({
      ...prev,
      avatar_url: url
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth || null,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmailVerificationWarning />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePictureUpload 
            currentAvatarUrl={formData.avatar_url}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Email cannot be changed from this interface
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <Button 
            onClick={saveProfile} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAccountSettings;
