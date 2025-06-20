
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();

  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn how to set up your account and begin your mental wellness journey.',
      items: ['Account creation', 'Profile setup', 'First session']
    },
    {
      title: 'Using AI Therapy',
      description: 'Understand how our AI-powered therapy sessions work.',
      items: ['Starting a session', 'Communication tips', 'Session features']
    },
    {
      title: 'Crisis Support',
      description: 'Important information about crisis management and emergency resources.',
      items: ['Crisis hotlines', 'Emergency contacts', 'Safety planning']
    },
    {
      title: 'Account & Billing',
      description: 'Manage your subscription and account settings.',
      items: ['Subscription plans', 'Billing questions', 'Account settings']
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-therapy-900 mb-4">Help Center</h1>
          <p className="text-xl text-therapy-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of TherapySync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {helpTopics.map((topic, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-therapy-800">{topic.title}</CardTitle>
                <p className="text-therapy-600">{topic.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-therapy-700 text-sm">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-therapy-800">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-therapy-600">
                Can't find what you're looking for? Get in touch with our support team.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              >
                Sign In for Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;
