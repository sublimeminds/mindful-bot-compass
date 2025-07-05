
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SimpleLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to Your Mental Health Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience personalized AI-powered therapy sessions designed to support your mental wellness and growth.
          </p>
          <div className="space-x-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                🤖 AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI technology provides personalized therapeutic support tailored to your unique needs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                🔒 Private & Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your conversations and data are completely private and protected with enterprise-grade security.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                📈 Track Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your mental health journey with detailed analytics and personalized insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleLandingPage;
