import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Mic, Brain, Users, Play, Pause, Volume2 } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import TherapistTeamCarousel from '@/components/ai/TherapistTeamCarousel';
import { useNavigate } from 'react-router-dom';

const AdvancedDemoSection = () => {
  const navigate = useNavigate();
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(0);

  const demoMessages = [
    {
      type: 'therapist',
      content: "I notice you mentioned feeling overwhelmed at work. Let's explore this using some cognitive behavioral techniques. Can you describe a specific situation?",
      techniques: ['CBT - Socratic Questioning', 'Active Listening'],
      analysis: "Client presenting with work-related stress. Appropriate for CBT intervention to identify thought patterns."
    },
    {
      type: 'user',
      content: "Yesterday I had a presentation and kept thinking 'I'm going to embarrass myself' and 'Everyone will judge me.'"
    },
    {
      type: 'therapist',
      content: "Those thoughts sound really distressing. What you're describing is called catastrophic thinking. Let's examine the evidence - have your past presentations actually led to embarrassment?",
      techniques: ['CBT - Thought Challenging', 'Evidence Examination'],
      analysis: "Identified catastrophic thinking pattern. Using evidence-based challenging technique.",
      progress: "Thought Pattern Recognition ✓ | Cognitive Flexibility Building ↗"
    }
  ];

  const analysisInsights = [
    {
      category: 'Emotional Patterns',
      insight: 'Anxiety peaks during performance situations',
      confidence: '94%'
    },
    {
      category: 'Therapeutic Progress',
      insight: 'Strong response to CBT techniques',
      confidence: '89%'
    },
    {
      category: 'Coping Strategies',
      insight: 'Benefits from evidence-based challenges',
      confidence: '91%'
    }
  ];

  return (
    <SafeComponentWrapper name="AdvancedDemoSection">
      <div className="py-20 px-4 bg-gradient-to-br from-mindful-50/30 via-white to-therapy-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-therapy-100 text-therapy-800 border-therapy-200">
              Experience Advanced AI Therapy
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See TherapySync in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our multi-modal therapy platform featuring AI therapist profiles, 
              advanced chat with real-time analysis, and voice interaction capabilities.
            </p>
          </div>

          <Tabs defaultValue="therapists" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-white border border-gray-200 shadow-lg">
              <TabsTrigger value="therapists" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                AI Therapists
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Advanced Chat
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Sessions
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="therapists" className="space-y-8">
              <Card className="bg-white border border-gray-200 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Interactive Therapy Demo</CardTitle>
                  <p className="text-gray-600">
                    Experience real-time AI therapy sessions with personalized responses
                  </p>
                </CardHeader>
                <CardContent>
                  <TherapistTeamCarousel />
                  <div className="text-center mt-8">
                    <Button 
                      onClick={() => navigate('/ai-therapy-chat')}
                      className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-3"
                    >
                      Start Demo Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white border border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-therapy-600" />
                      Live Therapy Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {demoMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-xl ${
                            message.type === 'user' 
                              ? 'bg-therapy-100 text-therapy-900' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm leading-relaxed mb-2">{message.content}</p>
                            
                            {message.techniques && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="mb-2">
                                  <span className="text-xs font-semibold text-therapy-600">Techniques:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {message.techniques.map((technique, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs bg-therapy-50 text-therapy-700 border-therapy-200">
                                        {technique}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {message.analysis && (
                                  <div className="mb-2">
                                    <span className="text-xs font-semibold text-mindful-600">Analysis:</span>
                                    <p className="text-xs text-mindful-700 mt-1">{message.analysis}</p>
                                  </div>
                                )}
                                {message.progress && (
                                  <div>
                                    <span className="text-xs font-semibold text-harmony-600">Progress:</span>
                                    <p className="text-xs text-harmony-700 mt-1">{message.progress}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-mindful-600" />
                      Real-Time Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisInsights.map((insight, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-mindful-50 to-therapy-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{insight.category}</span>
                          <Badge className="bg-mindful-100 text-mindful-800 border-mindful-200">
                            {insight.confidence}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{insight.insight}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        onClick={() => navigate('/chat')}
                        className="w-full bg-mindful-600 hover:bg-mindful-700 text-white"
                      >
                        Start Your Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-8">
              <Card className="bg-white border border-gray-200 shadow-xl max-w-4xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Voice Therapy Sessions</CardTitle>
                  <p className="text-gray-600">
                    Experience natural voice conversations with empathetic AI therapists
                  </p>
                </CardHeader>
                <CardContent className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-therapy-400 to-calm-500 rounded-full flex items-center justify-center mb-6">
                      <Mic className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-therapy-400/20 animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      "Hi there, I'm Dr. Sarah Chen. I can hear the stress in your voice. 
                      Let's work through this together using some breathing techniques..."
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => setIsVoicePlaying(!isVoicePlaying)}
                        className="flex items-center gap-2 bg-therapy-600 hover:bg-therapy-700 text-white"
                      >
                        {isVoicePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isVoicePlaying ? 'Pause' : 'Play'} Demo
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-therapy-200 text-therapy-700 hover:bg-therapy-50"
                      >
                        <Volume2 className="h-4 w-4" />
                        Adjust Volume
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      onClick={() => navigate('/voice-chat')}
                      size="lg"
                      className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-3"
                    >
                      Try Voice Therapy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="bg-white border border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-therapy-700">Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-therapy-400 to-therapy-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">78%</span>
                    </div>
                    <p className="text-sm text-gray-700">Anxiety Reduction</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-mindful-700">Session Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-mindful-400 to-mindful-600 rounded-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-700">12 Techniques Used</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-harmony-700">Mood Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-harmony-400 to-harmony-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-white">↗️</span>
                    </div>
                    <p className="text-sm text-gray-600">Improving Daily</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-harmony-600 hover:bg-harmony-700 text-white px-8 py-3"
                >
                  View Full Analytics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default AdvancedDemoSection;