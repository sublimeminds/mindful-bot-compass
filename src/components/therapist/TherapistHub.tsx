import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Brain, 
  Plus, 
  Settings, 
  Star, 
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Crown,
  Heart,
  Zap
} from 'lucide-react';
import { useTherapistSelection } from '@/hooks/useTherapistSelection';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const TherapistHub = () => {
  const { user } = useSimpleApp();
  const { currentSelection } = useTherapistSelection();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  // Mock data for multi-therapist setup
  const therapistTeam = [
    {
      id: 'ed979f27-2491-43f1-a779-5095febb68b2',
      name: 'Dr. Sarah Chen',
      specialty: 'Anxiety & Depression',
      isPrimary: true,
      approach: 'Cognitive Behavioral Therapy',
      sessionsCompleted: 12,
      effectiveness: 92,
      nextSession: '2024-01-15T14:00:00Z',
      status: 'active'
    },
    {
      id: '9492ab1a-eab2-4c5f-a8e3-40870b2ca857',
      name: 'Dr. Maya Patel',
      specialty: 'ADHD & Focus',
      isPrimary: false,
      approach: 'Mindfulness-Based Therapy',
      sessionsCompleted: 6,
      effectiveness: 87,
      nextSession: '2024-01-17T10:00:00Z',
      status: 'active'
    }
  ];

  const availableSpecialties = [
    'Anxiety', 'Depression', 'ADHD', 'Trauma', 'Relationships', 
    'Stress Management', 'Sleep Issues', 'Work-Life Balance'
  ];

  const recommendedTherapists = [
    {
      id: '0772c602-306b-42ad-b610-2dc15ba06714',
      name: 'Dr. Alex Rodriguez',
      specialty: 'Trauma Therapy',
      matchScore: 94,
      approach: 'EMDR & Somatic Therapy',
      experience: '8 years',
      reason: 'Based on your recent stress patterns and assessment results'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
            Therapist Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your therapy team and coordinate specialized care
          </p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Therapist
        </Button>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">My Team</TabsTrigger>
          <TabsTrigger value="discovery">Discover</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* My Team Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Current Team Overview */}
          <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-harmony-25">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-therapy-600" />
                Your Therapy Team
                <Badge variant="secondary" className="ml-2">
                  {therapistTeam.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {therapistTeam.map((therapist) => (
                  <Card key={therapist.id} className={`${therapist.isPrimary ? 'border-therapy-300 bg-therapy-50' : 'border-border'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{therapist.name}</h3>
                            {therapist.isPrimary && (
                              <Crown className="h-4 w-4 ml-2 text-therapy-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                          <p className="text-xs text-muted-foreground">{therapist.approach}</p>
                        </div>
                        <Badge variant={therapist.status === 'active' ? 'default' : 'secondary'}>
                          {therapist.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-medium">{therapist.sessionsCompleted}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Effectiveness</p>
                          <p className="font-medium text-therapy-600">{therapist.effectiveness}%</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-harmony-200 hover:border-harmony-300 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-harmony-600" />
                <h3 className="font-semibold mb-1">Switch Context</h3>
                <p className="text-sm text-muted-foreground">
                  Change therapy focus or specialty
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-therapy-200 hover:border-therapy-300 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
                <h3 className="font-semibold mb-1">Coordination</h3>
                <p className="text-sm text-muted-foreground">
                  Review team notes and progress
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-flow-200 hover:border-flow-300 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-flow-600" />
                <h3 className="font-semibold mb-1">Team Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track progress across therapists
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Discovery Tab */}
        <TabsContent value="discovery" className="space-y-6">
          {/* Specialty Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Find Specialized Care</CardTitle>
              <p className="text-sm text-muted-foreground">
                Discover therapists for specific needs and specialties
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={selectedSpecialty === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty('all')}
                >
                  All Specialties
                </Button>
                {availableSpecialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Therapists */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-therapy-600" />
                AI-Recommended Additions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedTherapists.map((therapist) => (
                  <div key={therapist.id} className="border rounded-lg p-4 hover:border-therapy-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold">{therapist.name}</h3>
                          <Badge variant="outline" className="ml-2">
                            {therapist.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{therapist.specialty}</p>
                        <p className="text-sm text-muted-foreground mb-2">{therapist.approach} • {therapist.experience}</p>
                        <p className="text-sm text-therapy-600">{therapist.reason}</p>
                      </div>
                      <Button>
                        Add to Team
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coordination Tab */}
        <TabsContent value="coordination" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Coordination</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage how your therapists work together
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Shared Treatment Goals</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Reduce anxiety symptoms by 40% over 3 months</li>
                    <li>• Improve focus and concentration for work tasks</li>
                    <li>• Develop healthy coping strategies</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Coordination Level</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Basic</Button>
                    <Button size="sm">Enhanced</Button>
                    <Button variant="outline" size="sm">Full Collaboration</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Overall Progress</h3>
                  <div className="text-2xl font-bold text-therapy-600">89%</div>
                  <p className="text-sm text-muted-foreground">Across all treatment areas</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Session Frequency</h3>
                  <div className="text-2xl font-bold text-harmony-600">2.3/week</div>
                  <p className="text-sm text-muted-foreground">Average across team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistHub;