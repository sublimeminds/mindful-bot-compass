
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Globe, Users, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CulturalPreferencesStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
}

const CulturalPreferencesStep = ({ 
  onNext, 
  onBack, 
  preferences,
  onPreferencesChange 
}: CulturalPreferencesStepProps) => {
  const { t } = useTranslation();
  const [localPreferences, setLocalPreferences] = useState({
    primaryLanguage: 'en',
    culturalBackground: '',
    familyStructure: 'individual',
    communicationStyle: 'direct',
    religiousConsiderations: false,
    religiousDetails: '',
    therapyApproachPreferences: [],
    culturalSensitivities: [],
    ...preferences
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pt', name: 'Português' }
  ];

  const culturalBackgrounds = [
    'Western/European',
    'East Asian',
    'South Asian',
    'Middle Eastern',
    'African',
    'Latin American',
    'Indigenous',
    'Mixed/Multicultural',
    'Other'
  ];

  const familyStructures = [
    { value: 'individual', label: 'Individual' },
    { value: 'nuclear', label: 'Nuclear Family' },
    { value: 'extended', label: 'Extended Family' },
    { value: 'single_parent', label: 'Single Parent' },
    { value: 'blended', label: 'Blended Family' },
    { value: 'chosen_family', label: 'Chosen Family' }
  ];

  const communicationStyles = [
    { value: 'direct', label: 'Direct & Straightforward' },
    { value: 'indirect', label: 'Indirect & Contextual' },
    { value: 'formal', label: 'Formal & Respectful' },
    { value: 'casual', label: 'Casual & Relaxed' },
    { value: 'high_context', label: 'High Context (Reading between lines)' },
    { value: 'low_context', label: 'Low Context (Explicit communication)' }
  ];

  const therapyApproaches = [
    'Culturally-adapted CBT',
    'Narrative Therapy',
    'Family Systems Therapy',
    'Mindfulness-based approaches',
    'Somatic Therapy',
    'Art/Creative Therapy',
    'Traditional healing integration',
    'Community-based approaches'
  ];

  const culturalSensitivities = [
    'Gender roles and expectations',
    'Family hierarchy and respect',
    'Religious/spiritual practices',
    'Language barriers',
    'Immigration/acculturation stress',
    'Intergenerational trauma',
    'Discrimination experiences',
    'Cultural identity conflicts'
  ];

  useEffect(() => {
    onPreferencesChange(localPreferences);
  }, [localPreferences, onPreferencesChange]);

  const handleSubmit = () => {
    onNext({ culturalPreferences: localPreferences });
  };

  const updatePreferences = (key: string, value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>{t('onboarding.cultural.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Language */}
          <div className="space-y-2">
            <Label>{t('onboarding.cultural.primaryLanguage')}</Label>
            <Select 
              value={localPreferences.primaryLanguage} 
              onValueChange={(value) => updatePreferences('primaryLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cultural Background */}
          <div className="space-y-2">
            <Label>{t('onboarding.cultural.background')}</Label>
            <Select 
              value={localPreferences.culturalBackground} 
              onValueChange={(value) => updatePreferences('culturalBackground', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your cultural background" />
              </SelectTrigger>
              <SelectContent>
                {culturalBackgrounds.map(bg => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Family Structure */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t('onboarding.cultural.familyStructure')}</span>
            </Label>
            <Select 
              value={localPreferences.familyStructure} 
              onValueChange={(value) => updatePreferences('familyStructure', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {familyStructures.map(structure => (
                  <SelectItem key={structure.value} value={structure.value}>
                    {structure.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Communication Style */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>{t('onboarding.cultural.communicationStyle')}</span>
            </Label>
            <Select 
              value={localPreferences.communicationStyle} 
              onValueChange={(value) => updatePreferences('communicationStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {communicationStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Religious Considerations */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="religious"
                checked={localPreferences.religiousConsiderations}
                onCheckedChange={(checked) => updatePreferences('religiousConsiderations', checked)}
              />
              <Label htmlFor="religious">
                {t('onboarding.cultural.religiousConsiderations')}
              </Label>
            </div>
            
            {localPreferences.religiousConsiderations && (
              <div className="space-y-2">
                <Label>Please specify any religious or spiritual considerations</Label>
                <Textarea
                  value={localPreferences.religiousDetails}
                  onChange={(e) => updatePreferences('religiousDetails', e.target.value)}
                  placeholder="e.g., Prayer times, dietary restrictions, specific beliefs to consider..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Therapy Approach Preferences */}
          <div className="space-y-3">
            <Label>Preferred Therapy Approaches</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {therapyApproaches.map(approach => (
                <div key={approach} className="flex items-center space-x-2">
                  <Checkbox
                    id={approach}
                    checked={localPreferences.therapyApproachPreferences.includes(approach)}
                    onCheckedChange={(checked) => {
                      const newPreferences = checked
                        ? [...localPreferences.therapyApproachPreferences, approach]
                        : localPreferences.therapyApproachPreferences.filter(p => p !== approach);
                      updatePreferences('therapyApproachPreferences', newPreferences);
                    }}
                  />
                  <Label htmlFor={approach} className="text-sm">
                    {approach}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Sensitivities */}
          <div className="space-y-3">
            <Label>Cultural Considerations & Sensitivities</Label>
            <p className="text-sm text-muted-foreground">
              Select areas that are important to consider in your therapy
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {culturalSensitivities.map(sensitivity => (
                <div key={sensitivity} className="flex items-center space-x-2">
                  <Checkbox
                    id={sensitivity}
                    checked={localPreferences.culturalSensitivities.includes(sensitivity)}
                    onCheckedChange={(checked) => {
                      const newSensitivities = checked
                        ? [...localPreferences.culturalSensitivities, sensitivity]
                        : localPreferences.culturalSensitivities.filter(s => s !== sensitivity);
                      updatePreferences('culturalSensitivities', newSensitivities);
                    }}
                  />
                  <Label htmlFor={sensitivity} className="text-sm">
                    {sensitivity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <Button onClick={handleSubmit}>
          {t('common.continue')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CulturalPreferencesStep;
