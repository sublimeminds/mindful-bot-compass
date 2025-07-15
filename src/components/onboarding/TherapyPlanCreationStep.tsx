import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Brain, Sparkles, Settings, FileText, Zap, Target, Clock, Users, Lightbulb, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TherapyPlanCreationStepProps {
  onboardingData: any;
  onComplete: (success: boolean, planData?: any) => void;
}

interface ProgressPhase {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: number; // seconds
  progress: number; // 0-100
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string[];
}

const TherapyPlanCreationStep = ({ onboardingData, onComplete }: TherapyPlanCreationStepProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planData, setPlanData] = useState<any>(null);

  const [phases, setPhases] = useState<ProgressPhase[]>([
    {
      id: 'analysis',
      title: 'Analyzing Your Responses',
      description: 'Our AI is processing your assessment data and mental health screening results',
      icon: Brain,
      duration: 3,
      progress: 0,
      status: 'pending',
      details: []
    },
    {
      id: 'cultural',
      title: 'Processing Cultural Preferences',
      description: 'Integrating your cultural background and communication preferences',
      icon: Sparkles,
      duration: 2,
      progress: 0,
      status: 'pending',
      details: []
    },
    {
      id: 'adaptive',
      title: 'Running Adaptive AI Analysis',
      description: 'Creating personalized therapy approaches based on your unique profile',
      icon: Zap,
      duration: 4,
      progress: 0,
      status: 'pending',
      details: []
    },
    {
      id: 'plan',
      title: 'Creating Your Therapy Plan',
      description: 'Generating personalized recommendations and session structures',
      icon: FileText,
      duration: 3,
      progress: 0,
      status: 'pending',
      details: []
    },
    {
      id: 'finalization',
      title: 'Finalizing Recommendations',
      description: 'Optimizing your plan for maximum therapeutic effectiveness',
      icon: Settings,
      duration: 2,
      progress: 0,
      status: 'pending',
      details: []
    }
  ]);

  // Simulate realistic AI processing phases
  useEffect(() => {
    if (!user) return;

    const processPhases = async () => {
      try {
        for (let i = 0; i < phases.length; i++) {
          // Mark current phase as active
          setPhases(prev => prev.map((phase, index) => ({
            ...phase,
            status: index === i ? 'active' : index < i ? 'completed' : 'pending'
          })));
          
          setCurrentPhaseIndex(i);

          // Simulate phase processing with realistic details
          await simulatePhaseProgress(i);

          // Mark phase as completed
          setPhases(prev => prev.map((phase, index) => ({
            ...phase,
            status: index <= i ? 'completed' : 'pending',
            progress: index === i ? 100 : phase.progress
          })));

          // Update overall progress
          setOverallProgress(((i + 1) / phases.length) * 100);
        }

        // Create the actual therapy plan
        await createTherapyPlan();

      } catch (error) {
        console.error('Error creating therapy plan:', error);
        setError('Failed to create therapy plan. Please try again.');
        setPhases(prev => prev.map((phase, index) => ({
          ...phase,
          status: index === currentPhaseIndex ? 'error' : phase.status
        })));
      }
    };

    processPhases();
  }, [user]);

  const simulatePhaseProgress = async (phaseIndex: number): Promise<void> => {
    const phase = phases[phaseIndex];
    const steps = 10;
    const stepDuration = (phase.duration * 1000) / steps;

    for (let step = 1; step <= steps; step++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      
      const progress = (step / steps) * 100;
      
      setPhases(prev => prev.map((p, i) => 
        i === phaseIndex ? { 
          ...p, 
          progress,
          details: getPhaseDetails(phaseIndex, step)
        } : p
      ));
    }
  };

  const getPhaseDetails = (phaseIndex: number, step: number): string[] => {
    const phaseDetails = [
      [ // Analysis phase
        'Loading assessment responses...',
        'Analyzing mood patterns...',
        'Processing mental health indicators...',
        'Evaluating problem areas...',
        'Identifying strengths and challenges...',
        'Calculating severity scores...',
        'Determining risk factors...',
        'Analyzing response patterns...',
        'Finalizing assessment analysis...',
        'Analysis complete!'
      ],
      [ // Cultural processing
        'Loading cultural preferences...',
        'Processing language settings...',
        'Analyzing communication style...',
        'Integrating family structure data...',
        'Processing religious considerations...',
        'Adapting therapy approaches...',
        'Cultural integration complete!'
      ],
      [ // Adaptive AI
        'Initializing adaptive learning model...',
        'Processing personal history...',
        'Analyzing relationship patterns...',
        'Evaluating coping mechanisms...',
        'Calculating compatibility scores...',
        'Optimizing intervention strategies...',
        'Generating personalized approaches...',
        'Fine-tuning recommendations...',
        'Validating adaptive model...',
        'Adaptive analysis complete!'
      ],
      [ // Plan creation
        'Structuring therapy framework...',
        'Defining session goals...',
        'Creating intervention timeline...',
        'Generating homework assignments...',
        'Planning progress milestones...',
        'Integrating selected therapists...',
        'Optimizing session frequency...',
        'Finalizing therapy structure...',
        'Plan framework complete!'
      ],
      [ // Finalization
        'Validating plan effectiveness...',
        'Optimizing recommendations...',
        'Generating user dashboard...',
        'Preparing initial session...',
        'Quality assurance check...',
        'Plan ready for deployment!'
      ]
    ];

    return phaseDetails[phaseIndex]?.slice(0, step) || [];
  };

  const createTherapyPlan = async () => {
    try {
      toast.loading('Creating your personalized therapy plan...');

      const { data, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: user.id,
          onboardingData,
          culturalProfile: onboardingData.culturalPreferences,
          traumaHistory: onboardingData.traumaHistory,
          therapistSelection: onboardingData.therapistSelection,
          assessmentResults: onboardingData.assessmentResults || {},
          mentalHealthAssessments: onboardingData.mentalHealthAssessments || {},
          clinicalData: onboardingData.clinicalData || {},
          riskAssessment: onboardingData.riskAssessment || {},
          preferences: {
            cultural: onboardingData.culturalPreferences,
            therapy: onboardingData.therapyPreferences,
            communication: onboardingData.communicationPreferences
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setPlanData(data);
      setIsComplete(true);
      toast.success('Your personalized therapy plan has been created successfully!');
      
      // Show summary after 1 second
      setTimeout(() => {
        setShowSummary(true);
      }, 1000);

    } catch (error) {
      console.error('Error creating therapy plan:', error);
      setError('Failed to create therapy plan. Please try again.');
      toast.error('Failed to create therapy plan. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />;
      case 'error':
        return <div className="h-5 w-5 rounded-full bg-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
              Plan Creation Failed
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <button
              onClick={() => onComplete(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show summary view if completed and summary should be shown
  if (showSummary && planData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Personalized Therapy Plan</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Based on your assessment and cultural preferences, we've created a comprehensive therapy plan tailored specifically for you.
            </p>
          </CardContent>
        </Card>

        {/* Therapy Approaches */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Primary Approach</h3>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-lg">{planData.primaryApproach || 'Cognitive Behavioral Therapy (CBT)'}</h4>
                <p className="text-muted-foreground">{planData.primaryDescription || 'Evidence-based approach focusing on identifying and changing negative thought patterns and behaviors.'}</p>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">Why this approach:</p>
                  <p className="text-sm text-muted-foreground">{planData.primaryReasoning || 'Best suited for your specific needs and assessment results.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-secondary mr-3" />
                <h3 className="text-xl font-semibold">Secondary Approach</h3>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-lg">{planData.secondaryApproach || 'Mindfulness-Based Therapy'}</h4>
                <p className="text-muted-foreground">{planData.secondaryDescription || 'Complementary techniques to enhance awareness and emotional regulation.'}</p>
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">Integration:</p>
                  <p className="text-sm text-muted-foreground">{planData.secondaryReasoning || 'Supports your primary therapy with mindfulness and relaxation techniques.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Focus Areas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-accent mr-3" />
              <h3 className="text-xl font-semibold">Your Therapy Goals</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Primary Focus Areas</h4>
                <div className="space-y-2">
                  {(planData.goals || ['Anxiety Management', 'Stress Reduction', 'Emotional Regulation']).map((goal: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Expected Outcomes</h4>
                <div className="space-y-2">
                  {(planData.expectedOutcomes || ['Improved coping skills', 'Better emotional balance', 'Enhanced well-being']).map((outcome: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Structure and Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold">Session Structure</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium">{planData.sessionFrequency || 'Weekly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{planData.sessionDuration || '50 minutes'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{planData.sessionFormat || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Duration:</span>
                  <span className="font-medium">{planData.treatmentDuration || '12-16 weeks'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold">Progress Timeline</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">1-3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Initial Phase</p>
                    <p className="text-xs text-muted-foreground">Building rapport and assessment</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">4-10</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Active Treatment</p>
                    <p className="text-xs text-muted-foreground">Core therapy work and skill building</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">11+</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Maintenance</p>
                    <p className="text-xs text-muted-foreground">Reinforcement and relapse prevention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Adaptations */}
        {planData.culturalAdaptations && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold">Cultural Adaptations</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Communication Style</h4>
                  <p className="text-muted-foreground text-sm">
                    {planData.culturalAdaptations.communicationStyle || 'Adapted to your preferred communication approach and cultural background.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Cultural Considerations</h4>
                  <p className="text-muted-foreground text-sm">
                    {planData.culturalAdaptations.considerations || 'Therapy approaches modified to respect your cultural values and beliefs.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Techniques */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-xl font-semibold">Recommended Techniques</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {(planData.techniques || ['Cognitive Restructuring', 'Mindfulness Meditation', 'Progressive Muscle Relaxation', 'Journaling', 'Breathing Exercises', 'Behavioral Activation']).map((technique: string, index: number) => (
                <div key={index} className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">{technique}</h5>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold">Next Steps</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your First Session</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Your first session will focus on building rapport with your therapist and discussing your goals in detail.
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Review your therapy plan together
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Establish session goals and expectations
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Begin initial therapeutic work
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Your personalized therapy plan is ready!</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onComplete(true, planData)}
              size="lg"
              className="w-full md:w-auto px-8 bg-therapy-600 hover:bg-therapy-700"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              You can review and modify your plan anytime from your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-harmony-500 to-flow-500 rounded-full mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isComplete ? 'Your Therapy Plan is Ready!' : 'Creating Your Personalized Therapy Plan'}
            </h2>
            <p className="text-muted-foreground">
              {isComplete 
                ? 'We\'ve analyzed your responses and created a comprehensive therapy plan tailored specifically for you.'
                : 'Our AI is analyzing your responses and creating a personalized therapy plan just for you. This may take a few moments...'
              }
            </p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Phase Details */}
          <div className="space-y-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = phase.status === 'active';
              const isCompleted = phase.status === 'completed';
              const isError = phase.status === 'error';

              return (
                <div
                  key={phase.id}
                  className={`border rounded-lg p-4 transition-all duration-300 ${
                    isActive ? 'border-primary bg-primary/5' :
                    isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-950/20' :
                    isError ? 'border-red-200 bg-red-50 dark:bg-red-950/20' :
                    'border-gray-200 bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      isActive ? 'bg-primary/10' :
                      isCompleted ? 'bg-green-100 dark:bg-green-900' :
                      isError ? 'bg-red-100 dark:bg-red-900' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive ? 'text-primary' :
                        isCompleted ? 'text-green-600' :
                        isError ? 'text-red-600' :
                        'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          isActive ? 'text-primary' :
                          isCompleted ? 'text-green-700 dark:text-green-400' :
                          isError ? 'text-red-700 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {phase.title}
                        </h3>
                        {getStatusIcon(phase.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {phase.description}
                      </p>

                      {(isActive || isCompleted) && (
                        <div className="space-y-2">
                          {phase.progress > 0 && phase.progress < 100 && (
                            <Progress value={phase.progress} className="h-2" />
                          )}
                          
                          {phase.details && phase.details.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded p-3 border">
                              <div className="text-xs text-muted-foreground space-y-1">
                                {phase.details.slice(-3).map((detail, i) => (
                                  <div key={i} className="flex items-center space-x-2">
                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                    <span>{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isComplete && !showSummary && planData && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                  Plan Created Successfully!
                </h3>
                <p className="text-green-600 dark:text-green-300 mb-4">
                  Your personalized therapy plan is ready. Preparing summary...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapyPlanCreationStep;