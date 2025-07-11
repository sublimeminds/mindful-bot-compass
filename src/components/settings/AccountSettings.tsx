import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Calendar, Globe, MapPin } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AccountSettings = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    preferredLanguage: 'en',
    timezone: '',
    countryCode: '',
    preferredCurrency: 'USD'
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          dateOfBirth: data.date_of_birth || '',
          preferredLanguage: data.preferred_language || 'en',
          timezone: data.timezone || '',
          countryCode: data.country_code || '',
          preferredCurrency: data.preferred_currency || 'USD'
        });
      } else {
        // Create initial profile
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          bio: profile.bio,
          date_of_birth: profile.dateOfBirth || null,
          preferred_language: profile.preferredLanguage,
          timezone: profile.timezone,
          country_code: profile.countryCode,
          preferred_currency: profile.preferredCurrency,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select value={profile.preferredLanguage} onValueChange={(value) => setProfile(prev => ({ ...prev, preferredLanguage: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredCurrency">Preferred Currency</Label>
              <Select value={profile.preferredCurrency} onValueChange={(value) => setProfile(prev => ({ ...prev, preferredCurrency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country</Label>
              <Select value={profile.countryCode} onValueChange={(value) => setProfile(prev => ({ ...prev, countryCode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;