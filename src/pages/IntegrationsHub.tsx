import React from 'react';
import { Settings, Smartphone, Heart, Calendar, Activity, Database, Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IntegrationsHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Settings className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Integrations Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with your favorite health and wellness apps for seamless care coordination
          </p>
        </div>

        {/* Available Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Health & Fitness</h3>
            <p className="text-gray-600 mb-4">
              Apple Health, Google Fit, Fitbit, MyFitnessPal, Strava
            </p>
            <span className="text-sm text-therapy-600 font-medium">20+ Apps Available</span>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Calendar className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar & Scheduling</h3>
            <p className="text-gray-600 mb-4">
              Google Calendar, Outlook, Apple Calendar, Calendly
            </p>
            <span className="text-sm text-therapy-600 font-medium">8+ Apps Available</span>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Activity className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mindfulness & Wellness</h3>
            <p className="text-gray-600 mb-4">
              Headspace, Calm, Insight Timer, Ten Percent Happier
            </p>
            <span className="text-sm text-therapy-600 font-medium">12+ Apps Available</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Smartphone className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sleep & Recovery</h3>
            <p className="text-gray-600 mb-4">
              Sleep Cycle, Oura Ring, Sleep Score, AutoSleep
            </p>
            <span className="text-sm text-therapy-600 font-medium">15+ Apps Available</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Database className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Electronic Health Records</h3>
            <p className="text-gray-600 mb-4">
              Epic MyChart, Cerner HealtheLife, Allscripts
            </p>
            <span className="text-sm text-therapy-600 font-medium">5+ EHR Systems</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Zap className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Productivity & Mood</h3>
            <p className="text-gray-600 mb-4">
              Notion, Todoist, Daylio, Moodpath, Journey
            </p>
            <span className="text-sm text-therapy-600 font-medium">18+ Apps Available</span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">All integrations use encrypted connections and comply with HIPAA standards</p>
          </div>
          
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Holistic View</h3>
            <p className="text-gray-600">Get a complete picture of your mental and physical health in one place</p>
          </div>
          
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Insights</h3>
            <p className="text-gray-600">AI-powered analysis helps identify patterns and personalize your therapy</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect Your Apps?</h2>
          <p className="text-xl mb-6">
            Start your journey with TherapySync and access all these integrations plus personalized AI therapy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-therapy-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/get-started'}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-therapy-600"
              onClick={() => window.location.href = '/auth'}
            >
              View Integration Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;