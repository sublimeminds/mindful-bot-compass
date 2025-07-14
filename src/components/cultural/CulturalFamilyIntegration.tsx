import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Heart, AlertCircle, Globe, Languages } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { FamilyIntegrationService, type FamilyIntegrationProfile } from '@/services/culturalEnhancedServices';
import { culturalAIService } from '@/services/culturalAiService';

interface FamilyMember {
  name: string;
  relationship: string;
  age?: number;
  culturalRole: string;
  contactInfo?: string;
  involvementLevel: 'observer' | 'participant' | 'decision_maker';
}

const CulturalFamilyIntegration = () => {
  const { user } = useSimpleApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [familyProfile, setFamilyProfile] = useState<FamilyIntegrationProfile | null>(null);
  const [culturalContext, setCulturalContext] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newMember, setNewMember] = useState<FamilyMember>({
    name: '',
    relationship: '',
    culturalRole: '',
    involvementLevel: 'observer'
  });

  // Form state
  const [familyInvolvementLevel, setFamilyInvolvementLevel] = useState<'minimal' | 'moderate' | 'high'>('moderate');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyTherapyConsent, setFamilyTherapyConsent] = useState(false);
  const [culturalDecisionMaking, setCulturalDecisionMaking] = useState<'individual' | 'consultative' | 'collective'>('individual');
  const [emergencyContact, setEmergencyContact] = useState('');

  useEffect(() => {
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [profile, context] = await Promise.all([
        FamilyIntegrationService.getFamilyProfile(user.id),
        culturalAIService.getEnhancedCulturalContext(user.id)
      ]);

      setFamilyProfile(profile);
      setCulturalContext(context);
      
      if (profile) {
        setFamilyInvolvementLevel(profile.familyInvolvementLevel);
        setFamilyMembers(profile.familyMembers);
        setFamilyTherapyConsent(profile.familyTherapyConsent);
        setCulturalDecisionMaking(profile.culturalDecisionMaking);
        setEmergencyContact(profile.emergencyFamilyContact || '');
      } else {
        setIsEditing(true); // Auto-start editing if no profile exists
      }
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const profileData: Omit<FamilyIntegrationProfile, 'id'> = {
        userId: user.id,
        familyInvolvementLevel,
        familyMembers,
        culturalFamilyRoles: organizeFamilyRoles(familyMembers),
        familyTherapyConsent,
        emergencyFamilyContact: emergencyContact,
        culturalDecisionMaking
      };

      const result = await FamilyIntegrationService.createFamilyProfile(profileData);
      
      if (result) {
        setFamilyProfile(result);
        setIsEditing(false);
        await loadFamilyData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving family profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const organizeFamilyRoles = (members: FamilyMember[]) => {
    return {
      decisionMaker: members.filter(m => m.involvementLevel === 'decision_maker').map(m => m.name),
      caregivers: members.filter(m => m.culturalRole === 'caregiver').map(m => m.name),
      elders: members.filter(m => m.culturalRole === 'elder').map(m => m.name),
      supporters: members.filter(m => m.culturalRole === 'supporter').map(m => m.name)
    };
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([...familyMembers, { ...newMember }]);
      setNewMember({
        name: '',
        relationship: '',
        culturalRole: '',
        involvementLevel: 'observer'
      });
    }
  };

  const handleRemoveMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const getCulturalGuidance = () => {
    if (!culturalContext) return null;

    const guidance = {
      'hispanic': {
        familyImportance: 'Familismo is central to Hispanic culture. Family involvement in therapy decisions is often expected and beneficial.',
        decisionMaking: 'Collective decision-making respects traditional family hierarchy and values.',
        roles: 'Consider including padres/madres (parents), abuelos (grandparents), and hermanos (siblings) in your therapy journey.'
      },
      'asian': {
        familyImportance: 'Family harmony and filial piety are important values. Respecting elder input while maintaining individual growth.',
        decisionMaking: 'Consultative approach often works best, honoring family input while preserving personal autonomy.',
        roles: 'Elders often play advisory roles, while parents may be primary decision-makers.'
      },
      'african': {
        familyImportance: 'Ubuntu philosophy emphasizes community and extended family support in healing processes.',
        decisionMaking: 'Collective decision-making aligns with traditional community-based healing approaches.',
        roles: 'Extended family, elders, and community members often play supportive roles in healing.'
      },
      'western': {
        familyImportance: 'Individual autonomy is valued, but family support can enhance therapy outcomes.',
        decisionMaking: 'Individual decision-making is typical, with family as supportive consultants.',
        roles: 'Immediate family members usually provide emotional support and encouragement.'
      }
    };

    return guidance[culturalContext.culturalBackground] || guidance['western'];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const culturalGuidance = getCulturalGuidance();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <span>Cultural Family Integration</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure how your family can support your therapy journey in a culturally-appropriate way.
        </p>
      </div>

      {culturalGuidance && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Cultural Guidance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">Family Importance:</h4>
              <p className="text-sm text-muted-foreground">{culturalGuidance.familyImportance}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Decision Making:</h4>
              <p className="text-sm text-muted-foreground">{culturalGuidance.decisionMaking}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Family Roles:</h4>
              <p className="text-sm text-muted-foreground">{culturalGuidance.roles}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Family Involvement Level */}
        <Card>
          <CardHeader>
            <CardTitle>Family Involvement Level</CardTitle>
            <p className="text-sm text-muted-foreground">
              How much do you want your family involved in your therapy process?
            </p>
          </CardHeader>
          <CardContent>
            <Select
              value={familyInvolvementLevel}
              onValueChange={(value: 'minimal' | 'moderate' | 'high') => setFamilyInvolvementLevel(value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal - Privacy focused, family informed only when necessary</SelectItem>
                <SelectItem value="moderate">Moderate - Family consulted on major decisions</SelectItem>
                <SelectItem value="high">High - Family actively involved in therapy planning and sessions</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Cultural Decision Making */}
        <Card>
          <CardHeader>
            <CardTitle>Cultural Decision Making Style</CardTitle>
            <p className="text-sm text-muted-foreground">
              How are important decisions typically made in your family?
            </p>
          </CardHeader>
          <CardContent>
            <Select
              value={culturalDecisionMaking}
              onValueChange={(value: 'individual' | 'consultative' | 'collective') => setCulturalDecisionMaking(value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual - I make my own decisions</SelectItem>
                <SelectItem value="consultative">Consultative - I make decisions after consulting family</SelectItem>
                <SelectItem value="collective">Collective - Family makes decisions together</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Family Members</span>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={handleAddMember}>
                  Add Member
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Family member name"
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select
                    value={newMember.relationship}
                    onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="extended">Extended Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cultural Role</Label>
                  <Select
                    value={newMember.culturalRole}
                    onValueChange={(value) => setNewMember({ ...newMember, culturalRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elder">Elder/Wisdom Keeper</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="supporter">Emotional Supporter</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="peer">Peer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Involvement</Label>
                  <Select
                    value={newMember.involvementLevel}
                    onValueChange={(value: 'observer' | 'participant' | 'decision_maker') => 
                      setNewMember({ ...newMember, involvementLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="observer">Observer</SelectItem>
                      <SelectItem value="participant">Participant</SelectItem>
                      <SelectItem value="decision_maker">Decision Maker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {familyMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="capitalize">{member.relationship}</span>
                        <span>•</span>
                        <span className="capitalize">{member.culturalRole}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {member.involvementLevel.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Family Contact</CardTitle>
            <p className="text-sm text-muted-foreground">
              Who should we contact in case of a therapy-related emergency?
            </p>
          </CardHeader>
          <CardContent>
            <Input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Name and contact information"
              disabled={!isEditing}
            />
          </CardContent>
        </Card>

        {/* Family Therapy Consent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Family Therapy Consent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={familyTherapyConsent}
                onCheckedChange={(checked) => setFamilyTherapyConsent(checked === true)}
                disabled={!isEditing}
              />
              <Label className="text-sm">
                I consent to including family members in therapy sessions when culturally appropriate and beneficial for my healing process.
              </Label>
            </div>
            
            {familyTherapyConsent && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Family Therapy Benefits:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Culturally-aligned healing approach</li>
                      <li>Enhanced family understanding and support</li>
                      <li>Strengthened family relationships</li>
                      <li>Collective problem-solving and resilience building</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturalFamilyIntegration;