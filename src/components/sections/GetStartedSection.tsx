import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, CheckCircle, Users, TrendingUp, Shield, Heart } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import GetStartedIcon from '@/components/icons/custom/GetStartedIcon';
import getStartedHeroImage from '@/assets/get-started-hero.png';

const GetStartedSection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const journeySteps = [
    {
      step: 1,
      title: "Share Your Story",
      description: "Tell us about your mental health goals and preferences in a safe, private environment.",
      icon: Heart,
      duration: "2 minutes"
    },
    {
      step: 2,
      title: "AI Matches You",
      description: "Our AI analyzes your needs and matches you with the perfect therapeutic approaches.",
      icon: Sparkles,
      duration: "Instant"
    },
    {
      step: 3,
      title: "Begin Healing",
      description: "Start your personalized therapy sessions with AI guidance tailored just for you.",
      icon: TrendingUp,
      duration: "Immediately"
    }
  ];

  const trustElements = [
    { icon: Users, label: "50K+ Users", subtext: "Join our community" },
    { icon: Shield, label: "100% Private", subtext: "HIPAA Compliant" },
    { icon: TrendingUp, label: "89% Success Rate", subtext: "Proven results" },
    { icon: CheckCircle, label: "Free Trial", subtext: "No commitment" }
  ];

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const handleExploreAudio = () => {
    navigate('/audio-library');
  };

  return (
    <SafeComponentWrapper name="GetStartedSection">
      <div className="py-20 px-4 bg-gradient-to-br from-therapy-600 via-harmony-600 to-calm-600 relative overflow-hidden">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src={getStartedHeroImage} 
            alt="Get started background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <GetStartedIcon size={120} />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Your Mental Health
              <span className="block text-therapy-200">
                Journey Starts Here
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your mental wellness with AI-powered therapy that adapts to your unique needs, 
              cultural background, and personal goals. No waiting lists, no appointments - just healing.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {trustElements.map((element, index) => (
                <motion.div
                  key={element.label}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <element.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{element.label}</div>
                      <div className="text-white/70 text-sm">{element.subtext}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Journey Steps */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            
            {/* Steps */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-8">How It Works</h3>
              
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 ${
                    currentStep === index ? 'bg-white/20 border-white/40 scale-105' : 'hover:bg-white/15'
                  }`}
                  onClick={() => setCurrentStep(index)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      currentStep === index 
                        ? 'bg-white text-therapy-600' 
                        : 'bg-white/20 text-white'
                    }`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-white">{step.title}</h4>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-white/80 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual */}
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="aspect-square bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    
                    {/* Dynamic content based on current step */}
                    <motion.div
                      key={currentStep}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                        {React.createElement(journeySteps[currentStep].icon, {
                          className: "w-12 h-12 text-therapy-600"
                        })}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-4">
                        Step {journeySteps[currentStep].step}
                      </h4>
                      <p className="text-white/80 text-lg">
                        {journeySteps[currentStep].title}
                      </p>
                    </motion.div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2">
                        {journeySteps.map((_, index) => (
                          <div
                            key={index}
                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                              index <= currentStep ? 'bg-white' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Life?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands who've found healing, growth, and peace through our AI-powered therapy platform. 
                Your journey to better mental health starts with a single click.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-white text-therapy-700 hover:bg-therapy-50 px-12 py-6 text-xl rounded-full shadow-xl group min-w-[200px]"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-therapy-700 px-12 py-6 text-xl rounded-full backdrop-blur-sm min-w-[200px]"
                  onClick={handleExploreAudio}
                >
                  Explore Audio Library
                </Button>
              </div>
              
              {/* Security Notice */}
              <div className="flex items-center justify-center space-x-6 text-white/70 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default GetStartedSection;