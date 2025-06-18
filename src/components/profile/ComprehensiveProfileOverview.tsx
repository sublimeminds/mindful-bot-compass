
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  User, Brain, Target, TrendingUp, Award, Calendar, 
  Heart, Lightbulb, Globe, Shield, Activity, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ComprehensiveProfileOverview = () => {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would come from Supabase
    const mockOnboardingData = {
      personalInfo: {
        age: 28,
        culturalBackground: 'Asian-American',
        location: 'San Francisco, CA',
        relationshipStatus: 'Single',
        employmentStatus: 'Software Engineer'
      },
      mentalHealthHistory: {
        previousTherapy: true,
        currentMedications: ['Sertraline 50mg'],
        familyHistory: 'Anxiety disorders',
        primaryConcerns: ['Work stress', 'Social anxiety', 'Sleep issues']
      },
      goals: [
        'Improve work-life balance',
        'Build confidence in social situations',
        'Develop healthy sleep habits',
        'Learn stress management techniques'
      ],
      preferences: {
        communicationStyle: 'Direct but supportive',
        sessionFrequency: 'Weekly',
        preferredTime: 'Evening',
        culturalConsiderations: ['Family expectations', 'Work culture pressure']
      }
    };

    const mockAiAnalysis = {
      personalityProfile: {
        openness: 85,
        conscientiousness: 78,
        extraversion: 45,
        agreeableness: 82,
        neuroticism: 62
      },
      riskAssessment: {
        level: 'Moderate',
        factors: ['High stress environment', 'Social isolation', 'Sleep deprivation'],
        protectiveFactors: ['Strong work ethic', 'Self-awareness', 'Motivation to change']
      },
      therapeuticRecommendations: [
        {
          approach: 'Cognitive Behavioral Therapy',
          match: 92,
          reason: 'High analytical thinking and goal-oriented personality'
        },
        {
          approach: 'Mindfulness-Based Stress Reduction',
          match: 87,
          reason: 'Effective for work stress and sleep issues'
        },
        {
          approach: 'Social Skills Training',
          match: 73,
          reason: 'Addresses social anxiety concerns'
        }
      ],
      culturalAdaptations: {
        familyDynamics: 'Collectivist approach with respect for family expectations',
        communicationStyle: 'Indirect communication with emphasis on harmony',
        treatmentModifications: ['Include family perspectives', 'Address cultural guilt']
      }
    };

    const mockProgressData = {
      overallProgress: 68,
      streakDays: 23,
      sessionsCompleted: 12,
      goalsAchieved: 3,
      totalGoals: 6,
      recentMilestones: [
        { date: '2024-01-15', achievement: 'Completed first month of therapy' },
        { date: '2024-01-22', achievement: 'Established consistent sleep schedule' },
        { date: '2024-01-28', achievement: 'Successfully used breathing technique in stressful situation' }
      ],
      moodTrends: {
        averageMood: 7.2,
        improvement: 23,
        consistencyScore: 85
      }
    };

    setOnboardingData(mockOnboardingData);
    setAiAnalysis(mockAiAnalysis);
    setProgressData(mockProgressData);
    setLoading(false);
  }, []);

  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-therapy-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-therapy-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
                <p className="text-muted-foreground">Your comprehensive mental health profile</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold text-therapy-600">{progressData.overallProgress}%</div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-therapy-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-therapy-600" />
            <div className="text-2xl font-bold text-therapy-600">{progressData.streakDays}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="border-calm-200">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-calm-600" />
            <div className="text-2xl font-bold text-calm-600">{progressData.sessionsCompleted}</div>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card className="border-harmony-200">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-harmony-600" />
            <div className="text-2xl font-bold text-harmony-600">{progressData.goalsAchieved}/{progressData.totalGoals}</div>
            <p className="text-sm text-muted-foreground">Goals</p>
          </CardContent>
        </Card>
        <Card className="border-flow-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-flow-600" />
            <div className="text-2xl font-bold text-flow-600">{progressData.moodTrends.averageMood}/10</div>
            <p className="text-sm text-muted-foreground">Avg Mood</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Data</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.recentMilestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-therapy-50 rounded-lg">
                    <Award className="h-5 w-5 text-therapy-600" />
                    <div className="flex-1">
                      <p className="font-medium">{milestone.achievement}</p>
                      <p className="text-sm text-muted-foreground">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Current Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingData.goals.map((goal: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal}</span>
                      <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(onboardingData.personalInfo).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-medium">{renderValue(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mental Health History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Mental Health Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Primary Concerns</p>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.mentalHealthHistory.primaryConcerns.map((concern: string, index: number) => (
                      <Badge key={index} variant="outline">{concern}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Previous Therapy</p>
                  <p>{onboardingData.mentalHealthHistory.previousTherapy ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current Medications</p>
                  <p>{onboardingData.mentalHealthHistory.currentMedications.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Family History</p>
                  <p>{onboardingData.mentalHealthHistory.familyHistory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Therapy Preferences & Cultural Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(onboardingData.preferences).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-1">
                        {(value as string[]).map((item: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">{item}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="font-medium">{renderValue(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Personality Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Personality Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(aiAnalysis.personalityProfile).map(([trait, score]) => (
                  <div key={trait} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{trait}</span>
                      <span className="font-bold text-therapy-600">{score as number}%</span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Level</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {aiAnalysis.riskAssessment.level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Risk Factors</p>
                  <div className="space-y-1">
                    {aiAnalysis.riskAssessment.factors.map((factor: string, index: number) => (
                      <p key={index} className="text-sm">• {factor}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Protective Factors</p>
                  <div className="space-y-1">
                    {aiAnalysis.riskAssessment.protectiveFactors.map((factor: string, index: number) => (
                      <p key={index} className="text-sm text-green-700">• {factor}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Therapeutic Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Therapeutic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnalysis.therapeuticRecommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{rec.approach}</span>
                      <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
                        {rec.match}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cultural Adaptations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Cultural Adaptations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(aiAnalysis.culturalAdaptations).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    {Array.isArray(value) ? (
                      <div className="space-y-1">
                        {(value as string[]).map((item: string, index: number) => (
                          <p key={index} className="text-sm">• {item}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">{renderValue(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-therapy-600 mb-2">{progressData.overallProgress}%</div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <Progress value={progressData.overallProgress} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-calm-600 mb-2">{progressData.moodTrends.improvement}%</div>
                  <p className="text-sm text-muted-foreground">Mood Improvement</p>
                  <Progress value={progressData.moodTrends.improvement} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-harmony-600 mb-2">{progressData.moodTrends.consistencyScore}%</div>
                  <p className="text-sm text-muted-foreground">Consistency Score</p>
                  <Progress value={progressData.moodTrends.consistencyScore} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Progress Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Session Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Sessions Completed</span>
                    <span className="font-bold">{progressData.sessionsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current Streak</span>
                    <span className="font-bold">{progressData.streakDays} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Mood</span>
                    <span className="font-bold">{progressData.moodTrends.averageMood}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Goal Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Goals Completed</span>
                    <span className="font-bold">{progressData.goalsAchieved}/{progressData.totalGoals}</span>
                  </div>
                  <Progress value={(progressData.goalsAchieved / progressData.totalGoals) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {Math.round((progressData.goalsAchieved / progressData.totalGoals) * 100)}% completion rate
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveProfileOverview;
