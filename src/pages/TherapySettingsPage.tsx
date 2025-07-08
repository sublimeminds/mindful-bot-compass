import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Brain, 
  MessageCircle, 
  Clock,
  Shield,
  Palette
} from 'lucide-react';
import TherapistPersonalitySettings from '@/components/therapy/TherapistPersonalitySettings';
import AIBehaviorSettings from '@/components/therapy/AIBehaviorSettings';
import SessionPreferences from '@/components/therapy/SessionPreferences';
import CrisisSettings from '@/components/therapy/CrisisSettings';
import AIModelConfiguration from '@/components/therapy/AIModelConfiguration';

const TherapySettingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Therapy Settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-therapy-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Therapy Settings</h1>
              <p className="text-gray-600 mt-1">
                Customize your AI therapy experience and preferences
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="therapist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="therapist" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Therapist</span>
            </TabsTrigger>
            
            <TabsTrigger value="ai-models" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">AI Models</span>
            </TabsTrigger>
            
            <TabsTrigger value="ai-behavior" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Behavior</span>
            </TabsTrigger>

            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
            
            <TabsTrigger value="crisis" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="therapist" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-1">
              <TherapistPersonalitySettings />
            </div>
          </TabsContent>

          <TabsContent value="ai-models" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <AIModelConfiguration />
            </div>
          </TabsContent>

          <TabsContent value="ai-behavior" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <AIBehaviorSettings />
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <SessionPreferences />
            </div>
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <CrisisSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TherapySettingsPage;