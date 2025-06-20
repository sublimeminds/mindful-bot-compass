
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, Star } from 'lucide-react';

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

  const featuredArticles = [
    {
      id: '1',
      title: 'Understanding Your Mental Health Journey',
      excerpt: 'A comprehensive guide to starting your mental wellness journey with TherapySync.',
      readTime: '5 min read',
      category: 'Getting Started'
    },
    {
      id: '2',
      title: 'Maximizing Your AI Therapy Sessions',
      excerpt: 'Tips and strategies for getting the most out of your therapeutic conversations with our AI.',
      readTime: '7 min read',
      category: 'AI Therapy'
    },
    {
      id: '3',
      title: 'Building Healthy Coping Strategies',
      excerpt: 'Learn evidence-based techniques for managing stress, anxiety, and difficult emotions.',
      readTime: '10 min read',
      category: 'Techniques'
    },
    {
      id: '4',
      title: 'Privacy and Security in Digital Therapy',
      excerpt: 'Understanding how your data is protected and what privacy measures we have in place.',
      readTime: '4 min read',
      category: 'Security'
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

        {/* Featured Articles Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-therapy-900">Featured Articles</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/help/articles')}
              className="flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/help/articles/${article.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-therapy-100 text-therapy-700 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <div className="flex items-center text-xs text-therapy-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-therapy-800 hover:text-therapy-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-therapy-600 text-sm">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Topics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-therapy-900 mb-8">Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
