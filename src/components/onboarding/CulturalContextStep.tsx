import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Users, MessageCircle, Heart, BookOpen } from 'lucide-react';
import { CulturalContext } from '@/services/culturallyAwareAiService';

interface CulturalContextStepProps {
  onNext: (data: { culturalContext: CulturalContext, considerTraditionalHealing: boolean, preferCulturalMatching: boolean }) => void;
  onBack: () => void;
  onboardingData: any;
}

const CULTURAL_BACKGROUNDS = [
  { id: 'western-individualistic', name: 'Western/Individualistic', icon: '🏛️' },
  { id: 'latin-american', name: 'Latin American', icon: '🌎' },
  { id: 'east-asian', name: 'East Asian', icon: '🏯' },
  { id: 'south-asian', name: 'South Asian', icon: '🕌' },
  { id: 'middle-eastern', name: 'Middle Eastern', icon: '🏜️' },
  { id: 'african', name: 'African', icon: '🌍' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🏝️' },
  { id: 'nordic', name: 'Nordic', icon: '❄️' },
  { id: 'mixed-heritage', name: 'Mixed Heritage', icon: '🌈' },
  { id: 'prefer-not-to-say', name: 'Prefer not to say', icon: '🤐' }
];

const RELIGIOUS_BELIEFS = [
  'Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 
  'Sikhism', 'Spirituality', 'Agnosticism', 'Atheism', 
  'Indigenous beliefs', 'Other', 'Prefer not to say'
];

const COMMUNICATION_STYLES = [
  { id: 'direct', name: 'Direct & Straightforward', description: 'I prefer clear, direct communication' },
  { id: 'indirect', name: 'Gentle & Indirect', description: 'I prefer subtle, gentle approaches' },
  { id: 'high-context', name: 'Context-Rich', description: 'I communicate with cultural context and implications' },
  { id: 'low-context', name: 'Explicit & Clear', description: 'I prefer everything to be explicitly stated' }
];

const FAMILY_STRUCTURES = [
  { id: 'individual', name: 'Individual-Focused', description: 'Decisions are primarily personal' },
  { id: 'nuclear', name: 'Nuclear Family', description: 'Focus on immediate family unit' },
  { id: 'extended', name: 'Extended Family', description: 'Decisions involve extended family' },
  { id: 'collective', name: 'Community-Centered', description: 'Community plays a major role in decisions' }
];

const CulturalContextStep = ({ onNext, onBack }: CulturalContextStepProps) => {
  const { t, i18n } = useTranslation();
  const [culturalBackground, setCulturalBackground] = useState<string>('');
  const [religiousBeliefs, setReligiousBeliefs] = useState<string>('');
  const [communicationStyle, setCommunicationStyle] = useState<string>('');
  const [familyStructure, setFamilyStructure] = useState<string>('');
  const [considerTraditionalHealing, setConsiderTraditionalHealing] = useState<boolean>(false);
  const [preferCulturalMatching, setPreferCulturalMatching] = useState<boolean>(false);

  const isValid = culturalBackground && communicationStyle && familyStructure;

  const handleNext = () => {
    const culturalContext: CulturalContext = {
      language: i18n.language,
      region: navigator.language.split('-')[1] || 'unknown',
      culturalBackground,
      religiousBeliefs: religiousBeliefs || undefined,
      familyStructure: familyStructure as 'individual' | 'collective',
      communicationStyle: communicationStyle as 'direct' | 'indirect' | 'high-context' | 'low-context'
    };

    onNext({ 
      culturalContext,
      considerTraditionalHealing,
      preferCulturalMatching
    });
  };

  const handleTraditionalHealingChange = (checked: boolean | 'indeterminate') => {
    setConsiderTraditionalHealing(checked === true);
  };

  const handleCulturalMatchingChange = (checked: boolean | 'indeterminate') => {
    setPreferCulturalMatching(checked === true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-harmony-100 text-harmony-600">
            <Globe className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('onboarding.cultural.title', 'Cultural Context')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.cultural.subtitle', 'Help us understand your cultural background to provide more personalized support')}
        </p>
      </div>

      {/* Cultural Background */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{t('onboarding.cultural.background', 'Cultural Background')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CULTURAL_BACKGROUNDS.map((background) => (
              <button
                key={background.id}
                onClick={() => setCulturalBackground(background.id)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  culturalBackground === background.id
                    ? 'border-harmony-500 bg-harmony-50 text-harmony-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xl mb-1">{background.icon}</div>
                <div className="text-sm font-medium">{background.name}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Religious/Spiritual Beliefs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>{t('onboarding.cultural.beliefs', 'Religious/Spiritual Beliefs')}</span>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={religiousBeliefs} onValueChange={setReligiousBeliefs}>
            <SelectTrigger>
              <SelectValue placeholder="Select your beliefs (optional)" />
            </SelectTrigger>
            <SelectContent>
              {RELIGIOUS_BELIEFS.map((belief) => (
                <SelectItem key={belief} value={belief}>
                  {belief}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>{t('onboarding.cultural.communication', 'Communication Style')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {COMMUNICATION_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setCommunicationStyle(style.id)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  communicationStyle === style.id
                    ? 'border-harmony-500 bg-harmony-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-harmony-700">{style.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{style.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{t('onboarding.cultural.family', 'Family & Decision Making')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FAMILY_STRUCTURES.map((structure) => (
              <button
                key={structure.id}
                onClick={() => setFamilyStructure(structure.id)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  familyStructure === structure.id
                    ? 'border-harmony-500 bg-harmony-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-harmony-700">{structure.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{structure.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Preferences */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="traditional-healing"
              checked={considerTraditionalHealing}
              onCheckedChange={handleTraditionalHealingChange}
            />
            <label htmlFor="traditional-healing" className="text-sm">
              {t('onboarding.cultural.traditional', 'Consider traditional healing practices alongside modern therapy')}
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="cultural-matching"
              checked={preferCulturalMatching}
              onCheckedChange={handleCulturalMatchingChange}
            />
            <label htmlFor="cultural-matching" className="text-sm">
              {t('onboarding.cultural.matching', 'Prefer culturally-matched AI responses when possible')}
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {t('common.back')}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!isValid}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
};

export default CulturalContextStep;
