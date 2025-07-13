import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Target, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const Individuals = () => {
  const navigate = useNavigate();

  return (
    <SafeComponentWrapper name="Individuals">
      <Helmet>
        <title>AI Therapy for Individuals - Personal Mental Health Support</title>
        <meta name="description" content="Personal AI therapy tailored for individuals. 24/7 support, mood tracking, crisis intervention, and personalized treatment plans." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Personal AI Therapy
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your personal mental health journey with AI-powered therapy, 24/7 support, and personalized treatment plans.
            </p>
            <Button 
              size="lg" 
              className="px-8 py-3 therapy-gradient text-white"
              onClick={() => navigate('/auth')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default Individuals;