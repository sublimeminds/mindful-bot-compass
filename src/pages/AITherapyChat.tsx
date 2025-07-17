
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mic, Brain, Users, Award, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import TherapistTeamCarousel from '@/components/ai/TherapistTeamCarousel';
import WorkingVoiceChat from '@/components/voice/WorkingVoiceChat';

const AITherapyChat = () => {
  const navigate = useNavigate();
  const [demoMessages, setDemoMessages] = useState([
    {
      id: 1,
      type: 'therapist',
      content: "Hello! I'm Dr. Sarah Chen, your AI therapist. I'm here to provide you with professional mental health support. How are you feeling today?",
      timestamp: new Date(Date.now() - 120000),
      techniques: ['Active Listening', 'Empathetic Response']
    },
    {
      id: 2,
      type: 'user',
      content: "I've been feeling really anxious lately about work. I can't seem to focus and I'm constantly worried about making mistakes.",
      timestamp: new Date(Date.now() - 100000)
    },
    {
      id: 3,
      type: 'therapist',
      content: "Thank you for sharing that with me. Work anxiety is very common, and it's understandable that you're feeling this way. Let's explore this together using some cognitive behavioral techniques. Can you tell me about a specific situation at work that triggered these feelings?",
      timestamp: new Date(Date.now() - 80000),
      techniques: ['CBT - Cognitive Restructuring', 'Validation', 'Socratic Questioning'],
      analysis: "Client showing signs of work-related anxiety with cognitive symptoms (focus issues) and emotional symptoms (worry). Appropriate for CBT intervention."
    },
    {
      id: 4,
      type: 'user',
      content: "Yesterday I had to present to my team and I kept thinking 'What if I mess up?' and 'Everyone will think I'm incompetent.' I barely slept the night before.",
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 5,
      type: 'therapist',
      content: "I can hear how distressing those thoughts were for you. What you're describing sounds like catastrophic thinking - a common pattern where we jump to worst-case scenarios. Let's examine these thoughts together. When you think 'Everyone will think I'm incompetent,' what evidence do you have for and against this thought?",
      timestamp: new Date(Date.now() - 40000),
      techniques: ['CBT - Thought Challenging', 'Cognitive Restructuring', 'Evidence Examination'],
      analysis: "Identified catastrophic thinking pattern. Client responding well to CBT approach. Implementing thought record technique.",
      progress: "Session Goal: Challenge negative thought patterns ✓ | Technique: Thought Record | Mood: Anxious → Curious"
    },
    {
      id: 6,
      type: 'user',
      content: "Well... actually my manager gave me positive feedback last week, and my colleagues often ask for my input on projects. I guess there's not much evidence they think I'm incompetent.",
      timestamp: new Date(Date.now() - 20000)
    },
    {
      id: 7,
      type: 'therapist',
      content: "Excellent insight! You've just demonstrated how examining evidence can help us see our thoughts more clearly. This is a key skill in managing anxiety. For homework, I'd like you to practice this technique when you notice anxious thoughts. Would you be willing to try the '3-2-1' grounding technique I can teach you for immediate anxiety relief?",
      timestamp: new Date(Date.now() - 5000),
      techniques: ['CBT - Homework Assignment', 'Grounding Techniques', 'Positive Reinforcement'],
      analysis: "Excellent therapeutic progress. Client showing cognitive flexibility and insight. Ready for skill-building phase.",
      progress: "Breakthrough: Client challenging own thoughts independently | Next: Grounding techniques | Confidence: Increasing"
    }
  ]);

  const addMessage = (content: string, type: 'user' | 'therapist') => {
    const newMessage = {
      id: demoMessages.length + 1,
      type,
      content,
      timestamp: new Date()
    };
    setDemoMessages([...demoMessages, newMessage]);
  };

  const stats = [
    { icon: Brain, label: 'AI Therapists', value: '14+', description: 'Specialized therapeutic approaches' },
    { icon: Users, label: 'Active Users', value: '2,500+', description: 'Growing community' },
    { icon: MessageCircle, label: 'Sessions', value: '15,000+', description: 'Therapy conversations' },
    { icon: Award, label: 'Success Rate', value: '87%', description: 'Positive outcomes' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Psychology',
      description: 'Our AI therapists are trained on evidence-based therapeutic approaches including CBT, DBT, and mindfulness techniques.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'All conversations are encrypted and confidential. Your mental health journey remains completely private.'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Each AI therapist adapts to your unique needs, personality, and therapeutic goals for optimal outcomes.'
    },
    {
      icon: MessageCircle,
      title: '24/7 Availability',
      description: 'Access professional mental health support whenever you need it, day or night.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Advanced AI Therapy Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Intelligent Therapy
            <span className="block text-blue-600">Conversations</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of mental health support with AI-powered therapy chats that understand, adapt, and respond with professional-grade therapeutic techniques.
          </p>
          <Button 
            onClick={() => navigate('/chat')}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Therapy Chat
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-sm bg-white/80">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-800">{stat.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose AI Therapy?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white/80 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Therapists Section */}
      <div className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Meet Our AI Therapists
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Each AI therapist is specialized in different therapeutic approaches and techniques, 
            ensuring you get the most appropriate support for your unique needs.
          </p>
          <TherapistTeamCarousel />
        </div>
      </div>

      {/* Demo Sections */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Voice Chat Demo */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Voice Therapy Sessions
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience natural voice conversations with Dr. Sarah Chen. Speak naturally and receive 
              empathetic responses with professional therapeutic techniques.
            </p>
            <div className="max-w-4xl mx-auto">
              <WorkingVoiceChat />
            </div>
          </div>

          {/* Advanced Text Chat Demo */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Advanced Text Therapy
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              See how our AI therapists use evidence-based techniques, provide real-time analysis, 
              and track your progress throughout the conversation.
            </p>
            
            <Card className="max-w-4xl mx-auto shadow-lg bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Therapy Session Demo - CBT for Work Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {demoMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        
                        {message.type === 'therapist' && (message.techniques || message.analysis || message.progress) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {message.techniques && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-purple-600">Techniques Used:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {message.techniques.map((technique, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                      {technique}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {message.analysis && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-green-600">AI Analysis:</span>
                                <p className="text-xs text-green-700 mt-1">{message.analysis}</p>
                              </div>
                            )}
                            {message.progress && (
                              <div>
                                <span className="text-xs font-semibold text-blue-600">Progress:</span>
                                <p className="text-xs text-blue-700 mt-1">{message.progress}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/chat')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Your Own Therapy Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITherapyChat;
