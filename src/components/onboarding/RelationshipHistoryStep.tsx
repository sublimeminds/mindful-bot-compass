import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, MessageCircle, Shield, Phone, Frown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StepValidation } from '@/components/ui/StepValidation';
import GradientButton from '@/components/ui/GradientButton';

interface RelationshipHistoryStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const RelationshipHistoryStep = ({ onNext, onBack, onboardingData }: RelationshipHistoryStepProps) => {
  const [relationshipStatus, setRelationshipStatus] = useState(onboardingData?.relationshipHistory?.relationshipStatus || '');
  const [relationshipSatisfaction, setRelationshipSatisfaction] = useState(onboardingData?.relationshipHistory?.relationshipSatisfaction || 5);
  const [attachmentStyle, setAttachmentStyle] = useState(onboardingData?.relationshipHistory?.attachmentStyle || '');
  const [socialSupport, setSocialSupport] = useState(onboardingData?.relationshipHistory?.socialSupport || 5);
  const [communicationStyle, setCommunicationStyle] = useState(onboardingData?.relationshipHistory?.communicationStyle || '');
  const [relationshipChallenges, setRelationshipChallenges] = useState<string[]>(onboardingData?.relationshipHistory?.relationshipChallenges || []);
  const [conflictResolution, setConflictResolution] = useState(onboardingData?.relationshipHistory?.conflictResolution || '');
  const [socialAnxiety, setSocialAnxiety] = useState(onboardingData?.relationshipHistory?.socialAnxiety || '');
  const [relationshipGoals, setRelationshipGoals] = useState(onboardingData?.relationshipHistory?.relationshipGoals || '');
  const [supportNetwork, setSupportNetwork] = useState<string[]>(onboardingData?.relationshipHistory?.supportNetwork || []);

  const relationshipStatuses = [
    'Single, not dating',
    'Single, actively dating',
    'In a committed relationship',
    'Married/Partnership',
    'Divorced/Separated',
    'Widowed',
    'Complicated/Uncertain'
  ];

  const attachmentStyles = [
    { 
      id: 'secure', 
      label: 'Secure', 
      description: 'Comfortable with intimacy and autonomy' 
    },
    { 
      id: 'anxious', 
      label: 'Anxious-Preoccupied', 
      description: 'Need reassurance, worry about relationships' 
    },
    { 
      id: 'avoidant', 
      label: 'Dismissive-Avoidant', 
      description: 'Value independence, uncomfortable with closeness' 
    },
    { 
      id: 'fearful', 
      label: 'Fearful-Avoidant', 
      description: 'Want close relationships but fear getting hurt' 
    },
    { 
      id: 'unsure', 
      label: 'Unsure/Mixed', 
      description: 'Not sure or varies by relationship' 
    }
  ];

  const communicationStyles = [
    'Direct and honest',
    'Passive - avoid conflict',
    'Aggressive when upset',
    'Passive-aggressive',
    'Withdrawn/shut down',
    'Overly emotional',
    'Analytical/logical',
    'Varies by situation'
  ];

  const relationshipChallengeOptions = [
    'Trust issues',
    'Communication problems',
    'Intimacy/sexual concerns',
    'Financial disagreements',
    'Different life goals',
    'Family/in-law conflicts',
    'Jealousy/possessiveness',
    'Work-life balance',
    'Parenting disagreements',
    'Past relationship trauma',
    'Emotional availability',
    'Commitment fears'
  ];

  const conflictResolutionStyles = [
    'Talk through issues calmly',
    'Avoid conflict at all costs',
    'Arguments escalate quickly',
    'Give silent treatment',
    'Seek compromise',
    'One person usually gives in',
    'Bring in outside perspective',
    'Conflicts rarely get resolved'
  ];

  const socialAnxietyLevels = [
    'Very comfortable in social situations',
    'Generally comfortable with some nervousness',
    'Moderate anxiety in social settings',
    'High anxiety, avoid social situations',
    'Severe social anxiety, impacts daily life'
  ];

  const supportNetworkOptions = [
    'Close family members',
    'Best friend(s)',
    'Colleague/work friends',
    'Online communities',
    'Religious/spiritual community',
    'Support groups',
    'Neighbors',
    'Extended family',
    'Very few people',
    'Feel quite isolated'
  ];

  const handleChallengeToggle = (challenge: string) => {
    setRelationshipChallenges(prev =>
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleSupportToggle = (support: string) => {
    setSupportNetwork(prev => {
      if (support === 'Feel quite isolated' || support === 'Very few people') {
        return [support];
      }
      const filtered = prev.filter(s => s !== 'Feel quite isolated' && s !== 'Very few people');
      return prev.includes(support)
        ? filtered.filter(s => s !== support)
        : [...filtered, support];
    });
  };

  const handleSubmit = () => {
    const relationshipData = {
      relationshipHistory: {
        relationshipStatus,
        relationshipSatisfaction,
        attachmentStyle,
        socialSupport,
        communicationStyle,
        relationshipChallenges,
        conflictResolution,
        socialAnxiety,
        relationshipGoals,
        supportNetwork
      }
    };

    onNext(relationshipData);
  };

  const isComplete = relationshipStatus && attachmentStyle && communicationStyle && conflictResolution && socialAnxiety;

  // Validation fields for step validation component
  const validationFields = [
    { name: 'relationshipStatus', label: 'Relationship Status', isValid: !!relationshipStatus, isRequired: true },
    { name: 'attachmentStyle', label: 'Attachment Style', isValid: !!attachmentStyle, isRequired: true },
    { name: 'communicationStyle', label: 'Communication Style', isValid: !!communicationStyle, isRequired: true },
    { name: 'conflictResolution', label: 'Conflict Resolution', isValid: !!conflictResolution, isRequired: true },
    { name: 'socialAnxiety', label: 'Social Comfort Level', isValid: !!socialAnxiety, isRequired: true },
    { name: 'supportNetwork', label: 'Support Network', isValid: supportNetwork.length > 0, isRequired: false },
    { name: 'relationshipGoals', label: 'Relationship Goals', isValid: !!relationshipGoals, isRequired: false }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Relationships & Social History</h2>
        <p className="text-muted-foreground">
          Understanding your relationship patterns helps us address interpersonal concerns in therapy
        </p>
      </div>

      {/* Relationship Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Current Relationship Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={relationshipStatus} onValueChange={setRelationshipStatus}>
            <div className="space-y-2">
              {relationshipStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={status} />
                  <Label htmlFor={status} className="cursor-pointer">{status}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Relationship Satisfaction */}
      {relationshipStatus && !['Single, not dating', 'Widowed'].includes(relationshipStatus) && (
        <Card>
          <CardHeader>
            <CardTitle>Relationship Satisfaction (1-10)</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              defaultValue={[relationshipSatisfaction]}
              max={10}
              min={1}
              step={1}
              onValueChange={(value) => setRelationshipSatisfaction(value[0])}
            />
            <div className="text-sm text-muted-foreground text-center mt-2">
              Current satisfaction: {relationshipSatisfaction}/10
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachment Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Attachment Style in Relationships</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How do you typically behave in close relationships?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={attachmentStyle} onValueChange={setAttachmentStyle}>
            <div className="space-y-3">
              {attachmentStyles.map((style) => (
                <div key={style.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={style.id} className="cursor-pointer font-medium">
                      {style.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Social Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Social Support Level (1-10)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How supported do you feel by your social network?
          </p>
        </CardHeader>
        <CardContent>
          <Slider
            defaultValue={[socialSupport]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setSocialSupport(value[0])}
          />
          <div className="text-sm text-muted-foreground text-center mt-2">
            Current social support: {socialSupport}/10
          </div>
        </CardContent>
      </Card>

      {/* Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <span>Communication Style</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How do you typically communicate in relationships?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={communicationStyle} onValueChange={setCommunicationStyle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {communicationStyles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={style} />
                  <Label htmlFor={style} className="cursor-pointer text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Relationship Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Frown className="h-5 w-5 text-orange-600" />
            <span>Relationship Challenges (Optional)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select any areas that have been challenging in your relationships
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relationshipChallengeOptions.map((challenge) => (
              <div
                key={challenge}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  relationshipChallenges.includes(challenge)
                    ? 'bg-harmony-50 border-harmony-300 dark:bg-harmony-950 dark:border-harmony-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleChallengeToggle(challenge)}
              >
                <Checkbox
                  checked={relationshipChallenges.includes(challenge)}
                  onChange={() => handleChallengeToggle(challenge)}
                />
                <Label className="text-sm cursor-pointer">{challenge}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>How do you typically handle conflicts?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={conflictResolution} onValueChange={setConflictResolution}>
            <div className="space-y-2">
              {conflictResolutionStyles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={style} />
                  <Label htmlFor={style} className="cursor-pointer text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Social Anxiety */}
      <Card>
        <CardHeader>
          <CardTitle>Social Comfort Level</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={socialAnxiety} onValueChange={setSocialAnxiety}>
            <div className="space-y-2">
              {socialAnxietyLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="cursor-pointer text-sm">{level}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Support Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-indigo-600" />
            <span>Support Network</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Who do you turn to for support? (Select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportNetworkOptions.map((support) => (
              <div
                key={support}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  supportNetwork.includes(support)
                    ? 'bg-flow-50 border-flow-300 dark:bg-flow-950 dark:border-flow-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleSupportToggle(support)}
              >
                <Checkbox
                  checked={supportNetwork.includes(support)}
                  onChange={() => handleSupportToggle(support)}
                />
                <Label className="text-sm cursor-pointer">{support}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relationship Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Goals (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What would you like to improve about your relationships? What are your relationship goals?"
            value={relationshipGoals}
            onChange={(e) => setRelationshipGoals(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Summary of selections */}
      {(relationshipChallenges.length > 0 || supportNetwork.length > 0) && (
        <Card className="bg-harmony-50 dark:bg-harmony-950">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3">Summary:</h4>
            <div className="space-y-2">
              {relationshipChallenges.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Relationship challenges: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {relationshipChallenges.map(challenge => (
                      <Badge key={challenge} variant="secondary" className="text-xs">
                        {challenge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {supportNetwork.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Support network: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {supportNetwork.slice(0, 4).map(support => (
                      <Badge key={support} variant="outline" className="text-xs">
                        {support}
                      </Badge>
                    ))}
                    {supportNetwork.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{supportNetwork.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Validation */}
      <StepValidation fields={validationFields} className="mb-4" />

      <div className="flex justify-between">
        <GradientButton variant="outline" onClick={onBack}>
          Back
        </GradientButton>
        <GradientButton 
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`${isComplete ? 'bg-green-500 hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}`}
        >
          Continue
        </GradientButton>
      </div>
    </div>
  );
};

export default RelationshipHistoryStep;