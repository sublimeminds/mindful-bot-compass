
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Users, 
  Brain, 
  Heart,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { useTherapist } from "@/contexts/TherapistContext";
import TherapyChatInterface from "@/components/chat/TherapyChatInterface";
import SessionTimer from "@/components/session/SessionTimer";
import SessionEndModal from "@/components/SessionEndModal";
import TherapistCard from "@/components/therapist/TherapistCard";
import { therapists } from "@/components/therapist/TherapistMatcher";
import Header from "@/components/Header";
import TreeLogo from "@/components/ui/TreeLogo";

const TherapyChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSession, startSession, endSession } = useSession();
  const { currentTherapist, setCurrentTherapist } = useTherapist();
  const [showEndModal, setShowEndModal] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleStartSession = async () => {
    if (!currentTherapist) {
      const defaultTherapist = therapists[0];
      setCurrentTherapist(defaultTherapist);
    }
    await startSession();
    setActiveTab('chat');
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const confirmEndSession = async () => {
    await endSession();
    setShowEndModal(false);
    setActiveTab('overview');
    navigate('/session-history');
  };

  const handleSelectTherapist = (therapist: typeof therapists[0]) => {
    setCurrentTherapist(therapist);
    if (currentSession) {
      handleStartSession();
    }
  };

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Conversations",
      description: "Engage in meaningful therapy sessions with advanced AI"
    },
    {
      icon: Brain,
      title: "Personalized Insights",
      description: "Get tailored feedback and coping strategies"
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "24/7 availability for when you need it most"
    },
    {
      icon: Users,
      title: "Multiple Therapist Styles",
      description: "Choose from different therapeutic approaches"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mr-4">
                <TreeLogo size="sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  AI Therapy Sessions
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Your personal space for healing and growth
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="therapists">Choose Therapist</TabsTrigger>
              <TabsTrigger value="chat" disabled={!currentSession}>
                Active Session
                {currentSession && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-lg mx-auto mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Welcome Section */}
              <Card className="border-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <TreeLogo size="sm" />
                        <Sparkles className="h-6 w-6 ml-3" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to Your Therapy Space</h2>
                      <p className="text-therapy-100 mb-6">
                        Take the first step towards better mental health. Our AI therapists are here to support you 24/7.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={handleStartSession}
                          variant="secondary"
                          size="lg"
                          className="bg-white text-therapy-700 hover:bg-therapy-50"
                        >
                          Start Therapy Session
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('therapists')}
                          variant="outline"
                          size="lg"
                          className="border-white text-white hover:bg-white/10"
                        >
                          Choose Your Therapist
                        </Button>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                        <TreeLogo size="lg" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {currentSession && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="h-8 w-8 text-therapy-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl">Active</h3>
                      <p className="text-muted-foreground">Current Session</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-calm-500 mx-auto mb-2" />
                      <SessionTimer />
                      <p className="text-muted-foreground">Session Duration</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl">Growing</h3>
                      <p className="text-muted-foreground">Your Progress</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Therapist Selection Tab */}
            <TabsContent value="therapists" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-2 text-therapy-500" />
                    Choose Your AI Therapist
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Each therapist has a unique approach and personality. Select the one that feels right for you.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {therapists.map((therapist) => (
                      <div key={therapist.id} className="relative">
                        <TherapistCard
                          therapist={therapist}
                          onSelect={() => handleSelectTherapist(therapist)}
                          isSelected={currentTherapist?.id === therapist.id}
                        />
                        {currentTherapist?.id === therapist.id && (
                          <Badge className="absolute -top-2 -right-2 bg-therapy-500">
                            Selected
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {currentTherapist && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Ready to start with {currentTherapist.name}?</h3>
                          <p className="text-muted-foreground text-sm">
                            Begin your therapy session with your selected therapist
                          </p>
                        </div>
                        <Button onClick={handleStartSession}>
                          Start Session
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              {currentSession ? (
                <TherapyChatInterface 
                  onEndSession={handleEndSession}
                  voiceEnabled={voiceEnabled}
                  onVoiceToggle={setVoiceEnabled}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
                    <p className="text-muted-foreground mb-4">
                      Start a new therapy session to begin chatting with your AI therapist.
                    </p>
                    <Button onClick={handleStartSession}>
                      Start New Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SessionEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={confirmEndSession}
      />
    </>
  );
};

export default TherapyChat;
