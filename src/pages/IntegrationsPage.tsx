
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Watch, Calendar, Activity } from 'lucide-react';

const IntegrationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50/30 to-balance-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Integrations & Connectivity
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect TherapySync with your favorite apps and devices for a comprehensive wellness ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Mobile Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sync with meditation, fitness, and wellness apps</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Watch className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle>Wearable Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect fitness trackers and smartwatches</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Calendar className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Calendar Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Schedule therapy sessions and wellness reminders</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Activity className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>Health Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Integrate with health tracking and medical platforms</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IntegrationsPage;
