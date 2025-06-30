
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone, Calendar, Heart, Activity, Clock,
  Zap, Shield, CheckCircle, ExternalLink, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Integrations = () => {
  const navigate = useNavigate();
  const [connectedApps, setConnectedApps] = useState<{[key: string]: boolean}>({
    'google-calendar': true,
    'apple-health': false,
    'fitbit': true,
    'spotify': false,
    'slack': false
  });

  useSafeSEO({
    title: 'App Integrations & Connections - Sync Your Mental Health Data | TherapySync',
    description: 'Connect TherapySync with your favorite apps and devices. Sync calendar, health data, wearables, and more for comprehensive wellness tracking.',
    keywords: 'app integrations, health data sync, calendar integration, wearable devices, API connections'
  });

  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync therapy sessions, mood tracking reminders, and wellness goals with your calendar',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      category: 'Productivity',
      features: ['Session scheduling', 'Reminder notifications', 'Goal deadlines'],
      status: 'Available'
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      description: 'Import sleep, activity, and mindfulness data to enhance mood correlations',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      category: 'Health',
      features: ['Sleep tracking', 'Activity monitoring', 'Mindfulness minutes'],
      status: 'Available'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Sync fitness data, sleep patterns, and stress metrics for comprehensive wellness',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      category: 'Fitness',
      features: ['Heart rate data', 'Sleep analysis', 'Stress tracking'],
      status: 'Available'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Analyze music listening patterns and create therapeutic playlists',
      icon: Zap,
      color: 'from-green-400 to-green-600',
      category: 'Wellness',
      features: ['Mood-based playlists', 'Listening analytics', 'Relaxation music'],
      status: 'Available'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Receive wellness reminders and mood check-ins in your workspace',
      icon: Smartphone,
      color: 'from-purple-500 to-violet-500',
      category: 'Productivity',
      features: ['Daily check-ins', 'Wellness reminders', 'Team mental health'],
      status: 'Coming Soon'
    },
    {
      id: 'alexa',
      name: 'Amazon Alexa',
      description: 'Voice-activated mood logging and guided meditation sessions',
      icon: Smartphone,
      color: 'from-blue-400 to-cyan-500',
      category: 'Voice',
      features: ['Voice mood logging', 'Meditation commands', 'Daily affirmations'],
      status: 'Coming Soon'
    }
  ];

  const categories = ['All', 'Health', 'Fitness', 'Productivity', 'Wellness', 'Voice'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'All' || integration.category === selectedCategory
  );

  const toggleConnection = (integrationId: string) => {
    setConnectedApps(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Coming Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Beta': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Zap className="h-4 w-4 mr-2" />
              App Integrations
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Connect Your Digital Life
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Seamlessly integrate TherapySync with your favorite apps and devices. Sync health data, calendar events, and wellness metrics for a comprehensive mental health experience.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Zap, label: 'Available Integrations', value: '6+', color: 'from-blue-500 to-indigo-500' },
              { icon: CheckCircle, label: 'Connected Apps', value: Object.values(connectedApps).filter(Boolean).length.toString(), color: 'from-green-500 to-emerald-500' },
              { icon: Shield, label: 'Security Level', value: 'Enterprise', color: 'from-purple-500 to-violet-500' },
              { icon: Clock, label: 'Sync Frequency', value: 'Real-time', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredIntegrations.map((integration) => {
              const IconComponent = integration.icon;
              const isConnected = connectedApps[integration.id];
              const isAvailable = integration.status === 'Available';
              
              return (
                <Card key={integration.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        {isAvailable && (
                          <Switch
                            checked={isConnected}
                            onCheckedChange={() => toggleConnection(integration.id)}
                          />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-therapy-600">{integration.name}</CardTitle>
                    <Badge variant="outline" className="w-fit text-xs">
                      {integration.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{integration.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700">Features:</h4>
                      <div className="space-y-1">
                        {integration.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {isAvailable ? (
                        <>
                          <Button 
                            className={`flex-1 ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-therapy-500 to-indigo-500 hover:from-therapy-600 hover:to-indigo-600'} text-white border-0`}
                            onClick={() => toggleConnection(integration.id)}
                          >
                            {isConnected ? 'Connected' : 'Connect'}
                            {isConnected && <CheckCircle className="h-4 w-4 ml-2" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" className="flex-1" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Security & Privacy */}
          <Card className="bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  Privacy & Security
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-therapy-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-therapy-600 mb-1">End-to-End Encryption</h3>
                      <p className="text-sm text-slate-600">All data transferred between apps is encrypted using industry-standard protocols.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-600 mb-1">Data Control</h3>
                      <p className="text-sm text-slate-600">You have full control over what data is shared and can disconnect any integration at any time.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-1">Real-time Sync</h3>
                      <p className="text-sm text-slate-600">Data is synchronized in real-time while maintaining the highest security standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-600 mb-1">OAuth Authentication</h3>
                      <p className="text-sm text-slate-600">Secure OAuth connections ensure your login credentials are never stored on our servers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
