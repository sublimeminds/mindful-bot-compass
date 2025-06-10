
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, BarChart3, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RealTimeSessionManager from '@/components/session/RealTimeSessionManager';
import LiveSessionAnalytics from '@/components/session/LiveSessionAnalytics';
import SessionStatusIndicator from '@/components/session/SessionStatusIndicator';
import SessionControlPanel from '@/components/session/SessionControlPanel';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { useRealTimeSession } from '@/hooks/useRealTimeSession';

const LiveSession = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('session');
  
  const {
    sessionState,
    startSession,
    endSession,
    pauseSession,
    resumeSession
  } = useRealTimeSession();

  return (
    <MobileOptimizedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Live Session</h1>
              <p className="text-muted-foreground">Real-time therapy session management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                sessionState.connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span>{sessionState.connectionStatus === 'connected' ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Session Control Panel */}
        <SessionControlPanel
          sessionState={sessionState}
          onStartSession={startSession}
          onEndSession={endSession}
        />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="session" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Session
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="session" className="mt-6">
            <RealTimeSessionManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <LiveSessionAnalytics />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Session Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Advanced Insights Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Real-time AI analysis of session patterns, emotional markers, and therapeutic progress will be available here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Session Configuration</h3>
                    <p className="text-muted-foreground">
                      Configure real-time session preferences, recording settings, and AI analysis parameters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Session Status Indicator - Shows only when session is active */}
        <SessionStatusIndicator
          sessionState={sessionState}
          onPause={pauseSession}
          onResume={resumeSession}
          onEnd={endSession}
        />
      </div>
    </MobileOptimizedLayout>
  );
};

export default LiveSession;
