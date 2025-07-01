import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Phone, 
  AlertTriangle, 
  Heart,
  Users,
  Clock,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CrisisSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    crisisDetection: true,
    autoAlerts: true,
    emergencyContacts: [
      { name: '', phone: '', relationship: '' }
    ],
    crisisKeywords: ['suicide', 'harm', 'kill', 'die', 'hurt myself'],
    safetyPlan: '',
    professionalSupport: {
      enabled: true,
      hotlineNumbers: [
        { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis support' }
      ]
    },
    location: '',
    medicalInfo: '',
    therapistNotification: true
  });

  const handleToggle = (key: string, value: boolean) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const addEmergencyContact = () => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('crisis_settings', JSON.stringify(settings));
    toast({
      title: "Crisis Settings Saved",
      description: "Your crisis intervention settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Crisis Intervention Settings</h2>
        <p className="text-muted-foreground">
          Configure safety measures and emergency protocols for crisis situations.
        </p>
      </div>

      {/* Crisis Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          If you're experiencing a mental health crisis, please contact emergency services (911) 
          or the National Suicide Prevention Lifeline (988) immediately.
        </AlertDescription>
      </Alert>

      {/* Crisis Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Crisis Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Crisis Detection</Label>
              <p className="text-sm text-muted-foreground">AI monitors conversations for crisis indicators</p>
            </div>
            <Switch
              checked={settings.crisisDetection}
              onCheckedChange={(checked) => handleToggle('crisisDetection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Alerts</Label>
              <p className="text-sm text-muted-foreground">Send alerts to emergency contacts when crisis is detected</p>
            </div>
            <Switch
              checked={settings.autoAlerts}
              onCheckedChange={(checked) => handleToggle('autoAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Therapist Notification</Label>
              <p className="text-sm text-muted-foreground">Notify your selected therapist during crisis situations</p>
            </div>
            <Switch
              checked={settings.therapistNotification}
              onCheckedChange={(checked) => handleToggle('therapistNotification', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Emergency Contacts
            </div>
            <Button variant="outline" size="sm" onClick={addEmergencyContact}>
              Add Contact
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contact {index + 1}</h4>
                {settings.emergencyContacts.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                    placeholder="e.g., Family, Friend"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Professional Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Professional Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Professional Support Integration</Label>
              <p className="text-sm text-muted-foreground">Show professional crisis resources when needed</p>
            </div>
            <Switch
              checked={settings.professionalSupport.enabled}
              onCheckedChange={(checked) => handleToggle('professionalSupport.enabled', checked)}
            />
          </div>

          {settings.professionalSupport.enabled && (
            <div className="space-y-3">
              <Label>Crisis Hotlines</Label>
              {settings.professionalSupport.hotlineNumbers.map((hotline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{hotline.name}</p>
                    <p className="text-sm text-muted-foreground">{hotline.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{hotline.number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Personal Safety Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Safety Plan</Label>
            <Textarea
              value={settings.safetyPlan}
              onChange={(e) => setSettings(prev => ({ ...prev, safetyPlan: e.target.value }))}
              placeholder="Describe your personal safety plan, coping strategies, safe places, and people who help you feel better..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Include coping strategies, safe places, supportive people, and activities that help you feel better
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Location Information</Label>
            <Input
              value={settings.location}
              onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State (for local emergency resources)"
            />
          </div>

          <div className="space-y-2">
            <Label>Medical Information</Label>
            <Textarea
              value={settings.medicalInfo}
              onChange={(e) => setSettings(prev => ({ ...prev, medicalInfo: e.target.value }))}
              placeholder="Any relevant medical conditions, medications, or allergies..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full">
        Save Crisis Settings
      </Button>
    </div>
  );
};

export default CrisisSettings;