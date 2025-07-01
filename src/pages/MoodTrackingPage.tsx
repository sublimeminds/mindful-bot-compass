
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';

const MoodTrackingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flow-50/30 to-harmony-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Mood Tracking & Analytics
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your emotional patterns and gain insights into your mental wellness journey with advanced analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Mood Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Visual charts and graphs of your emotional patterns</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track improvement over time with trend analysis</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Calendar className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle>Daily Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Quick daily mood logging and reflection</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Target className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>Wellness Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Set and track your mental wellness objectives</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MoodTrackingPage;
