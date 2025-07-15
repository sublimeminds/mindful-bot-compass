import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, GraduationCap, Heart, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChildhoodHistoryStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

interface Country {
  id: string;
  name: string;
  country_code: string;
}

const ChildhoodHistoryStep = ({ onNext, onBack, onboardingData }: ChildhoodHistoryStepProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [childhoodCountry, setChildhoodCountry] = useState('');
  const [familyStructure, setFamilyStructure] = useState('');
  const [familyDynamics, setFamilyDynamics] = useState('');
  const [significantEvents, setSignificantEvents] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState('');
  const [childhoodDescription, setChildhoodDescription] = useState('');
  const [parentingStyle, setParentingStyle] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await supabase
        .from('countries')
        .select('id, name, country_code')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setCountries(data);
      }
    };

    fetchCountries();
  }, []);

  const familyStructures = [
    'Nuclear family (two parents)',
    'Single parent household',
    'Extended family (grandparents, etc.)',
    'Blended family (step-parents/siblings)',
    'Adoptive family',
    'Foster care',
    'Other arrangement'
  ];

  const parentingStyles = [
    'Supportive and nurturing',
    'Strict but caring',
    'Permissive/lenient',
    'Inconsistent',
    'Emotionally distant',
    'Authoritarian/controlling',
    'Neglectful',
    'Mixed/varied between parents'
  ];

  const significantEventOptions = [
    'Parents\' divorce/separation',
    'Death of family member',
    'Moving frequently',
    'Financial difficulties',
    'Bullying at school',
    'Academic struggles',
    'Health issues',
    'Family conflict',
    'Cultural displacement',
    'Trauma or abuse',
    'Positive achievements',
    'Strong friendships'
  ];

  const handleEventToggle = (event: string) => {
    setSignificantEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const handleSubmit = () => {
    const childhoodData = {
      childhoodHistory: {
        childhoodCountry,
        familyStructure,
        familyDynamics,
        significantEvents,
        educationLevel,
        childhoodDescription,
        parentingStyle
      }
    };

    onNext(childhoodData);
  };

  const isComplete = childhoodCountry && familyStructure && familyDynamics && educationLevel;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Childhood & Early Life History</h2>
        <p className="text-muted-foreground">
          Understanding your background helps us provide culturally sensitive and personalized therapy
        </p>
      </div>

      {/* Childhood Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Where did you spend most of your childhood?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={childhoodCountry} onValueChange={setChildhoodCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country where you grew up" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.country_code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Family Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-green-600" />
            <span>Family Structure During Childhood</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={familyStructure} onValueChange={setFamilyStructure}>
            <div className="space-y-2">
              {familyStructures.map((structure) => (
                <div key={structure} className="flex items-center space-x-2">
                  <RadioGroupItem value={structure} id={structure} />
                  <Label htmlFor={structure} className="cursor-pointer">{structure}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Parenting Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>How would you describe your primary caregiver's parenting style?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={parentingStyle} onValueChange={setParentingStyle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {parentingStyles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={style} />
                  <Label htmlFor={style} className="cursor-pointer text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Family Dynamics */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Family Dynamics</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={familyDynamics} onValueChange={setFamilyDynamics}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_positive" id="very_positive" />
                <Label htmlFor="very_positive">Very positive and supportive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostly_positive" id="mostly_positive" />
                <Label htmlFor="mostly_positive">Mostly positive with some challenges</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed">Mixed - both positive and negative aspects</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostly_negative" id="mostly_negative" />
                <Label htmlFor="mostly_negative">Mostly challenging or difficult</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_negative" id="very_negative" />
                <Label htmlFor="very_negative">Very difficult or traumatic</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Education Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <span>Highest Education Level Completed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={educationLevel} onValueChange={setEducationLevel}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="primary" id="primary" />
                <Label htmlFor="primary">Primary/Elementary School</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="secondary" id="secondary" />
                <Label htmlFor="secondary">High School/Secondary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="some_college" id="some_college" />
                <Label htmlFor="some_college">Some College/University</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bachelors" id="bachelors" />
                <Label htmlFor="bachelors">Bachelor's Degree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masters" id="masters" />
                <Label htmlFor="masters">Master's Degree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctorate" id="doctorate" />
                <Label htmlFor="doctorate">Doctorate/PhD</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Significant Childhood Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Significant Childhood Experiences (Optional)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select any that apply to your childhood experience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {significantEventOptions.map((event) => (
              <div
                key={event}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  significantEvents.includes(event)
                    ? 'bg-harmony-50 border-harmony-300 dark:bg-harmony-950 dark:border-harmony-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleEventToggle(event)}
              >
                <Checkbox
                  checked={significantEvents.includes(event)}
                  onChange={() => handleEventToggle(event)}
                />
                <Label className="text-sm cursor-pointer">{event}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Childhood Description */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details About Your Childhood (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share any additional details about your childhood that might be relevant to your therapy journey..."
            value={childhoodDescription}
            onChange={(e) => setChildhoodDescription(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Summary */}
      {significantEvents.length > 0 && (
        <Card className="bg-harmony-50 dark:bg-harmony-950">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3">Selected childhood experiences:</h4>
            <div className="flex flex-wrap gap-2">
              {significantEvents.map(event => (
                <Badge key={event} variant="secondary" className="text-xs">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isComplete}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChildhoodHistoryStep;