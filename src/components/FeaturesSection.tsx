
import { Bot, Heart, User, Users, Brain, Shield, Clock, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import GradientLogo from "@/components/ui/GradientLogo";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Therapy",
    description: "Advanced AI trained on therapeutic techniques with crisis detection, cultural awareness, and personalized approaches.",
    useGradientLogo: true
  },
  {
    icon: Brain,
    title: "Intelligent Analytics",
    description: "Comprehensive mood tracking, progress analytics, and predictive insights to optimize your mental health journey.",
    useGradientLogo: false
  },
  {
    icon: Heart,
    title: "Crisis Management",
    description: "24/7 safety monitoring with immediate crisis detection and access to emergency resources and support.",
    useGradientLogo: false
  },
  {
    icon: User,
    title: "Personalized Experience",
    description: "Adaptive AI that learns your preferences, cultural context, and therapeutic needs for truly personalized care.",
    useGradientLogo: true
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with supportive communities, join group sessions, and share your journey with others who understand.",
    useGradientLogo: false
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "HIPAA-compliant platform with end-to-end encryption, secure data handling, and complete privacy protection.",
    useGradientLogo: false
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Intelligent reminders, habit tracking, and personalized session scheduling that adapts to your lifestyle.",
    useGradientLogo: true
  },
  {
    icon: Smartphone,
    title: "Voice & Mobile Ready",
    description: "Full voice interaction capabilities with seamless mobile experience and offline support for uninterrupted care.",
    useGradientLogo: false
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comprehensive Mental Health Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            TherapySync combines cutting-edge AI technology with proven therapeutic approaches, 
            advanced analytics, crisis management, and community support to provide complete mental health care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in bg-gradient-to-br from-white to-gray-50/50 group hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-harmony-500 via-balance-500 to-flow-500 rounded-xl mx-auto mb-4 group-hover:animate-swirl-breathe shadow-lg">
                  {feature.useGradientLogo ? (
                    <GradientLogo 
                      size="md"
                      className="filter brightness-0 invert"
                    />
                  ) : (
                    <feature.icon className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Enhanced brand reinforcement section */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
            <span>Powered by</span>
            <GradientLogo 
              size="sm"
              className="opacity-60"
            />
            <span className="font-medium bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">TherapySync AI</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Built with enterprise-grade security, cultural awareness, and continuous learning capabilities 
            to provide the most advanced AI therapy platform available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
