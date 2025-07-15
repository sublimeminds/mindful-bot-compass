import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Users, Accessibility } from 'lucide-react';

interface IdentityDiversityStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const IdentityDiversityStep = ({ onNext, onBack, onboardingData }: IdentityDiversityStepProps) => {
  const [genderIdentity, setGenderIdentity] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [lgbtqSupport, setLgbtqSupport] = useState(false);
  const [neurodiversity, setNeurodiversity] = useState<string[]>([]);
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>([]);
  const [culturalIdentity, setCulturalIdentity] = useState<string[]>([]);
  const [religiousIdentity, setReligiousIdentity] = useState('');
  const [additionalIdentities, setAdditionalIdentities] = useState('');

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Genderqueer', 
    'Transgender woman', 'Transgender man', 'Two-Spirit', 'Agender', 
    'Prefer not to say', 'Prefer to self-describe'
  ];

  const orientationOptions = [
    'Heterosexual/Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Asexual', 'Demisexual', 'Queer', 'Questioning', 'Prefer not to say'
  ];

  const neurodiversityOptions = [
    'ADHD', 'Autism/ASD', 'Dyslexia', 'Dyspraxia', 'Tourette\'s', 
    'OCD', 'Bipolar', 'Schizophrenia', 'Processing disorders', 'Other'
  ];

  const disabilityOptions = [
    'Physical disability', 'Visual impairment', 'Hearing impairment', 
    'Chronic illness', 'Invisible disability', 'Mobility issues', 'Other'
  ];

  const accessibilityOptions = [
    'Screen reader compatibility', 'Large text options', 'High contrast mode',
    'Keyboard navigation', 'Voice commands', 'Simplified interface', 
    'Frequent breaks/reminders', 'Alternative communication methods'
  ];

  const culturalOptions = [
    'African/African American', 'Asian/Asian American', 'Hispanic/Latino', 
    'Native American/Indigenous', 'Middle Eastern/North African', 
    'Pacific Islander', 'European/European American', 'Mixed/Multiracial', 
    'Other'
  ];

  const handleNeurodiversityChange = (option: string, checked: boolean) => {
    if (checked) {
      setNeurodiversity([...neurodiversity, option]);
    } else {
      setNeurodiversity(neurodiversity.filter(item => item !== option));
    }
  };

  const handleDisabilityChange = (option: string, checked: boolean) => {
    if (checked) {
      setDisabilities([...disabilities, option]);
    } else {
      setDisabilities(disabilities.filter(item => item !== option));
    }
  };

  const handleAccessibilityChange = (option: string, checked: boolean) => {
    if (checked) {
      setAccessibilityNeeds([...accessibilityNeeds, option]);
    } else {
      setAccessibilityNeeds(accessibilityNeeds.filter(item => item !== option));
    }
  };

  const handleCulturalChange = (option: string, checked: boolean) => {
    if (checked) {
      setCulturalIdentity([...culturalIdentity, option]);
    } else {
      setCulturalIdentity(culturalIdentity.filter(item => item !== option));
    }
  };

  const handleNext = () => {
    const data = {
      identityDiversity: {
        genderIdentity,
        sexualOrientation,
        lgbtqSupport,
        neurodiversity,
        disabilities,
        accessibilityNeeds,
        culturalIdentity,
        religiousIdentity,
        additionalIdentities
      }
    };
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Heart className="h-6 w-6 text-therapy-500" />
          <span>Identity & Diversity</span>
        </h2>
        <p className="text-muted-foreground">
          Help us understand your identity to provide inclusive, culturally-sensitive care. 
          All information is confidential and helps us match you with appropriate therapists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Identity & Sexual Orientation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Gender & Sexuality</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Gender Identity</Label>
              <Select value={genderIdentity} onValueChange={setGenderIdentity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender identity" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sexual Orientation</Label>
              <Select value={sexualOrientation} onValueChange={setSexualOrientation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sexual orientation" />
                </SelectTrigger>
                <SelectContent>
                  {orientationOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lgbtq-support" 
                checked={lgbtqSupport}
                onCheckedChange={(checked) => setLgbtqSupport(checked as boolean)}
              />
              <Label htmlFor="lgbtq-support">
                I would prefer LGBTQ+-affirming therapy approaches
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Neurodiversity & Disabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Neurodiversity & Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Neurodiversity (check all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {neurodiversityOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`neuro-${option}`}
                      checked={neurodiversity.includes(option)}
                      onCheckedChange={(checked) => handleNeurodiversityChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`neuro-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Disabilities or Conditions</Label>
              <div className="grid grid-cols-1 gap-2">
                {disabilityOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`disability-${option}`}
                      checked={disabilities.includes(option)}
                      onCheckedChange={(checked) => handleDisabilityChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`disability-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Needs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5" />
              <span>Accessibility Needs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Accessibility Features You Need</Label>
              <div className="grid grid-cols-1 gap-2">
                {accessibilityOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`access-${option}`}
                      checked={accessibilityNeeds.includes(option)}
                      onCheckedChange={(checked) => handleAccessibilityChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`access-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cultural & Religious Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Cultural & Religious Identity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cultural/Ethnic Background</Label>
              <div className="grid grid-cols-1 gap-2">
                {culturalOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cultural-${option}`}
                      checked={culturalIdentity.includes(option)}
                      onCheckedChange={(checked) => handleCulturalChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`cultural-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Religious/Spiritual Identity</Label>
              <Select value={religiousIdentity} onValueChange={setReligiousIdentity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your religious/spiritual identity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="christian">Christian</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="jewish">Jewish</SelectItem>
                  <SelectItem value="hindu">Hindu</SelectItem>
                  <SelectItem value="buddhist">Buddhist</SelectItem>
                  <SelectItem value="spiritual">Spiritual but not religious</SelectItem>
                  <SelectItem value="agnostic">Agnostic</SelectItem>
                  <SelectItem value="atheist">Atheist</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Identity Considerations</Label>
              <Textarea
                placeholder="Share any other aspects of your identity that are important for your therapy experience..."
                value={additionalIdentities}
                onChange={(e) => setAdditionalIdentities(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Identities Summary */}
      {(genderIdentity || sexualOrientation || neurodiversity.length > 0 || culturalIdentity.length > 0) && (
        <Card className="bg-therapy-50 border-therapy-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Identity Summary</h3>
            <div className="flex flex-wrap gap-2">
              {genderIdentity && (
                <Badge variant="secondary">{genderIdentity}</Badge>
              )}
              {sexualOrientation && (
                <Badge variant="secondary">{sexualOrientation}</Badge>
              )}
              {neurodiversity.map(item => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
              {culturalIdentity.map(item => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
              {lgbtqSupport && (
                <Badge variant="secondary">LGBTQ+-Affirming Care</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-therapy-500 hover:bg-therapy-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default IdentityDiversityStep;