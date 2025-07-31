import React from 'react';
import { Brain, Heart, Shield, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdvancedTherapyBenefits = () => {
  const navigate = useNavigate();

  const therapeuticAdvantages = [
    {
      icon: Brain,
      title: 'Therapeutic Accuracy',
      description: 'Our AI understands emotional nuance, context, and complexity with 96% accuracy, providing responses that truly resonate with your mental state.',
      features: [
        'Emotional context awareness',
        'Subtle mood detection',
        'Therapeutic timing optimization',
        'Personalized response calibration'
      ],
      color: 'therapy'
    },
    {
      icon: Heart,
      title: 'Human-like Empathy',
      description: 'Advanced emotional intelligence creates genuine therapeutic connections through warm, understanding, and emotionally attuned interactions.',
      features: [
        'Empathetic response patterns',
        'Emotional validation techniques',
        'Compassionate communication',
        'Authentic therapeutic presence'
      ],
      color: 'calm'
    },
    {
      icon: Shield,
      title: 'Clinical Effectiveness',
      description: 'Evidence-based therapeutic techniques combined with AI precision deliver 40% better outcomes than traditional approaches.',
      features: [
        'Evidence-based interventions',
        'Proven therapeutic frameworks',
        'Measurable progress tracking',
        'Clinical outcome optimization'
      ],
      color: 'harmony'
    },
    {
      icon: Target,
      title: 'Personalized Healing',
      description: 'Every therapy session adapts to your unique healing journey, learning and evolving to provide the most effective therapeutic approach.',
      features: [
        'Adaptive therapy techniques',
        'Personalized intervention timing',
        'Individual progress optimization',
        'Custom healing pathways'
      ],
      color: 'flow'
    },
    {
      icon: Users,
      title: 'Safe Therapeutic Relationship',
      description: 'Built on trust, psychological safety, and professional boundaries to create the ideal environment for healing and growth.',
      features: [
        'Psychological safety protocols',
        'Trust-building mechanisms',
        'Professional boundaries',
        'Secure therapeutic space'
      ],
      color: 'mindful'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Therapeutic Growth',
      description: 'The AI evolves with your healing journey, continuously improving its understanding and therapeutic effectiveness over time.',
      features: [
        'Learning from progress patterns',
        'Therapeutic approach refinement',
        'Long-term relationship building',
        'Evolving treatment strategies'
      ],
      color: 'balance'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-therapy-50/20 to-calm-50/10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Why Our AI Delivers </span>
            <span className="bg-gradient-to-r from-therapy-600 via-calm-500 to-harmony-500 bg-clip-text text-transparent">
              The Most Human-Like Therapy
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Beyond advanced technology lies a revolutionary approach to therapeutic AI that creates genuine healing relationships, 
            understands human complexity, and delivers personalized care that feels authentically human.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {therapeuticAdvantages.map((advantage, index) => (
            <Card 
              key={advantage.title}
              className={`group relative bg-white border border-${advantage.color}-200 hover:border-${advantage.color}-300 transition-all duration-500 hover:shadow-xl hover:shadow-${advantage.color}-500/20 hover:scale-[1.02]`}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`p-4 rounded-xl bg-${advantage.color}-500 text-white shadow-lg group-hover:shadow-${advantage.color}-500/30 transition-all duration-300`}>
                    <advantage.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      {advantage.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {advantage.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full bg-${advantage.color}-500`}></div>
                          <span className="text-sm text-foreground font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Therapeutic Effectiveness Metrics */}
        <div className="bg-white rounded-3xl border border-therapy-200 p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Proven Therapeutic Excellence
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI's therapeutic capabilities are validated through continuous research and real-world outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-therapy-600 mb-2">96%</div>
              <div className="text-sm font-medium text-therapy-700 mb-1">Emotional Accuracy</div>
              <div className="text-xs text-muted-foreground">Understanding emotional nuance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-calm-600 mb-2">40%</div>
              <div className="text-sm font-medium text-calm-700 mb-1">Better Outcomes</div>
              <div className="text-xs text-muted-foreground">vs traditional approaches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-harmony-600 mb-2">4.9/5</div>
              <div className="text-sm font-medium text-harmony-700 mb-1">Therapeutic Quality</div>
              <div className="text-xs text-muted-foreground">User satisfaction rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-flow-600 mb-2">24/7</div>
              <div className="text-sm font-medium text-flow-700 mb-1">Available Support</div>
              <div className="text-xs text-muted-foreground">Continuous therapeutic care</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            onClick={() => navigate('/get-started')}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-10 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Heart className="mr-3 h-6 w-6" />
            Experience Human-Like AI Therapy
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdvancedTherapyBenefits;