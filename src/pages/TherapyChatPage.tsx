
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Brain, Heart, Calendar } from 'lucide-react';

const TherapyChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Therapy Chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Therapy Chat</h1>
            <p className="text-gray-600 mt-2">Connect with your AI therapist for personalized support</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Start Options */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-therapy-500" />
                  <span>Start New Session</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-therapy-500 hover:bg-therapy-600">
                    <Brain className="h-6 w-6" />
                    <span>General Therapy</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Heart className="h-6 w-6" />
                    <span>Anxiety Support</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>Mood Check-in</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <MessageCircle className="h-6 w-6" />
                    <span>Crisis Support</span>
                  </Button>
                </div>
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Choose a session type above or start with general therapy support
                  </p>
                  <Button size="lg" className="bg-therapy-500 hover:bg-therapy-600 px-8">
                    Begin Therapy Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((session) => (
                  <div key={session} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Session {session}</p>
                      <p className="text-sm text-gray-600">
                        {session === 1 ? 'Today' : `${session} days ago`}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Resume
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-500" />
              <h3 className="font-semibold mb-2">AI-Powered Therapy</h3>
              <p className="text-sm text-gray-600">
                Get personalized therapy sessions powered by advanced AI
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-therapy-500" />
              <h3 className="font-semibold mb-2">Emotional Support</h3>
              <p className="text-sm text-gray-600">
                24/7 emotional support whenever you need it most
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-therapy-500" />
              <h3 className="font-semibold mb-2">Private & Secure</h3>
              <p className="text-sm text-gray-600">
                Your conversations are completely private and secure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TherapyChatPage;
