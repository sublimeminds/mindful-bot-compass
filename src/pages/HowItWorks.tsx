
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Brain, 
  Heart, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Zap,
  Clock,
  Globe,
  Award,
  TrendingUp,
  Volume2,
  Mic,
  Eye,
  BarChart3,
  Crown,
  UserCheck,
  Headphones,
  Calendar,
  Smartphone,
  Lock,
  Target,
  Lightbulb,
  Sparkles,
  Play,
  Settings,
  Home,
  BookOpen,
  FileText,
  Download,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Monitor,
  Bell,
  User,
  CreditCard,
  Search,
  Filter,
  Menu,
  Camera,
  Video,
  Phone,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeGuideSection, setActiveGuideSection] = useState('getting-started');
  
  useSafeSEO({
    title: 'Complete Start Guide - TherapySync AI Platform',
    description: 'Comprehensive guide to using TherapySync - from account setup to advanced features. Everything you need to know to get the most from our AI therapy platform.',
    keywords: 'TherapySync guide, AI therapy tutorial, mental health platform help, therapy app instructions'
  });

  const quickStartSteps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up with email or social login and complete your secure profile setup.",
      icon: UserCheck,
      time: "2 minutes",
      details: [
        "Choose a secure password",
        "Verify your email address", 
        "Set up two-factor authentication (recommended)",
        "Review privacy settings"
      ]
    },
    {
      number: "02", 
      title: "Complete Assessment",
      description: "Take our comprehensive mental health assessment to personalize your experience.",
      icon: FileText,
      time: "5-7 minutes",
      details: [
        "Answer questions about your mental health goals",
        "Share relevant background information",
        "Indicate preferred communication styles",
        "Set therapy focus areas"
      ]
    },
    {
      number: "03",
      title: "Choose Your AI Therapist",
      description: "Browse and select from our diverse range of specialized AI therapists.",
      icon: Brain,
      time: "3-5 minutes",
      details: [
        "Review therapist specializations (CBT, DBT, etc.)",
        "Read personality profiles and approaches",
        "Preview voice samples and interaction styles",
        "Make your selection (you can change anytime)"
      ]
    },
    {
      number: "04",
      title: "Start Your First Session",
      description: "Begin your mental health journey with your first personalized therapy session.",
      icon: Play,
      time: "15-30 minutes",
      details: [
        "Choose voice or text communication",
        "Start with introductory conversation",
        "Explore platform features during session",
        "Set up ongoing session schedule"
      ]
    }
  ];

  const detailedGuides = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: UserCheck,
      content: {
        overview: "Everything you need to know to create your account and begin your therapy journey.",
        sections: [
          {
            title: "Account Creation & Setup",
            content: [
              "Visit therapysync.com and click 'Get Started'",
              "Choose registration method: email/password or social login",
              "Complete profile information including name, age, location",
              "Verify your email address through the confirmation link",
              "Set up security preferences including two-factor authentication",
              "Review and accept our privacy policy and terms of service"
            ]
          },
          {
            title: "Initial Assessment Process",
            content: [
              "The assessment takes 5-7 minutes and is completely private",
              "Questions cover mental health history, current concerns, and goals",
              "Indicate any crisis risk factors or immediate concerns",
              "Select preferred therapy approaches (CBT, DBT, mindfulness, etc.)",
              "Choose communication preferences (voice, text, or both)",
              "Set availability and preferred session times"
            ]
          },
          {
            title: "Platform Overview Tour",
            content: [
              "Dashboard: Your central hub for sessions, progress, and insights",
              "Chat Interface: Where you'll conduct therapy sessions",
              "Progress Tracker: Visual analytics of your mental health journey",
              "Resource Library: Educational materials and tools",
              "Settings: Customize your experience and privacy controls",
              "Crisis Support: 24/7 emergency resources and contacts"
            ]
          }
        ]
      }
    },
    {
      id: 'navigation',
      title: 'Platform Navigation',
      icon: Monitor,
      content: {
        overview: "Master the TherapySync interface and find everything you need quickly.",
        sections: [
          {
            title: "Dashboard Overview",
            content: [
              "Welcome section with quick session start options",
              "Recent activity feed showing your therapy progress",
              "Mood tracker widget for daily emotional check-ins",
              "Upcoming appointments and session reminders",
              "Quick stats on session count, goals achieved, and streaks",
              "Recommended actions based on your activity patterns"
            ]
          },
          {
            title: "Main Navigation Menu",
            content: [
              "Home: Return to dashboard from anywhere",
              "Sessions: View history, schedule new sessions, and manage appointments",
              "Progress: Detailed analytics, mood patterns, and goal tracking",
              "Resources: Educational content, exercises, and self-help tools",
              "Community: Connect with others in moderated support groups",
              "Settings: Account, privacy, notifications, and preferences"
            ]
          },
          {
            title: "Mobile Navigation",
            content: [
              "Bottom tab bar for easy thumb navigation",
              "Swipe gestures for quick actions",
              "Offline mode indicators and sync status",
              "Emergency contacts readily accessible",
              "One-tap session start from any screen",
              "Voice commands for hands-free navigation"
            ]
          }
        ]
      }
    },
    {
      id: 'ai-therapist',
      title: 'AI Therapist Selection',
      icon: Brain,
      content: {
        overview: "Choose the perfect AI therapist match for your needs and preferences.",
        sections: [
          {
            title: "Available AI Therapists",
            content: [
              "Dr. Sarah Chen - CBT specialist for anxiety and depression",
              "Dr. Marcus Williams - DBT expert for emotional regulation",
              "Dr. Elena Rodriguez - Mindfulness and stress reduction focus",
              "Dr. James Park - Trauma-informed therapy and PTSD support",
              "Dr. Amara Singh - Cultural competency and identity issues",
              "Dr. David Thompson - Addiction counseling and recovery support",
              "Dr. Lisa Anderson - Relationship and family therapy",
              "Dr. Ahmed Hassan - Crisis intervention and suicide prevention"
            ]
          },
          {
            title: "Matching Process",
            content: [
              "AI analyzes your assessment responses for optimal matching",
              "Consider therapeutic approach preferences (CBT, DBT, humanistic)",
              "Personality compatibility scores based on communication style",
              "Specialization alignment with your specific concerns",
              "Cultural and linguistic preferences consideration",
              "Availability and timezone compatibility"
            ]
          },
          {
            title: "Switching Therapists",
            content: [
              "You can change therapists at any time without penalty",
              "Progress and session history transfers to new therapist",
              "Transition sessions help maintain continuity of care",
              "Feedback system to improve future matching",
              "No limit on therapist changes during subscription",
              "Seamless handoff of treatment plans and goals"
            ]
          }
        ]
      }
    },
    {
      id: 'sessions',
      title: 'Session Management',
      icon: MessageSquare,
      content: {
        overview: "Learn how to start, manage, and get the most from your therapy sessions.",
        sections: [
          {
            title: "Starting a Session",
            content: [
              "Click 'Start Session' from dashboard or sessions page",
              "Choose immediate session or schedule for later",
              "Select communication method: voice, text, or video",
              "Set session duration (15, 30, 45, or 60 minutes)",
              "Choose private or shareable session (for family therapy)",
              "Enable recording if desired (encrypted and private)"
            ]
          },
          {
            title: "During Your Session",
            content: [
              "Natural conversation - no scripts or rigid structure",
              "AI responds to emotional cues and adapts in real-time",
              "Use pause feature to collect thoughts or take notes",
              "Access crisis support button if needed during session",
              "Session timer and break reminders for longer sessions",
              "Live emotional state tracking with privacy controls"
            ]
          },
          {
            title: "Session Controls & Features",
            content: [
              "Pause/Resume: Take breaks without ending session",
              "Volume/Speed: Adjust audio to your preferences",
              "Transcript: Real-time text of voice conversations",
              "Emotional Insights: See detected emotional patterns",
              "Crisis Alert: Immediate escalation to human support",
              "Session Notes: Private notes visible only to you"
            ]
          },
          {
            title: "Ending Sessions",
            content: [
              "Natural conclusion or manual session end",
              "Automatic session summary and key insights",
              "Homework assignments and follow-up actions",
              "Next session scheduling suggestions",
              "Session rating and feedback collection",
              "Progress updates and goal tracking"
            ]
          }
        ]
      }
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      icon: BarChart3,
      content: {
        overview: "Monitor your mental health journey with comprehensive analytics and insights.",
        sections: [
          {
            title: "Mood Tracking",
            content: [
              "Daily mood check-ins with customizable prompts",
              "Emotional range tracking (anxiety, depression, stress, joy)",
              "Trigger identification and pattern recognition",
              "Weekly and monthly mood trend analysis",
              "Correlation with activities, weather, and life events",
              "Export mood data for external healthcare providers"
            ]
          },
          {
            title: "Goal Setting & Achievement",
            content: [
              "SMART goals framework for mental health objectives",
              "Weekly and monthly milestone tracking",
              "Progress visualization with charts and graphs",
              "Achievement badges and motivation system",
              "Goal adjustment based on progress and circumstances",
              "Celebration of milestones and breakthroughs"
            ]
          },
          {
            title: "Session Analytics",
            content: [
              "Session frequency and consistency tracking",
              "Time spent in different therapeutic activities",
              "Emotional state progression throughout sessions",
              "Topic focus areas and therapeutic approach effectiveness",
              "Engagement levels and participation metrics",
              "Comparative analysis of different therapist approaches"
            ]
          },
          {
            title: "Insights & Recommendations",
            content: [
              "AI-generated insights from your progress data",
              "Personalized recommendations for continued growth",
              "Early warning systems for mental health concerns",
              "Optimal session timing based on your patterns",
              "Suggested coping strategies based on successful techniques",
              "Integration opportunities with lifestyle factors"
            ]
          }
        ]
      }
    },
    {
      id: 'crisis-support',
      title: 'Crisis Support Features',
      icon: Shield,
      content: {
        overview: "Understand our comprehensive crisis management and emergency support systems.",
        sections: [
          {
            title: "24/7 Crisis Detection",
            content: [
              "Real-time analysis of conversation for crisis indicators",
              "Automatic escalation protocols for high-risk situations",
              "Immediate connection to human crisis counselors",
              "Integration with local emergency services when appropriate",
              "Safety planning tools and crisis resource library",
              "Family/friend notification systems (with your permission)"
            ]
          },
          {
            title: "Emergency Contacts & Resources",
            content: [
              "Pre-configured emergency contact list",
              "Local crisis hotline numbers and chat services",
              "Nearest emergency room and mental health facilities",
              "Crisis text line integration (text HOME to 741741)",
              "National Suicide Prevention Lifeline (988)",
              "LGBTQ+, veteran, and specialized crisis resources"
            ]
          },
          {
            title: "Safety Planning Tools",
            content: [
              "Personalized safety plan creation and updates",
              "Warning sign identification and coping strategies",
              "Reason for living reminders and motivational content",
              "Emergency contact quick-dial from any screen",
              "Location sharing with trusted contacts during crisis",
              "Automated check-ins during high-risk periods"
            ]
          }
        ]
      }
    },
    {
      id: 'settings',
      title: 'Settings & Preferences',
      icon: Settings,
      content: {
        overview: "Customize your TherapySync experience for optimal privacy and usability.",
        sections: [
          {
            title: "Privacy Controls",
            content: [
              "Data retention settings and automatic deletion options",
              "Session recording preferences and encrypted storage",
              "Third-party integration permissions and data sharing",
              "Anonymous usage analytics opt-in/opt-out",
              "Right to delete account and all associated data",
              "Export personal data in standard formats"
            ]
          },
          {
            title: "Notification Management",
            content: [
              "Session reminders and appointment notifications",
              "Progress milestone alerts and achievement notifications",
              "Crisis support check-ins and safety notifications",
              "Platform updates and feature announcements",
              "Community activity and support group notifications",
              "Quiet hours and do-not-disturb scheduling"
            ]
          },
          {
            title: "Accessibility Options",
            content: [
              "Text size and contrast adjustments for visual impairments",
              "Screen reader compatibility and keyboard navigation",
              "Voice command integration for hands-free operation",
              "Language translation for non-English speakers",
              "Cognitive accessibility features for focus and attention",
              "Motor accessibility for users with physical limitations"
            ]
          }
        ]
      }
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Usage',
      icon: Smartphone,
      content: {
        overview: "Get the most from TherapySync on your mobile device with our native apps.",
        sections: [
          {
            title: "Download & Installation",
            content: [
              "iOS App Store: Search 'TherapySync' or use direct link",
              "Google Play Store: Available for Android 8.0 and higher",
              "System requirements: 2GB RAM, 1GB storage space",
              "Automatic updates enabled by default",
              "Offline mode capabilities for limited connectivity",
              "Cross-device synchronization with web platform"
            ]
          },
          {
            title: "Mobile-Specific Features",
            content: [
              "Biometric login (fingerprint, face recognition)",
              "Push notifications for sessions and reminders",
              "Voice recording optimization for mobile microphones",
              "Background app refresh for real-time notifications",
              "Location-based crisis resource suggestions",
              "Integration with health apps (Apple Health, Google Fit)"
            ]
          },
          {
            title: "Offline Capabilities",
            content: [
              "Download sessions for offline review and reflection",
              "Offline mood tracking with sync when connected",
              "Cached resource library for emergency access",
              "Crisis contact information always accessible",
              "Offline note-taking with automatic sync",
              "Limited AI responses cached for emergency situations"
            ]
          }
        ]
      }
    }
  ];

  const troubleshootingFAQs = [
    {
      question: "I can't hear the AI therapist during voice sessions",
      answer: "Check your device volume settings, ensure TherapySync has microphone permissions, and try switching to a different audio output device. If using headphones, check the connection. You can also switch to text mode temporarily while troubleshooting."
    },
    {
      question: "My sessions keep disconnecting or freezing",
      answer: "This is usually due to internet connectivity issues. Try switching to a stronger WiFi network, closing other apps using bandwidth, or restarting your device. The platform automatically saves your progress every 30 seconds to prevent data loss."
    },
    {
      question: "The AI doesn't seem to understand my concerns",
      answer: "Try being more specific about your feelings and situations. The AI learns from your interactions, so it may take a few sessions to fully understand your communication style. You can also try switching to a different AI therapist whose approach might be more compatible."
    },
    {
      question: "How do I change my AI therapist?",
      answer: "Go to Settings > Therapist Selection, browse available options, and select 'Switch Therapist.' Your session history and progress will automatically transfer to maintain continuity of care."
    },
    {
      question: "I'm having a mental health crisis - what should I do?",
      answer: "Click the 'Crisis Support' button available on every page for immediate help. You can also call 988 (Suicide & Crisis Lifeline) or text HOME to 741741. Our platform automatically detects crisis language and can connect you with human counselors immediately."
    },
    {
      question: "Can I use TherapySync offline?",
      answer: "Limited offline functionality is available through our mobile apps, including mood tracking, accessing crisis contacts, and reviewing downloaded session notes. However, live AI therapy sessions require an internet connection."
    },
    {
      question: "Is my therapy data private and secure?",
      answer: "Yes, all data is encrypted end-to-end, HIPAA compliant, and stored on secure servers. We never share personal information without explicit consent. You can review our privacy policy and delete your account at any time."
    },
    {
      question: "How much does TherapySync cost?",
      answer: "We offer a 7-day free trial, then plans start at $29/month for basic AI therapy, $49/month for premium features, or $99/month for hybrid AI/human therapy. All plans include crisis support and progress tracking."
    }
  ];

  const bestPractices = [
    {
      title: "Optimize Your Session Environment",
      tips: [
        "Find a quiet, private space where you won't be interrupted",
        "Use headphones for better audio quality and privacy",
        "Ensure good lighting if using video sessions",
        "Have water nearby and tissues if needed",
        "Turn off notifications on other devices during sessions"
      ]
    },
    {
      title: "Maximize Therapeutic Benefit",
      tips: [
        "Be honest and open - the AI is designed to be non-judgmental",
        "Take notes during or after sessions for later reflection",
        "Complete mood check-ins daily for better progress tracking",
        "Practice suggested coping techniques between sessions",
        "Set specific, measurable goals for your mental health journey"
      ]
    },
    {
      title: "Build Consistent Habits",
      tips: [
        "Schedule regular session times that work with your routine",
        "Use calendar reminders and platform notifications",
        "Start with shorter, more frequent sessions rather than long, infrequent ones",
        "Engage with the platform's educational resources between sessions",
        "Connect with the community features for additional support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-50 via-calm-50 to-therapy-100 opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-calm-50 via-transparent to-therapy-50 opacity-60"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-therapy-400 to-calm-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-calm-400 to-therapy-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-8 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
                <BookOpen className="h-5 w-5 mr-2" />
                Complete Start Guide
                <Lightbulb className="h-5 w-5 ml-2" />
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Master
                <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  TherapySync
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed font-medium">
                Your comprehensive guide to using TherapySync effectively. From setup to advanced features, 
                everything you need to transform your mental health journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/auth')}
                >
                  <Play className="h-6 w-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 hover:bg-gradient-to-r hover:from-therapy-50 hover:to-calm-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                  onClick={() => navigate('/downloads')}
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download App
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
                <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Quick Start Guide
                </span>
              </h2>
              <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
                Get up and running with TherapySync in under 15 minutes with our streamlined setup process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {quickStartSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse shadow-lg">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-sm font-bold text-therapy-500 mb-2">STEP {step.number}</div>
                          <h3 className="text-xl font-semibold mb-3 text-therapy-800">{step.title}</h3>
                          <p className="text-therapy-600 text-sm mb-2">{step.description}</p>
                          <div className="flex items-center justify-center text-xs text-therapy-500 mb-4">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.time}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                              <span className="text-sm text-therapy-600">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arrow connector for desktop */}
                    {index < quickStartSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-6 w-6 text-therapy-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Detailed Guide Sections */}
        <section className="py-20 bg-gradient-to-br from-calm-50 via-therapy-50 to-calm-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
                <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Comprehensive User Guide
                </span>
              </h2>
              <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
                Deep dive into every aspect of TherapySync to maximize your mental health journey.
              </p>
            </div>

            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
                {detailedGuides.map((guide) => {
                  const IconComponent = guide.icon;
                  return (
                    <TabsTrigger 
                      key={guide.id} 
                      value={guide.id}
                      className="flex items-center space-x-2 text-xs md:text-sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden md:inline">{guide.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {detailedGuides.map((guide) => (
                <TabsContent key={guide.id} value={guide.id}>
                  <Card className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center">
                          {React.createElement(guide.icon, { className: "h-6 w-6 text-white" })}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-therapy-900">{guide.title}</h3>
                          <p className="text-therapy-600">{guide.content.overview}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {guide.content.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-l-4 border-therapy-200 pl-6">
                            <h4 className="text-lg font-semibold text-therapy-800 mb-3">{section.title}</h4>
                            <ul className="space-y-2">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start space-x-3">
                                  <ChevronRight className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-therapy-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Troubleshooting & FAQ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
                <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Troubleshooting & FAQ
                </span>
              </h2>
              <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
                Common questions and solutions to help you resolve issues quickly.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {troubleshootingFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-therapy-200 rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-left hover:bg-therapy-50">
                      <div className="flex items-center space-x-3">
                        <HelpCircle className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                        <span className="font-medium text-therapy-800">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-therapy-600 leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-20 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Best Practices for Success
              </h2>
              <p className="text-xl text-therapy-100 max-w-3xl mx-auto">
                Expert tips and strategies to maximize the effectiveness of your TherapySync experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bestPractices.map((practice, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-white">{practice.title}</h3>
                    <ul className="space-y-3">
                      {practice.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <Star className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                          <span className="text-therapy-100 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-therapy-50 via-calm-50 to-therapy-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Ready to Begin Your Journey?
              </span>
            </h2>
            <p className="text-xl text-therapy-600 mb-8 max-w-3xl mx-auto">
              Now that you understand how TherapySync works, take the first step toward better mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-therapy-500/25 transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-therapy-500/20 transition-all duration-300"
                onClick={() => navigate('/downloads')}
              >
                <Download className="h-5 w-5 mr-2" />
                Download App
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;
