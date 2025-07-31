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
    <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-therapy-900/95 via-therapy-800/90 to-calm-900/95">
      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-therapy-100 to-calm-100 bg-clip-text text-transparent">
            Platform Benefits
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-therapy-100/90 max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive features that make our AI therapy platform the most advanced mental health solution.
          </p>
        </div>

        {/* Mobile: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-4 sm:p-6 lg:p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                  feature.useGradientLogo 
                    ? 'bg-gradient-to-r from-balance-500 to-harmony-500' 
                    : 'bg-gradient-to-r from-therapy-500 to-calm-500'
                }`}>
                  {feature.useGradientLogo ? (
                    <GradientLogo className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  ) : (
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  )}
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-therapy-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Advanced AI Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm sm:text-base">Deep Learning Models</h4>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">Advanced neural networks trained on therapeutic conversations with cultural awareness</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-balance-500 to-harmony-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm sm:text-base">Crisis Detection</h4>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">Real-time monitoring and immediate intervention capabilities with 24/7 support</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Global Impact</h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">150K+</div>
                <div className="text-white/70 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">29</div>
                <div className="text-white/70 text-sm">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">85+</div>
                <div className="text-white/70 text-sm">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;