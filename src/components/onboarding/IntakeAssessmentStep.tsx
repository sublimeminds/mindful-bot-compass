
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Heart, Brain, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface IntakeData {
  // Demographics
  age: number | '';
  gender: string;
  cultural_background: string;
  location: string;
  
  // Health History
  medical_conditions: string[];
  current_medications: string[];
  sleep_hours_avg: number | '';
  exercise_frequency: string;
  diet_quality: string;
  
  // Mental Health History
  previous_therapy: boolean;
  previous_therapy_details: string;
  mental_health_diagnoses: string[];
  family_mental_health_history: string;
  hospitalization_history: boolean;
  
  // Social Context
  relationship_status: string;
  living_situation: string;
  employment_status: string;
  financial_stress_level: number | '';
  social_support_level: number | '';
  
  // Additional Context
  primary_concerns: string[];
  therapy_goals: string[];
  preferred_communication_style: string;
  session_frequency_preference: string;
}

interface IntakeAssessmentStepProps {
  onNext: () => void;
  onBack: () => void;
}

const IntakeAssessmentStep = ({ onNext, onBack }: IntakeAssessmentStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  const [intakeData, setIntakeData] = useState<IntakeData>({
    age: '',
    gender: '',
    cultural_background: '',
    location: '',
    medical_conditions: [],
    current_medications: [],
    sleep_hours_avg: '',
    exercise_frequency: '',
    diet_quality: '',
    previous_therapy: false,
    previous_therapy_details: '',
    mental_health_diagnoses: [],
    family_mental_health_history: '',
    hospitalization_history: false,
    relationship_status: '',
    living_situation: '',
    employment_status: '',
    financial_stress_level: '',
    social_support_level: '',
    primary_concerns: [],
    therapy_goals: [],
    preferred_communication_style: '',
    session_frequency_preference: ''
  });

  const sections = [
    { title: 'Demographics', icon: Users, fields: ['age', 'gender', 'cultural_background', 'location'] },
    { title: 'Health History', icon: Heart, fields: ['medical_conditions', 'current_medications', 'sleep_hours_avg', 'exercise_frequency', 'diet_quality'] },
    { title: 'Mental Health', icon: Brain, fields: ['previous_therapy', 'mental_health_diagnoses', 'family_mental_health_history'] },
    { title: 'Social Context', icon: Shield, fields: ['relationship_status', 'living_situation', 'employment_status', 'financial_stress_level', 'social_support_level'] }
  ];

  const handleInputChange = (field: keyof IntakeData, value: any) => {
    setIntakeData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof IntakeData, value: string) => {
    const currentArray = intakeData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setIntakeData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_intake_data')
        .insert({
          user_id: user.id,
          ...intakeData,
          age: intakeData.age || null,
          sleep_hours_avg: intakeData.sleep_hours_avg || null,
          financial_stress_level: intakeData.financial_stress_level || null,
          social_support_level: intakeData.social_support_level || null
        });

      if (error) throw error;

      toast({
        title: "Intake Assessment Complete",
        description: "Your information has been saved securely. We'll use this to personalize your therapy experience.",
      });

      onNext();
    } catch (error) {
      console.error('Error saving intake data:', error);
      toast({
        title: "Error",
        description: "Failed to save your intake data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDemographicsSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={intakeData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
            placeholder="Enter your age"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={intakeData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="cultural_background">Cultural Background</Label>
        <Input
          id="cultural_background"
          value={intakeData.cultural_background}
          onChange={(e) => handleInputChange('cultural_background', e.target.value)}
          placeholder="e.g., African American, Hispanic, Asian, etc."
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location (City, State/Country)</Label>
        <Input
          id="location"
          value={intakeData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., New York, NY"
        />
      </div>
    </div>
  );

  const renderHealthHistorySection = () => (
    <div className="space-y-4">
      <div>
        <Label>Current Medical Conditions</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Diabetes', 'Hypertension', 'Heart Disease', 'Chronic Pain', 'Autoimmune Disorder', 'Other'].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                checked={intakeData.medical_conditions.includes(condition)}
                onCheckedChange={() => handleArrayChange('medical_conditions', condition)}
              />
              <Label className="text-sm">{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sleep_hours">Average Sleep Hours</Label>
          <Input
            id="sleep_hours"
            type="number"
            step="0.5"
            value={intakeData.sleep_hours_avg}
            onChange={(e) => handleInputChange('sleep_hours_avg', parseFloat(e.target.value) || '')}
            placeholder="7.5"
          />
        </div>
        <div>
          <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
          <Select value={intakeData.exercise_frequency} onValueChange={(value) => handleInputChange('exercise_frequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="1-2-times-week">1-2 times per week</SelectItem>
              <SelectItem value="3-4-times-week">3-4 times per week</SelectItem>
              <SelectItem value="5-6-times-week">5-6 times per week</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="diet_quality">Diet Quality</Label>
        <Select value={intakeData.diet_quality} onValueChange={(value) => handleInputChange('diet_quality', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Rate your diet quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="poor">Poor</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderMentalHealthSection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={intakeData.previous_therapy}
          onCheckedChange={(checked) => handleInputChange('previous_therapy', checked)}
        />
        <Label>I have previously received therapy or counseling</Label>
      </div>

      {intakeData.previous_therapy && (
        <div>
          <Label htmlFor="therapy_details">Previous Therapy Details</Label>
          <Textarea
            id="therapy_details"
            value={intakeData.previous_therapy_details}
            onChange={(e) => handleInputChange('previous_therapy_details', e.target.value)}
            placeholder="Please describe your previous therapy experience..."
          />
        </div>
      )}

      <div>
        <Label>Mental Health Diagnoses (if any)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Depression', 'Anxiety', 'PTSD', 'Bipolar Disorder', 'ADHD', 'OCD', 'Eating Disorder', 'Other'].map((diagnosis) => (
            <div key={diagnosis} className="flex items-center space-x-2">
              <Checkbox
                checked={intakeData.mental_health_diagnoses.includes(diagnosis)}
                onCheckedChange={() => handleArrayChange('mental_health_diagnoses', diagnosis)}
              />
              <Label className="text-sm">{diagnosis}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="family_history">Family Mental Health History</Label>
        <Textarea
          id="family_history"
          value={intakeData.family_mental_health_history}
          onChange={(e) => handleInputChange('family_mental_health_history', e.target.value)}
          placeholder="Please describe any relevant family mental health history..."
        />
      </div>
    </div>
  );

  const renderSocialContextSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationship_status">Relationship Status</Label>
          <Select value={intakeData.relationship_status} onValueChange={(value) => handleInputChange('relationship_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="dating">Dating</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="complicated">It's complicated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="employment_status">Employment Status</Label>
          <Select value={intakeData.employment_status} onValueChange={(value) => handleInputChange('employment_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="disability">On disability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="living_situation">Living Situation</Label>
        <Select value={intakeData.living_situation} onValueChange={(value) => handleInputChange('living_situation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select living situation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alone">Live alone</SelectItem>
            <SelectItem value="family">With family</SelectItem>
            <SelectItem value="partner">With partner/spouse</SelectItem>
            <SelectItem value="roommates">With roommates</SelectItem>
            <SelectItem value="assisted">Assisted living</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="financial_stress">Financial Stress Level (1-10)</Label>
          <Input
            id="financial_stress"
            type="number"
            min="1"
            max="10"
            value={intakeData.financial_stress_level}
            onChange={(e) => handleInputChange('financial_stress_level', parseInt(e.target.value) || '')}
            placeholder="5"
          />
        </div>
        <div>
          <Label htmlFor="social_support">Social Support Level (1-10)</Label>
          <Input
            id="social_support"
            type="number"
            min="1"
            max="10"
            value={intakeData.social_support_level}
            onChange={(e) => handleInputChange('social_support_level', parseInt(e.target.value) || '')}
            placeholder="5"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: return renderDemographicsSection();
      case 1: return renderHealthHistorySection();
      case 2: return renderMentalHealthSection();
      case 3: return renderSocialContextSection();
      default: return null;
    }
  };

  const CurrentIcon = sections[currentSection].icon;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-harmony-100 text-harmony-600">
            <CurrentIcon className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Comprehensive Assessment</h2>
        <p className="text-muted-foreground">
          Help us understand you better to provide personalized therapy recommendations
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= currentSection ? 'bg-harmony-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CurrentIcon className="h-5 w-5" />
            <span>{sections[currentSection].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentSection()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentSection > 0 ? () => setCurrentSection(currentSection - 1) : onBack}
        >
          Back
        </Button>
        
        {currentSection < sections.length - 1 ? (
          <Button 
            onClick={() => setCurrentSection(currentSection + 1)}
            className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
          >
            Next Section
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
          >
            {isLoading ? 'Saving...' : 'Complete Assessment'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntakeAssessmentStep;
