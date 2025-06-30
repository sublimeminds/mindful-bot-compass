
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Smartphone, Heart, Calendar, Brain, Users, Music,
  Search, Filter, CheckCircle, Settings, Zap, Star,
  Clock, Shield, Globe, Activity, Headphones, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Integrations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [connectedApps, setConnectedApps] = useState<{[key: string]: boolean}>({
    'apple-health': true,
    'google-fit': false,
    'spotify': true,
    'calendar': false
  });

  useSafeSEO({
    title: 'App Integrations & Connections - Unified Mental Health Platform | TherapySync',
    description: 'Connect your favorite health apps, wearables, and productivity tools to create a unified mental wellness ecosystem.',
    keywords: 'app integrations, health app sync, wearable integration, mental health ecosystem, API connections'
  });

  const categories = ['All', 'Health & Fitness', 'Productivity', 'Entertainment', 'Social', 'Wearables'];

  const integrations = [
    {
      name: 'Apple Health',
      category: 'Health & Fitness',
      description: 'Sync health data, sleep tracking, and activity metrics for comprehensive wellness insights',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      connected: connectedApps['apple-health'],
      features: ['Sleep data', 'Heart rate', 'Activity levels', 'Mood correlation'],
      popularity: 'Most Popular'
    },
    {
      name: 'Google Fit',
      category: 'Health & Fitness',
      description: 'Import fitness data and activity tracking to correlate physical and mental wellness',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      connected: connectedApps['google-fit'],
      features: ['Step tracking', 'Workout data', 'Sleep analysis', 'Stress levels'],
      popularity: 'Popular'
    },
    {
      name: 'Samsung Health',
      category: 'Health & Fitness',
      description: 'Comprehensive health tracking integration with Samsung devices and wearables',
      icon: Smartphone,
      color: 'from-blue-500 to-indigo-500',
      connected: false,
      features: ['Comprehensive health data', 'Stress monitoring', 'Sleep tracking', 'Heart rate zones'],
      popularity: 'New'
    },
    {
      name: 'Fitbit',
      category: 'Wearables',
      description: 'Connect your Fitbit device for continuous health monitoring and insights',
      icon: Activity,
      color: 'from-teal-500 to-cyan-500',
      connected: false,
      features: ['24/7 tracking', 'Sleep stages', 'Stress score', 'Active minutes'],
      popularity: 'Popular'
    },
    {
      name: 'Oura Ring',
      category: 'Wearables',
      description: 'Advanced sleep and recovery tracking from your Oura Ring',
      icon: Heart,
      color: 'from-purple-500 to-violet-500',
      connected: false,
      features: ['Sleep optimization', 'Recovery scores', 'Temperature tracking', 'HRV analysis'],
      popularity: 'Premium'
    },
    {
      name: 'Google Calendar',
      category: 'Productivity',
      description: 'Schedule therapy sessions and set wellness reminders automatically',
      icon: Calendar,
      color: 'from-blue-600 to-blue-700',
      connected: connectedApps['calendar'],
      features: ['Auto scheduling', 'Reminders', 'Session planning', 'Goal tracking'],
      popularity: 'Essential'
    },
    {
      name: 'Notion',
      category: 'Productivity',
      description: 'Export your journal entries and progress reports to your Notion workspace',
      icon: Brain,
      color: 'from-slate-600 to-slate-700',
      connected: false,
      features: ['Journal sync', 'Progress reports', 'Goal tracking', 'Templates'],
      popularity: 'New'
    },
    {
      name: 'Todoist',
      category: 'Productivity',
      description: 'Create wellness tasks and habit tracking directly in your task manager',
      icon: CheckCircle,
      color: 'from-red-500 to-orange-500',
      connected: false,
      features: ['Habit tracking', 'Wellness tasks', 'Goal milestones', 'Progress sync'],
      popularity: 'Popular'
    },
    {
      name: 'Spotify',
      category: 'Entertainment',
      description: 'Access curated playlists for meditation, focus, and mood enhancement',
      icon: Music,
      color: 'from-green-500 to-green-600',
      connected: connectedApps['spotify'],
      features: ['Mood playlists', 'Meditation music', 'Focus tracks', 'Sleep sounds'],
      popularity: 'Popular'
    },
    {
      name: 'Headspace',
      category: 'Health & Fitness',
      description: 'Integrate mindfulness sessions and meditation progress tracking',
      icon: Headphones,
      color: 'from-orange-500 to-yellow-500',
      connected: false,
      features: ['Meditation sync', 'Mindfulness tracking', 'Progress sharing', 'Session history'],
      popularity: 'Partner'
    },
    {
      name: 'Calm',
      category: 'Health & Fitness',
      description: 'Connect with Calm for sleep stories and meditation session tracking',
      icon: Heart,
      color: 'from-indigo-500 to-purple-500',
      connected: false,
      features: ['Sleep stories', 'Meditation data', 'Mood tracking', 'Daily check-ins'],
      popularity: 'Partner'
    },
    {
      name: 'Discord Wellness Bot',
      category: 'Social',
      description: 'Mental health check-ins and support within your Discord communities',
      icon: MessageSquare,
      color: 'from-indigo-600 to-purple-600',
      connected: false,
      features: ['Community support', 'Daily check-ins', 'Mood sharing', 'Group challenges'],
      popularity: 'Beta'
    },
    {
      name: 'Slack Wellness',
      category: 'Productivity',
      description: 'Workplace wellness integration with mood tracking and break reminders',
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      connected: false,
      features: ['Workplace wellness', 'Break reminders', 'Team mood', 'Stress alerts'],
      popularity: 'Enterprise'
    },
    {
      name: 'Garmin Connect',
      category: 'Wearables',
      description: 'Advanced fitness and wellness tracking from Garmin devices',
      icon: Activity,
      color: 'from-blue-700 to-indigo-700',
      connected: false,
      features: ['Advanced metrics', 'Stress tracking', 'Body battery', 'Training load'],
      popularity: 'Athletic'
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleConnection = (integrationName: string) => {
    const key = integrationName.toLowerCase().replace(/\s+/g, '-');
    setConnectedApps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'Most Popular': return 'bg-green-100 text-green-800';
      case 'Popular': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-yellow-100 text-yellow-800';
      case 'Essential': return 'bg-indigo-100 text-indigo-800';
      case 'Partner': return 'bg-pink-100 text-pink-800';
      case 'Beta': return 'bg-orange-100 text-orange-800';
      case 'Enterprise': return 'bg-slate-100 text-slate-800';
      case 'Athletic': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedCount = Object.values(connectedApps).filter(Boolean).length;

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
              Create a unified mental wellness ecosystem by connecting your favorite health apps, wearables, 
              and productivity tools for comprehensive insights and seamless experiences.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: CheckCircle, label: 'Connected Apps', value: connectedCount.toString(), color: 'from-green-500 to-emerald-500' },
              { icon: Zap, label: 'Available Integrations', value: integrations.length.toString(), color: 'from-blue-500 to-indigo-500' },
              { icon: Shield, label: 'Secure Connections', value: '100%', color: 'from-purple-500 to-violet-500' },
              { icon: Globe, label: 'Data Sync', value: 'Real-time', color: 'from-orange-500 to-red-500' }
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

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIntegrations.map((integration, index) => {
              const IconComponent = integration.icon;
              const isConnected = connectedApps[integration.name.toLowerCase().replace(/\s+/g, '-')];
              
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getPopularityColor(integration.popularity)}>
                          {integration.popularity}
                        </Badge>
                        <Switch
                          checked={isConnected}
                          onCheckedChange={() => handleToggleConnection(integration.name)}
                        />
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
                      <div className="grid grid-cols-2 gap-1">
                        {integration.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No integrations found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Integration Benefits */}
          <Card className="mt-12 bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  Why Connect Your Apps?
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: Brain, 
                    title: 'Comprehensive Insights', 
                    description: 'Get a complete picture of your mental and physical health by connecting all your data sources.' 
                  },
                  { 
                    icon: Clock, 
                    title: 'Automated Tracking', 
                    description: 'Reduce manual input with automatic data sync from your favorite health and productivity apps.' 
                  },
                  { 
                    icon: Star, 
                    title: 'Personalized Recommendations', 
                    description: 'Receive AI-powered insights based on comprehensive data from multiple sources.' 
                  }
                ].map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-therapy-600 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  );
                })}
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
