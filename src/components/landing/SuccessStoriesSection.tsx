import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, TrendingUp, Users, Heart, Brain } from 'lucide-react';

const SuccessStoriesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const testimonials = [
    {
      name: "Sarah M.",
      condition: "Anxiety & Panic Attacks",
      improvement: "85% reduction in panic attacks",
      quote: "TherapySync helped me identify my triggers and develop coping strategies. I haven't had a panic attack in 3 months.",
      rating: 5,
      sessions: 12,
      timeframe: "3 months"
    },
    {
      name: "David R.",
      condition: "Depression & Isolation",
      improvement: "Improved mood & social connection",
      quote: "The AI therapist understood me in ways I didn't expect. It felt like talking to someone who truly gets it.",
      rating: 5,
      sessions: 18,
      timeframe: "4 months"
    },
    {
      name: "Maria L.",
      condition: "Relationship Issues",
      improvement: "Stronger communication skills",
      quote: "The couple's therapy approach transformed how my partner and I communicate. We're closer than ever.",
      rating: 5,
      sessions: 15,
      timeframe: "6 months"
    }
  ];

  const stats = [
    { 
      icon: TrendingUp,
      label: "Success Rate", 
      value: "94%", 
      description: "Users report significant improvement",
      gradient: "from-therapy-500 to-therapy-600"
    },
    { 
      icon: Brain,
      label: "Average Sessions", 
      value: "8-12", 
      description: "To see meaningful progress",
      gradient: "from-harmony-500 to-harmony-600"
    },
    { 
      icon: Heart,
      label: "User Satisfaction", 
      value: "4.9/5", 
      description: "Based on 10,000+ reviews",
      gradient: "from-calm-500 to-calm-600"
    },
    { 
      icon: Users,
      label: "Retention Rate", 
      value: "89%", 
      description: "Users continue their journey",
      gradient: "from-balance-500 to-balance-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-therapy-50/30 to-harmony-50/30">
      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <Badge className="bg-white/90 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-6 py-3 text-base font-medium shadow-lg">
            <Heart className="w-4 h-4 mr-2" />
            Real Results
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
            Success Stories & Outcomes
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how TherapySync has transformed lives through personalized AI therapy
          </p>
        </div>

        {/* Statistics Grid - Mobile: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg text-center hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 transition-colors duration-300 ${
                  hoveredCard === index ? 'text-therapy-600' : 'text-foreground'
                }`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 group-hover:text-foreground transition-colors duration-300">{stat.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials - Mobile: Single column, Desktop: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white/90 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-therapy-400 group-hover:text-therapy-500 transition-colors duration-300" />
                </div>
                
                <blockquote className="text-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base group-hover:text-therapy-700 transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-semibold text-foreground text-sm sm:text-base group-hover:text-therapy-800 transition-colors duration-300">{testimonial.name}</span>
                    <Badge className="bg-gradient-to-r from-therapy-100 to-therapy-200 text-therapy-700 border-therapy-300 text-xs self-start group-hover:from-therapy-200 group-hover:to-therapy-300 transition-all duration-300">
                      {testimonial.improvement}
                    </Badge>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1 group-hover:text-foreground transition-colors duration-300">
                    <div>Condition: {testimonial.condition}</div>
                    <div className="flex justify-between">
                      <span>{testimonial.sessions} sessions</span>
                      <span>{testimonial.timeframe}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesSection;