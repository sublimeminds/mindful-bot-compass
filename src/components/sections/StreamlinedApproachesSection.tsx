import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, Heart, Target, Users } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import ApproachesShowcaseIcon from '@/components/icons/custom/ApproachesShowcaseIcon';
import therapyShowcaseImage from '@/assets/therapy-approaches-showcase.png';

const StreamlinedApproachesSection = () => {
  const [visibleIcons, setVisibleIcons] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleIcons(prev => (prev + 1) % 8);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const approachCategories = [
    { 
      icon: Brain, 
      name: 'Cognitive Therapies', 
      count: 15, 
      gradient: 'from-therapy-500 to-harmony-500',
      approaches: ['CBT', 'DBT', 'REBT', 'ACT', 'Mindfulness']
    },
    { 
      icon: Heart, 
      name: 'Emotional Healing', 
      count: 12, 
      gradient: 'from-calm-500 to-therapy-500',
      approaches: ['Trauma-Focused', 'EMDR', 'Somatic', 'EFT']
    },
    { 
      icon: Target, 
      name: 'Behavioral Change', 
      count: 18, 
      gradient: 'from-harmony-500 to-balance-500',
      approaches: ['Exposure Therapy', 'Habit Formation', 'Goal Setting']
    },
    { 
      icon: Users, 
      name: 'Relationship Focus', 
      count: 16, 
      gradient: 'from-balance-500 to-flow-500',
      approaches: ['Couples Therapy', 'Family Systems', 'Group Dynamics']
    }
  ];

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    duration: 2 + i * 0.3,
    x: 20 + (i % 4) * 25,
    y: 20 + Math.floor(i / 4) * 25
  }));

  return (
    <SafeComponentWrapper name="StreamlinedApproachesSection">
      <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-therapy-50 via-white to-harmony-50">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-2 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              60+ Evidence-Based Approaches
            </Badge>
            
            <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Every Mind,
              <span className="block bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
                Every Method
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Our AI therapists master the complete spectrum of therapeutic approaches, 
              ensuring personalized care that matches your unique needs and cultural background.
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            
            {/* Left: Interactive Visual */}
            <div className="relative">
              <div className="relative w-full h-96 bg-gradient-to-br from-therapy-100 to-harmony-100 rounded-3xl overflow-hidden border border-therapy-200 shadow-2xl">
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <img 
                    src={therapyShowcaseImage} 
                    alt="Therapy approaches visualization" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Central icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ApproachesShowcaseIcon size={120} className="opacity-90" />
                </div>
                
                {/* Floating approach indicators */}
                {floatingElements.map((elem, index) => (
                  <motion.div
                    key={elem.id}
                    className={`absolute w-12 h-12 rounded-full bg-gradient-to-r ${approachCategories[index % 4].gradient} 
                      shadow-lg flex items-center justify-center ${index < visibleIcons ? 'opacity-100' : 'opacity-30'}`}
                    style={{ left: `${elem.x}%`, top: `${elem.y}%` }}
                    animate={{
                      scale: index < visibleIcons ? [1, 1.1, 1] : 1,
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: elem.duration,
                      repeat: Infinity,
                      delay: elem.delay
                    }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full opacity-90" />
                  </motion.div>
                ))}
                
                {/* Count display */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-xl">
                  <div className="text-3xl font-bold text-therapy-600">60+</div>
                  <div className="text-sm text-muted-foreground">Approaches</div>
                </div>
              </div>
            </div>

            {/* Right: Category Breakdown */}
            <div className="space-y-6">
              {approachCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  className="group bg-white rounded-2xl p-6 border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
                        <p className="text-muted-foreground">{category.count} specialized methods</p>
                      </div>
                    </div>
                    <Badge className="bg-therapy-50 text-therapy-700 border-therapy-200">
                      {category.count}+ Methods
                    </Badge>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.approaches.map((approach, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-harmony-50 text-harmony-700 border-harmony-200">
                        {approach}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-therapy-600 to-harmony-600 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Perfect Therapeutic Match?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Let our AI analyze your needs and recommend the most effective therapeutic approaches for your unique situation.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-therapy-700 hover:bg-therapy-50 px-10 py-6 text-lg rounded-full shadow-xl group"
              >
                Discover Your Approaches
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default StreamlinedApproachesSection;