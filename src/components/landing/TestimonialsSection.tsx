
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradientLogo from '@/components/ui/GradientLogo';

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    content: "TherapySync has been a game-changer for my anxiety. The AI therapist understands me better than I expected and provides techniques that actually work.",
    rating: 5,
    improvement: "Reduced anxiety by 70%"
  },
  {
    name: "David L.",
    role: "Software Engineer", 
    content: "I was skeptical about AI therapy, but the personalized approach and 24/7 availability have helped me work through depression in ways traditional therapy couldn't.",
    rating: 5,
    improvement: "Better sleep quality"
  },
  {
    name: "Maria R.",
    role: "Healthcare Worker",
    content: "As someone who works in healthcare, I needed something accessible during my irregular schedule. TherapySync provides the support I need, when I need it.",
    rating: 5,
    improvement: "Improved stress management"
  },
  {
    name: "James K.",
    role: "Student",
    content: "The goal tracking and progress insights have helped me stay motivated in my mental health journey. I can see real improvements over time.",
    rating: 5,
    improvement: "Higher confidence levels"
  },
  {
    name: "Emma T.",
    role: "Entrepreneur",
    content: "The voice interaction feature is incredible. I can have therapy sessions while walking or during commute. It fits perfectly into my busy lifestyle.",
    rating: 5,
    improvement: "Better work-life balance"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800">
            Transforming Lives Every Day
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands who have found hope, healing, and growth through TherapySync's personalized therapy experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100 border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium text-slate-800 mb-8 leading-relaxed">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-harmony-500 to-flow-500 text-white">
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800">{currentTestimonial.name}</div>
                    <div className="text-sm text-slate-600">{currentTestimonial.role}</div>
                  </div>
                </div>

                {/* Improvement badge */}
                <div className="inline-flex items-center px-4 py-2 bg-harmony-100 text-harmony-700 rounded-full text-sm font-medium">
                  ✨ {currentTestimonial.improvement}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="flex items-center space-x-2 border-harmony-200 hover:bg-harmony-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {/* Dots indicator */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-harmony-500 scale-125' 
                          : 'bg-slate-300 hover:bg-harmony-200'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="flex items-center space-x-2 border-harmony-200 hover:bg-harmony-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand reinforcement */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <span>Powered by</span>
            <GradientLogo 
              size="sm"
              className="opacity-60"
            />
            <span className="font-medium bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">TherapySync AI</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
