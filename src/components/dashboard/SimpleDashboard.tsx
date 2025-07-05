import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, Activity, Heart } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const SimpleDashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeComponentWrapper name="SimpleDashboard">
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Header */}
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">TherapySync</h1>
                  <p className="text-sm text-muted-foreground">Mental Health Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">Welcome back!</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Welcome Card */}
            <SafeComponentWrapper name="WelcomeCard">
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Welcome to Your Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your mental health journey starts here. Track your progress, set goals, and connect with therapeutic resources.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="default">Start Session</Button>
                    <Button variant="outline">View Progress</Button>
                  </div>
                </CardContent>
              </Card>
            </SafeComponentWrapper>

            {/* Quick Stats */}
            <SafeComponentWrapper name="SessionsCard">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Total sessions completed</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Start First Session
                  </Button>
                </CardContent>
              </Card>
            </SafeComponentWrapper>

            <SafeComponentWrapper name="ProgressCard">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Well-being
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Getting Started</div>
                  <p className="text-sm text-muted-foreground">Your wellness journey</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Track Mood
                  </Button>
                </CardContent>
              </Card>
            </SafeComponentWrapper>

            <SafeComponentWrapper name="SettingsCard">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customize your experience
                  </p>
                  <Button variant="outline" size="sm">
                    Manage Settings
                  </Button>
                </CardContent>
              </Card>
            </SafeComponentWrapper>

          </div>

          {/* Coming Soon Section */}
          <div className="mt-8">
            <SafeComponentWrapper name="ComingSoonSection">
              <Card>
                <CardHeader>
                  <CardTitle>More Features Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🧠</div>
                      <h3 className="font-medium">AI Therapy Sessions</h3>
                      <p className="text-sm text-muted-foreground">Personalized AI-powered conversations</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">📊</div>
                      <h3 className="font-medium">Progress Analytics</h3>
                      <p className="text-sm text-muted-foreground">Detailed insights and trends</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🎯</div>
                      <h3 className="font-medium">Goal Setting</h3>
                      <p className="text-sm text-muted-foreground">Set and track wellness goals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SafeComponentWrapper>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default SimpleDashboard;