import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Target, User, Calendar } from 'lucide-react';

interface TherapyPlanCreationWizardProps {
  userId: string;
  onPlanCreated: (plan: any) => void;
  onCancel: () => void;
}

const FOCUS_AREAS = [
  'Anxiety Management',
  'Depression Support',
  'Stress Reduction',
  'Relationship Issues',
  'Self-Esteem',
  'Anger Management',
  'Grief & Loss',
  'Trauma Recovery',
  'Life Transitions',
  'Communication Skills',
  'Mindfulness & Meditation',
  'Work-Life Balance'
];

const THERAPIST_PERSONALITIES = [
  'Dr. Sarah Chen',
  'Alex Rivera',
  'Maya Patel',
  'Jordan Thompson',
  'Dr. Emily Watson',
  'Marcus Johnson'
];

const TherapyPlanCreationWizard = ({ userId, onPlanCreated, onCancel }: TherapyPlanCreationWizardProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    focus_areas: [] as string[],
    therapist_id: '',
    sessions_per_week: 2,
    estimated_duration_weeks: 12,
    goals: [] as any[],
    milestones: [] as any[]
  });

  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });

  const steps = [
    { title: 'Plan Overview', icon: Target },
    { title: 'Focus Areas', icon: Target },
    { title: 'Therapist Selection', icon: User },
    { title: 'Schedule & Goals', icon: Calendar }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreatePlan();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFocusAreaToggle = (area: string) => {
    setPlanData(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(area)
        ? prev.focus_areas.filter(a => a !== area)
        : [...prev.focus_areas, area]
    }));
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      setPlanData(prev => ({
        ...prev,
        goals: [...prev.goals, { ...newGoal, progress: 0, id: Date.now() }]
      }));
      setNewGoal({ title: '', description: '', targetDate: '' });
    }
  };

  const removeGoal = (goalId: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const handleCreatePlan = async () => {
    setLoading(true);
    try {
      // Create therapy plan
      const { data: plan, error } = await supabase
        .from('therapy_plans')
        .insert({
          user_id: userId,
          ...planData,
          current_phase: 'assessment',
          total_phases: 4,
          progress_percentage: 0,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Create default milestones
      const defaultMilestones = [
        {
          title: 'Initial Assessment Complete',
          description: 'Complete comprehensive mental health assessment',
          target_phase: 'assessment',
          progress: 0
        },
        {
          title: 'Coping Strategies Learned',
          description: 'Master 3-5 effective coping strategies',
          target_phase: 'skill_building',
          progress: 0
        },
        {
          title: 'Significant Progress Made',
          description: 'Achieve 70% improvement in target areas',
          target_phase: 'integration',
          progress: 0
        },
        {
          title: 'Maintenance Plan Established',
          description: 'Develop sustainable long-term wellness plan',
          target_phase: 'maintenance',
          progress: 0
        }
      ];

      // Update plan with milestones
      await supabase
        .from('therapy_plans')
        .update({ milestones: defaultMilestones })
        .eq('id', plan.id);

      // Schedule first session if therapist is selected
      if (planData.therapist_id) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(14, 0, 0, 0); // Default to 2 PM

        await supabase
          .from('scheduled_sessions')
          .insert({
            user_id: userId,
            therapy_plan_id: plan.id,
            therapist_id: planData.therapist_id,
            session_type: 'initial_assessment',
            scheduled_for: nextWeek.toISOString(),
            duration_minutes: 60,
            is_recurring: false
          });
      }

      onPlanCreated(plan);
      toast({
        title: "Success",
        description: "Your therapy plan has been created successfully!",
      });
    } catch (error) {
      console.error('Error creating therapy plan:', error);
      toast({
        title: "Error",
        description: "Failed to create therapy plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return planData.title.trim() && planData.description.trim();
      case 1:
        return planData.focus_areas.length > 0;
      case 2:
        return planData.therapist_id;
      case 3:
        return true; // Goals are optional
      default:
        return false;
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Create Therapy Plan
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col items-center space-y-2 ${
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`rounded-full p-2 ${
                index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 0: Plan Overview */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Plan Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Anxiety Management Journey"
                  value={planData.title}
                  onChange={(e) => setPlanData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you hope to achieve with this therapy plan..."
                  value={planData.description}
                  onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 1: Focus Areas */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Select Focus Areas (choose 1-4 areas)</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the main areas you'd like to work on in therapy
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {FOCUS_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={planData.focus_areas.includes(area)}
                        onCheckedChange={() => handleFocusAreaToggle(area)}
                      />
                      <Label htmlFor={area} className="text-sm">{area}</Label>
                    </div>
                  ))}
                </div>
                {planData.focus_areas.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {planData.focus_areas.map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Therapist Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Choose Your AI Therapist</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the AI therapist personality that best matches your preferences
                </p>
                <Select value={planData.therapist_id} onValueChange={(value) => 
                  setPlanData(prev => ({ ...prev, therapist_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    {THERAPIST_PERSONALITIES.map((therapist) => (
                      <SelectItem key={therapist} value={therapist}>
                        {therapist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sessions per Week</Label>
                  <Select value={planData.sessions_per_week.toString()} onValueChange={(value) => 
                    setPlanData(prev => ({ ...prev, sessions_per_week: parseInt(value) }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 session</SelectItem>
                      <SelectItem value="2">2 sessions</SelectItem>
                      <SelectItem value="3">3 sessions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (weeks)</Label>
                  <Select value={planData.estimated_duration_weeks.toString()} onValueChange={(value) => 
                    setPlanData(prev => ({ ...prev, estimated_duration_weeks: parseInt(value) }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 weeks</SelectItem>
                      <SelectItem value="12">12 weeks</SelectItem>
                      <SelectItem value="16">16 weeks</SelectItem>
                      <SelectItem value="24">24 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Goals Section */}
              <div>
                <Label>Therapy Goals (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set specific goals you'd like to achieve
                </p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="Goal title..."
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Goal description..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addGoal}
                      disabled={!newGoal.title.trim()}
                    >
                      Add Goal
                    </Button>
                  </div>

                  {planData.goals.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Added Goals:</p>
                      {planData.goals.map((goal) => (
                        <div key={goal.id} className="flex justify-between items-start p-3 border rounded">
                          <div>
                            <p className="font-medium text-sm">{goal.title}</p>
                            <p className="text-xs text-muted-foreground">{goal.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeGoal(goal.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onCancel : handleBack}
          >
            {currentStep === 0 ? 'Cancel' : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </>
            )}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepComplete() || loading}
          >
            {currentStep === steps.length - 1 ? 'Create Plan' : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapyPlanCreationWizard;