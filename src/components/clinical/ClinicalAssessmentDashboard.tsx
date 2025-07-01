import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Assessment {
  id: string;
  assessment_type: string;
  total_score: number;
  severity_level: string;
  interpretation: string;
  administered_at: string;
  recommendations: any;
}

interface AssessmentTemplate {
  type: string;
  name: string;
  description: string;
  questions: any[];
  scoring: any;
}

const ClinicalAssessmentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const assessmentTemplates: AssessmentTemplate[] = [
    {
      type: 'phq9',
      name: 'PHQ-9 (Depression)',
      description: 'Patient Health Questionnaire for depression screening',
      questions: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling or staying asleep, or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself or that you are a failure',
        'Trouble concentrating on things',
        'Moving or speaking slowly, or being fidgety/restless',
        'Thoughts that you would be better off dead or hurting yourself'
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: 'normal', description: 'Minimal depression' },
          { min: 5, max: 9, level: 'mild', description: 'Mild depression' },
          { min: 10, max: 14, level: 'moderate', description: 'Moderate depression' },
          { min: 15, max: 19, level: 'moderately_severe', description: 'Moderately severe depression' },
          { min: 20, max: 27, level: 'severe', description: 'Severe depression' }
        ]
      }
    },
    {
      type: 'gad7',
      name: 'GAD-7 (Anxiety)',
      description: 'Generalized Anxiety Disorder assessment',
      questions: [
        'Feeling nervous, anxious, or on edge',
        'Not being able to stop or control worrying',
        'Worrying too much about different things',
        'Trouble relaxing',
        'Being so restless that it is hard to sit still',
        'Becoming easily annoyed or irritable',
        'Feeling afraid, as if something awful might happen'
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: 'normal', description: 'Minimal anxiety' },
          { min: 5, max: 9, level: 'mild', description: 'Mild anxiety' },
          { min: 10, max: 14, level: 'moderate', description: 'Moderate anxiety' },
          { min: 15, max: 21, level: 'severe', description: 'Severe anxiety' }
        ]
      }
    },
    {
      type: 'ptsd5',
      name: 'PCL-5 (PTSD)',
      description: 'PTSD Checklist for DSM-5',
      questions: [
        'Repeated, disturbing, and unwanted memories of the stressful experience',
        'Repeated, disturbing dreams of the stressful experience',
        'Suddenly feeling or acting as if the stressful experience were actually happening again',
        'Feeling very upset when something reminded you of the stressful experience',
        'Having strong physical reactions when something reminded you of the stressful experience'
      ],
      scoring: {
        ranges: [
          { min: 0, max: 30, level: 'normal', description: 'Below PTSD threshold' },
          { min: 31, max: 80, level: 'moderate', description: 'Possible PTSD - further evaluation needed' }
        ]
      }
    }
  ];

  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('clinical_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('administered_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    }
  };

  const startAssessment = (assessmentType: string) => {
    setSelectedAssessment(assessmentType);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-500';
      case 'moderately_severe': return 'bg-orange-600';
      case 'moderate': return 'bg-orange-500';
      case 'mild': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getLatestAssessment = (type: string) => {
    return assessments.find(a => a.assessment_type === type);
  };

  const calculateTrend = (type: string) => {
    const typeAssessments = assessments.filter(a => a.assessment_type === type);
    if (typeAssessments.length < 2) return null;
    
    const latest = typeAssessments[0].total_score;
    const previous = typeAssessments[1].total_score;
    return latest - previous;
  };

  if (selectedAssessment) {
    const template = assessmentTemplates.find(t => t.type === selectedAssessment);
    if (template) {
      return (
        <AssessmentForm 
          template={template}
          onComplete={() => {
            setSelectedAssessment(null);
            fetchAssessments();
          }}
          onCancel={() => setSelectedAssessment(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClipboardList className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Clinical Assessments</h2>
        </div>
        <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
          Evidence-Based Screening
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Take Assessment</TabsTrigger>
          <TabsTrigger value="history">History & Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessmentTemplates.map((template) => {
              const latest = getLatestAssessment(template.type);
              const trend = calculateTrend(template.type);
              
              return (
                <Card key={template.type}>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    {latest ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Latest Score</span>
                          <Badge className={getSeverityColor(latest.severity_level)}>
                            {latest.total_score}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{latest.severity_level}</div>
                          <div className="text-xs">
                            {new Date(latest.administered_at).toLocaleDateString()}
                          </div>
                        </div>

                        {trend !== null && (
                          <div className="flex items-center text-sm">
                            <TrendingUp className={`h-4 w-4 mr-1 ${
                              trend > 0 ? 'text-red-500' : trend < 0 ? 'text-green-500' : 'text-gray-500'
                            }`} />
                            <span className={
                              trend > 0 ? 'text-red-500' : trend < 0 ? 'text-green-500' : 'text-gray-500'
                            }>
                              {trend > 0 ? '+' : ''}{trend} from last assessment
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No assessments completed</p>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => startAssessment(template.type)}
                    >
                      {latest ? 'Retake Assessment' : 'Take Assessment'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTemplates.map((template) => (
              <Card key={template.type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    <Brain className="h-5 w-5 text-therapy-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{template.questions.length} questions</span>
                    <span>~5 minutes</span>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => startAssessment(template.type)}
                  >
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(assessment.severity_level)}`} />
                        <div>
                          <div className="font-medium">
                            {assessmentTemplates.find(t => t.type === assessment.assessment_type)?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(assessment.administered_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Score: {assessment.total_score}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {assessment.severity_level.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assessment history available</p>
                  <p className="text-sm">Complete your first assessment to start tracking progress</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Assessment Form Component
const AssessmentForm = ({ 
  template, 
  onComplete, 
  onCancel 
}: { 
  template: AssessmentTemplate; 
  onComplete: () => void; 
  onCancel: () => void; 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<{[key: number]: number}>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < template.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, value) => sum + value, 0);
  };

  const getSeverityLevel = (score: number) => {
    const range = template.scoring.ranges.find(r => score >= r.min && score <= r.max);
    return range ? range.level : 'unknown';
  };

  const getInterpretation = (score: number) => {
    const range = template.scoring.ranges.find(r => score >= r.min && score <= r.max);
    return range ? range.description : 'Score interpretation not available';
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    
    try {
      const totalScore = calculateScore();
      const severityLevel = getSeverityLevel(totalScore);
      const interpretation = getInterpretation(totalScore);

      const { error } = await supabase
        .from('clinical_assessments')
        .insert({
          user_id: user?.id,
          assessment_type: template.type,
          questions: template.questions,
          responses: responses,
          total_score: totalScore,
          severity_level: severityLevel,
          interpretation: interpretation,
          recommendations: {
            level: severityLevel,
            suggestion: interpretation,
            nextSteps: severityLevel === 'severe' || severityLevel === 'moderately_severe' 
              ? ['Consider professional consultation', 'Continue monitoring', 'Implement safety planning']
              : ['Continue self-monitoring', 'Practice coping strategies', 'Regular reassessment']
          }
        });

      if (error) throw error;

      toast({
        title: "Assessment Completed",
        description: `Your ${template.name} assessment has been saved successfully.`,
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / template.questions.length) * 100;
  const isComplete = Object.keys(responses).length === template.questions.length;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {template.name}
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {template.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">
            {template.questions[currentQuestion]}
          </h3>
          
          <div className="text-sm text-gray-600 mb-6">
            Over the last 2 weeks, how often have you been bothered by this problem?
          </div>

          <div className="space-y-3">
            {[
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={responses[currentQuestion] === option.value ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleResponse(currentQuestion, option.value)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    responses[currentQuestion] === option.value 
                      ? 'bg-therapy-600 border-therapy-600' 
                      : 'border-gray-300'
                  }`} />
                  {option.label}
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion === template.questions.length - 1 ? (
            <Button 
              onClick={submitAssessment}
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Assessment
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              disabled={responses[currentQuestion] === undefined}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalAssessmentDashboard;