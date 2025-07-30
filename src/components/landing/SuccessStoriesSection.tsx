import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const SuccessStoriesSection = () => {
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
    { label: "Success Rate", value: "94%", description: "Users report significant improvement" },
    { label: "Average Sessions", value: "8-12", description: "To see meaningful progress" },
    { label: "User Satisfaction", value: "4.9/5", description: "Based on 10,000+ reviews" },
    { label: "Retention Rate", value: "89%", description: "Users continue their journey" }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-healing-100 text-healing-800 border-healing-200">
            Real Results
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            Success Stories & Outcomes
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover how TherapySync has transformed lives through personalized AI therapy
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-white/90 mb-1">{stat.label}</div>
                <div className="text-xs text-white/70">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-white/40" />
                </div>
                
                <blockquote className="text-white/90 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{testimonial.name}</span>
                    <Badge className="bg-healing-100/20 text-healing-200 border-healing-200/30">
                      {testimonial.improvement}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-white/70">
                    <div className="mb-1">Condition: {testimonial.condition}</div>
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