
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SimpleIntakeStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData: any;
}

const SimpleIntakeStep = ({ onNext, onBack, onboardingData }: SimpleIntakeStepProps) => {
  const [formData, setFormData] = useState({
    goals: onboardingData?.goals || '',
    concerns: onboardingData?.concerns || '',
    previous_therapy: onboardingData?.previous_therapy || false,
    current_medications: onboardingData?.current_medications || '',
    support_system: onboardingData?.support_system || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell Us About Yourself</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="goals">What are your main goals for therapy?</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="What would you like to work on or achieve?"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="concerns">What are your main concerns or challenges?</Label>
            <Textarea
              id="concerns"
              value={formData.concerns}
              onChange={(e) => setFormData(prev => ({ ...prev, concerns: e.target.value }))}
              placeholder="What brings you to therapy today?"
              rows={4}
            />
          </div>

          <div>
            <Label>Have you been in therapy before?</Label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="previous_therapy"
                  checked={formData.previous_therapy === true}
                  onChange={() => setFormData(prev => ({ ...prev, previous_therapy: true }))}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="previous_therapy"
                  checked={formData.previous_therapy === false}
                  onChange={() => setFormData(prev => ({ ...prev, previous_therapy: false }))}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="medications">Are you currently taking any medications?</Label>
            <Textarea
              id="medications"
              value={formData.current_medications}
              onChange={(e) => setFormData(prev => ({ ...prev, current_medications: e.target.value }))}
              placeholder="Please list any medications (optional)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="support">Tell us about your support system</Label>
            <Textarea
              id="support"
              value={formData.support_system}
              onChange={(e) => setFormData(prev => ({ ...prev, support_system: e.target.value }))}
              placeholder="Family, friends, community, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleIntakeStep;
