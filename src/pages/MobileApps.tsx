import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Bell,
  WifiOff,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const MobileApps = () => {
  const navigate = useNavigate();

  const appFeatures = [
    {
      icon: Zap,
      title: "Full Feature Parity",
      description: "Access all TherapySync features on mobile with the same powerful AI therapy capabilities",
      badge: "Complete"
    },
    {
      icon: WifiOff,
      title: "Offline Capabilities",
      description: "Continue your therapy journey even without internet with offline mood tracking and journaling",
      badge: "Essential"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Gentle reminders for sessions, mood check-ins, and mindfulness moments",
      badge: "Helpful"
    },
    {
      icon: RefreshCw,
      title: "Real-time Sync",
      description: "Seamlessly sync data across all your devices for a consistent experience",
      badge: "Reliable"
    },
    {
      icon: Shield,
      title: "Biometric Security",
      description: "Secure access with Face ID, Touch ID, and encrypted local storage",
      badge: "Secure"
    },
    {
      icon: Heart,
      title: "Health App Integration",
      description: "Connect with Apple Health and Google Fit for comprehensive wellness tracking",
      badge: "Connected"
    }
  ];

  const mobileStats = [
    { label: "App Store Rating", value: "4.9", unit: "/5" },
    { label: "Downloads", value: "50K+", unit: "" },
    { label: "Daily Active Users", value: "85%", unit: "" },
    { label: "Crash Rate", value: "<0.1%", unit: "" }
  ];

  return (
    <SafeComponentWrapper name="MobileApps">
      <Helmet>
        <title>Mobile Apps - TherapySync iOS & Android Apps</title>
        <meta name="description" content="Download TherapySync mobile apps for iOS and Android. Full-featured AI therapy, offline support, biometric security, and seamless sync across devices." />
        <meta name="keywords" content="mobile therapy app, iOS app, Android app, offline therapy, mobile mental health" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-therapy-100 text-therapy-700 text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4 mr-2" />
              Native Mobile Experience
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Therapy in Your Pocket
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take your mental health journey anywhere with our award-winning mobile apps. 
              Full AI therapy capabilities, offline support, and enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://apps.apple.com', '_blank')}
              >
                <Download className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://play.google.com', '_blank')}
              >
                <Download className="mr-2 h-5 w-5" />
                Download for Android
              </Button>
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                4.9/5 App Store Rating
              </div>
              <div className="text-sm text-gray-500">•</div>
              <div className="text-sm text-gray-600">50,000+ Downloads</div>
              <div className="text-sm text-gray-500">•</div>
              <div className="text-sm text-gray-600">Editor's Choice Award</div>
            </div>

            {/* Mobile Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {mobileStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold therapy-text-gradient">
                    {stat.value}
                    <span className="text-lg">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Mobile-First Experience</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Designed specifically for mobile users with features that make therapy accessible anywhere, anytime
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Comparison */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Universal Compatibility</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Native apps for iOS and Android with feature parity and platform-specific optimizations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* iOS App */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Smartphone className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl mb-2">iOS App</CardTitle>
                  <CardDescription className="text-gray-600">
                    Optimized for iPhone and iPad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Face ID & Touch ID authentication
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Apple Health integration
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Siri Shortcuts support
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    iOS 15+ compatibility
                  </div>
                  <Button 
                    className="w-full mt-6 therapy-gradient text-white"
                    onClick={() => window.open('https://apps.apple.com', '_blank')}
                  >
                    Download on App Store
                  </Button>
                </CardContent>
              </Card>

              {/* Android App */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Smartphone className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Android App</CardTitle>
                  <CardDescription className="text-gray-600">
                    Optimized for Android devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Fingerprint & facial recognition
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Google Fit integration
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Google Assistant integration
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Android 8+ compatibility
                  </div>
                  <Button 
                    className="w-full mt-6 therapy-gradient text-white"
                    onClick={() => window.open('https://play.google.com', '_blank')}
                  >
                    Get it on Google Play
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Start Your Mobile Journey</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Download our apps and carry your mental health support wherever life takes you
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-3 bg-white text-therapy-600 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/features-overview')}
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Explore All Features
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default MobileApps;