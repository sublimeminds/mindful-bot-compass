
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Globe, Users, MessageCircle, Brain, Heart, Target, Flower, Palette, TreePine, Mountain, Handshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    { 
      name: 'Culturally-adapted CBT', 
      icon: Brain, 
      description: 'Cognitive-behavioral therapy adapted to your cultural context' 
    },
    { 
      name: 'Narrative Therapy', 
      icon: Heart, 
      description: 'Focus on your personal story and cultural identity' 
    },
    { 
      name: 'Family Systems Therapy', 
      icon: Users, 
      description: 'Therapy that includes family and cultural dynamics' 
    },
    { 
      name: 'Mindfulness-based approaches', 
      icon: Flower, 
      description: 'Meditation and mindfulness practices from various traditions' 
    },
    { 
      name: 'Somatic Therapy', 
      icon: Target, 
      description: 'Body-based therapy recognizing cultural trauma patterns' 
    },
    { 
      name: 'Art/Creative Therapy', 
      icon: Palette, 
      description: 'Creative expression honoring cultural artistic traditions' 
    },
    { 
      name: 'Traditional healing integration', 
      icon: TreePine, 
      description: 'Combining therapy with traditional cultural healing practices' 
    },
    { 
      name: 'Community-based approaches', 
      icon: Handshake, 
      description: 'Therapy that considers community and collective wellbeing' 
    }
  ];

  const culturalSensitivities = [
    { 
      name: 'Gender roles and expectations', 
      icon: Users, 
      description: 'Understanding cultural gender norms and expectations' 
    },
    { 
      name: 'Family hierarchy and respect', 
      icon: Mountain, 
      description: 'Honoring family structure and respect traditions' 
    },
    { 
      name: 'Religious/spiritual practices', 
      icon: TreePine, 
      description: 'Integrating faith and spiritual beliefs in therapy' 
    },
    { 
      name: 'Language barriers', 
      icon: MessageCircle, 
      description: 'Addressing communication challenges and language needs' 
    },
    { 
      name: 'Immigration/acculturation stress', 
      icon: Globe, 
      description: 'Support for cultural transition and adaptation challenges' 
    },
    { 
      name: 'Intergenerational trauma', 
      icon: Heart, 
      description: 'Healing trauma passed down through generations' 
    },
    { 
      name: 'Discrimination experiences', 
      icon: Target, 
      description: 'Addressing impacts of discrimination and bias' 
    },
    { 
      name: 'Cultural identity conflicts', 
      icon: Brain, 
      description: 'Navigating between different cultural identities' 
    }
  ];

  useEffect(() => {
    onPreferencesChange(localPreferences);
  }, [localPreferences, onPreferencesChange]);

  const handleSubmit = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to save preferences');
        return;
      }

      // Use the safe upsert function to save cultural profile
      const { data, error } = await supabase.rpc('upsert_user_cultural_profile', {
        p_user_id: user.id,
        p_cultural_background: localPreferences.culturalBackground || null,
        p_primary_language: localPreferences.primaryLanguage || 'en',
        p_family_structure: localPreferences.familyStructure || 'individual',
        p_communication_style: localPreferences.communicationStyle || 'direct',
        p_religious_considerations: localPreferences.religiousConsiderations || false,
        p_religious_details: localPreferences.religiousDetails || null,
        p_therapy_approach_preferences: localPreferences.therapyApproachPreferences || [],
        p_cultural_sensitivities: localPreferences.culturalSensitivities || []
      });

      if (error) {
        console.error('Error saving cultural profile:', error);
        toast.error('Failed to save cultural preferences');
        return;
      }

      onNext({ culturalPreferences: localPreferences });
    } catch (error) {
      console.error('Error saving cultural profile:', error);
      toast.error('Failed to save cultural preferences');
    }
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
            <Label>{t('onboarding.cultural.background')} <span className="text-muted-foreground">(Optional)</span></Label>
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
            <Label>Preferred Therapy Approaches <span className="text-muted-foreground">(Optional)</span></Label>
            <div className="grid grid-cols-1 gap-3">
              {therapyApproaches.map(approach => {
                const IconComponent = approach.icon;
                return (
                  <div 
                    key={approach.name} 
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      localPreferences.therapyApproachPreferences.includes(approach.name)
                        ? 'bg-harmony-50 border-harmony-300 dark:bg-harmony-950 dark:border-harmony-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                    onClick={() => {
                      const newPreferences = localPreferences.therapyApproachPreferences.includes(approach.name)
                        ? localPreferences.therapyApproachPreferences.filter(p => p !== approach.name)
                        : [...localPreferences.therapyApproachPreferences, approach.name];
                      updatePreferences('therapyApproachPreferences', newPreferences);
                    }}
                  >
                    <Checkbox
                      id={approach.name}
                      checked={localPreferences.therapyApproachPreferences.includes(approach.name)}
                      onCheckedChange={(checked) => {
                        const newPreferences = checked
                          ? [...localPreferences.therapyApproachPreferences, approach.name]
                          : localPreferences.therapyApproachPreferences.filter(p => p !== approach.name);
                        updatePreferences('therapyApproachPreferences', newPreferences);
                      }}
                    />
                    <IconComponent className="h-5 w-5 text-harmony-600 dark:text-harmony-400 mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={approach.name} className="text-sm font-medium cursor-pointer">
                        {approach.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {approach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cultural Sensitivities */}
          <div className="space-y-3">
            <Label>Cultural Considerations & Sensitivities <span className="text-muted-foreground">(Optional)</span></Label>
            <p className="text-sm text-muted-foreground">
              Select areas that are important to consider in your therapy
            </p>
            <div className="grid grid-cols-1 gap-3">
              {culturalSensitivities.map(sensitivity => {
                const IconComponent = sensitivity.icon;
                return (
                  <div 
                    key={sensitivity.name} 
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      localPreferences.culturalSensitivities.includes(sensitivity.name)
                        ? 'bg-flow-50 border-flow-300 dark:bg-flow-950 dark:border-flow-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                    onClick={() => {
                      const newSensitivities = localPreferences.culturalSensitivities.includes(sensitivity.name)
                        ? localPreferences.culturalSensitivities.filter(s => s !== sensitivity.name)
                        : [...localPreferences.culturalSensitivities, sensitivity.name];
                      updatePreferences('culturalSensitivities', newSensitivities);
                    }}
                  >
                    <Checkbox
                      id={sensitivity.name}
                      checked={localPreferences.culturalSensitivities.includes(sensitivity.name)}
                      onCheckedChange={(checked) => {
                        const newSensitivities = checked
                          ? [...localPreferences.culturalSensitivities, sensitivity.name]
                          : localPreferences.culturalSensitivities.filter(s => s !== sensitivity.name);
                        updatePreferences('culturalSensitivities', newSensitivities);
                      }}
                    />
                    <IconComponent className="h-5 w-5 text-flow-600 dark:text-flow-400 mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={sensitivity.name} className="text-sm font-medium cursor-pointer">
                        {sensitivity.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {sensitivity.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <GradientButton onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </GradientButton>
        <GradientButton onClick={handleSubmit}>
          {t('common.continue')}
        </GradientButton>
      </div>
    </div>
  );
};

export default CulturalPreferencesStep;
