
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Users, MessageCircle, Heart, Info, Languages } from "lucide-react";

interface CulturalPreferences {
  primaryLanguage: string;
  culturalBackground: string;
  familyStructure: 'individual' | 'family-centered' | 'community-based' | 'collective';
  communicationStyle: 'direct' | 'indirect' | 'high-context' | 'low-context';
  religiousConsiderations: boolean;
  religiousDetails?: string;
  therapyApproachPreferences: string[];
  culturalSensitivities: string[];
}

interface CulturalPreferencesStepProps {
  preferences: CulturalPreferences;
  onPreferencesChange: (preferences: CulturalPreferences) => void;
  onNext: () => void;
  onBack: () => void;
}

const culturalBackgroundOptions = [
  { value: 'western', label: 'Western/European' },
  { value: 'east-asian', label: 'East Asian' },
  { value: 'south-asian', label: 'South Asian' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
  { value: 'african', label: 'African' },
  { value: 'latin-american', label: 'Latin American' },
  { value: 'indigenous', label: 'Indigenous' },
  { value: 'mixed', label: 'Mixed Heritage' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const therapyApproaches = [
  { id: 'cbt', label: 'Cognitive Behavioral Therapy (CBT)', description: 'Focus on thoughts and behaviors' },
  { id: 'dbt', label: 'Dialectical Behavior Therapy (DBT)', description: 'Mindfulness and emotional regulation' },
  { id: 'family-therapy', label: 'Family-Centered Approach', description: 'Involve family and community support' },
  { id: 'mindfulness', label: 'Mindfulness-Based Therapy', description: 'Focus on present-moment awareness' },
  { id: 'spiritual', label: 'Spiritually-Integrated Therapy', description: 'Include spiritual/religious elements' },
  { id: 'somatic', label: 'Somatic Therapy', description: 'Body-based healing approaches' }
];

const CulturalPreferencesStep = ({ 
  preferences, 
  onPreferencesChange, 
  onNext, 
  onBack 
}: CulturalPreferencesStepProps) => {
  const [currentPreferences, setCurrentPreferences] = useState<CulturalPreferences>(preferences);

  const updatePreference = (key: keyof CulturalPreferences, value: any) => {
    const updated = { ...currentPreferences, [key]: value };
    setCurrentPreferences(updated);
    onPreferencesChange(updated);
  };

  const toggleTherapyApproach = (approachId: string) => {
    const current = currentPreferences.therapyApproachPreferences || [];
    const updated = current.includes(approachId)
      ? current.filter(id => id !== approachId)
      : [...current, approachId];
    updatePreference('therapyApproachPreferences', updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Cultural Preferences</h2>
        <p className="text-muted-foreground mb-4">
          Help us provide more culturally-aware and personalized therapy. All information is optional and confidential.
        </p>
      </div>

      <div className="bg-harmony-50 p-4 rounded-lg border border-harmony-200 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-harmony-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-harmony-800">
            <p className="font-medium mb-1">Cultural Sensitivity:</p>
            <p>This information helps our AI provide more culturally-appropriate responses and therapy approaches. You can skip any questions or change these settings anytime.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Primary Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="h-5 w-5" />
              <span>Language Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Primary Language for Therapy</Label>
              <Select value={currentPreferences.primaryLanguage} onValueChange={(value) => updatePreference('primaryLanguage', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your preferred language" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                  <SelectItem value="fr">French (Français)</SelectItem>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                  <SelectItem value="ar">Arabic (العربية)</SelectItem>
                  <SelectItem value="zh">Chinese (中文)</SelectItem>
                  <SelectItem value="ja">Japanese (日本語)</SelectItem>
                  <SelectItem value="ko">Korean (한국어)</SelectItem>
                  <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="pt">Portuguese (Português)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Background */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Cultural Background</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cultural or Ethnic Background (Optional)</Label>
              <Select value={currentPreferences.culturalBackground} onValueChange={(value) => updatePreference('culturalBackground', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your cultural background" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {culturalBackgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Family Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Family & Community Orientation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">How do you prefer to approach personal challenges?</Label>
              <RadioGroup 
                value={currentPreferences.familyStructure} 
                onValueChange={(value) => updatePreference('familyStructure', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="individual" id="individual" className="mt-1" />
                  <Label htmlFor="individual" className="flex-1">
                    <div className="font-medium">Individual-focused</div>
                    <div className="text-sm text-muted-foreground">I prefer to work through things independently</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="family-centered" id="family-centered" className="mt-1" />
                  <Label htmlFor="family-centered" className="flex-1">
                    <div className="font-medium">Family-centered</div>
                    <div className="text-sm text-muted-foreground">My family's input and support is important</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="community-based" id="community-based" className="mt-1" />
                  <Label htmlFor="community-based" className="flex-1">
                    <div className="font-medium">Community-based</div>
                    <div className="text-sm text-muted-foreground">I value community and social support</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="collective" id="collective" className="mt-1" />
                  <Label htmlFor="collective" className="flex-1">
                    <div className="font-medium">Collective approach</div>
                    <div className="text-sm text-muted-foreground">Group harmony and collective well-being is priority</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Communication Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Communication Style</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">How do you prefer to communicate about personal matters?</Label>
              <RadioGroup 
                value={currentPreferences.communicationStyle} 
                onValueChange={(value) => updatePreference('communicationStyle', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="direct" id="direct" className="mt-1" />
                  <Label htmlFor="direct" className="flex-1">
                    <div className="font-medium">Direct communication</div>
                    <div className="text-sm text-muted-foreground">I prefer clear, straightforward conversations</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="indirect" id="indirect" className="mt-1" />
                  <Label htmlFor="indirect" className="flex-1">
                    <div className="font-medium">Indirect communication</div>
                    <div className="text-sm text-muted-foreground">I prefer gentle, subtle approaches</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="high-context" id="high-context" className="mt-1" />
                  <Label htmlFor="high-context" className="flex-1">
                    <div className="font-medium">High-context communication</div>
                    <div className="text-sm text-muted-foreground">Context and non-verbal cues are important</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="low-context" id="low-context" className="mt-1" />
                  <Label htmlFor="low-context" className="flex-1">
                    <div className="font-medium">Low-context communication</div>
                    <div className="text-sm text-muted-foreground">Explicit, detailed explanations work best</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Religious/Spiritual Considerations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Spiritual & Religious Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="religious-considerations"
                checked={currentPreferences.religiousConsiderations}
                onCheckedChange={(checked) => updatePreference('religiousConsiderations', checked)}
              />
              <Label htmlFor="religious-considerations" className="flex-1">
                I would like spiritual or religious considerations included in my therapy approach
              </Label>
            </div>
            
            {currentPreferences.religiousConsiderations && (
              <div>
                <Label className="text-sm font-medium">Spiritual/Religious Tradition (Optional)</Label>
                <Select value={currentPreferences.religiousDetails} onValueChange={(value) => updatePreference('religiousDetails', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your tradition" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="christianity">Christianity</SelectItem>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="judaism">Judaism</SelectItem>
                    <SelectItem value="hinduism">Hinduism</SelectItem>
                    <SelectItem value="buddhism">Buddhism</SelectItem>
                    <SelectItem value="sikhism">Sikhism</SelectItem>
                    <SelectItem value="spiritual-not-religious">Spiritual but not religious</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Therapy Approach Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred Therapy Approaches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select therapy approaches that resonate with you (you can choose multiple):
            </p>
            <div className="space-y-3">
              {therapyApproaches.map((approach) => (
                <div key={approach.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={approach.id}
                    checked={currentPreferences.therapyApproachPreferences?.includes(approach.id) || false}
                    onCheckedChange={() => toggleTherapyApproach(approach.id)}
                    className="mt-1"
                  />
                  <Label htmlFor={approach.id} className="flex-1">
                    <div className="font-medium">{approach.label}</div>
                    <div className="text-sm text-muted-foreground">{approach.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CulturalPreferencesStep;
