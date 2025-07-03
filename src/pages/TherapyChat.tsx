
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
import { useAuth } from "@/hooks/useAuth";
import { useTherapist } from "@/contexts/TherapistContext";
import { chatService } from "@/services/chatService";
import Header from "@/components/Header";
import GradientLogo from "@/components/ui/GradientLogo";
import EnhancedTherapyChatInterface from "@/components/therapy/EnhancedTherapyChatInterface";

const TherapyChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedTherapist, therapists } = useTherapist();
  const [showEndModal, setShowEndModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [currentTherapist, setCurrentTherapist] = useState<any>(selectedTherapist);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleStartSession = async () => {
    if (!user) return;
    
    try {
      const newSession = await chatService.createSession(user.id);
      if (newSession) {
        setCurrentSession(newSession);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const confirmEndSession = async () => {
    if (currentSession) {
      await chatService.endSession(currentSession.id);
      setCurrentSession(null);
      setShowEndModal(false);
      setActiveTab('overview');
    }
  };

  const handleSelectTherapist = (therapist: any) => {
    setCurrentTherapist(therapist);
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
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mr-4">
                <GradientLogo size="sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
                  AI Therapy Sessions
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Your personal space for healing and harmony
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
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-lg mx-auto mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Welcome Section */}
              <Card className="border-0 bg-gradient-to-r from-harmony-500 to-flow-500 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <GradientLogo size="sm" />
                        <Sparkles className="h-6 w-6 ml-3" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to Your Therapy Space</h2>
                      <p className="text-harmony-100 mb-6">
                        Take the first step towards better mental health. Our AI therapists are here to support you 24/7.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={handleStartSession}
                          variant="secondary"
                          size="lg"
                          className="bg-white text-harmony-700 hover:bg-harmony-50"
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
                  </div>
                </CardContent>
              </Card>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {therapists.map((therapist) => (
                      <Card key={therapist.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{therapist.name}</h3>
                          <p className="text-muted-foreground mb-3">{therapist.approach}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {therapist.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary">{specialty}</Badge>
                            ))}
                          </div>
                          <Button 
                            onClick={() => handleSelectTherapist(therapist)}
                            className="w-full"
                            variant={currentTherapist?.id === therapist.id ? "default" : "outline"}
                          >
                            {currentTherapist?.id === therapist.id ? "Selected" : "Select"}
                          </Button>
                        </CardContent>
                      </Card>
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
                <EnhancedTherapyChatInterface />
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

      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>End Session?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to end this therapy session?
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => setShowEndModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmEndSession} variant="destructive" className="flex-1">
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TherapyChat;
