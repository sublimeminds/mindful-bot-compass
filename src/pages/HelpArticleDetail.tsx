import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar, BookOpen, ThumbsUp, Share2, Printer } from 'lucide-react';

const HelpArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock article data - in real app this would come from a service/API
  const articles = {
    '1': {
      title: 'Understanding Your Mental Health Journey',
      category: 'Getting Started',
      readTime: '5 min read',
      publishDate: '2024-06-15',
      content: `
        <h2>Getting Started with Mental Health Care</h2>
        <p>Starting your mental health journey can feel overwhelming, but with the right guidance and tools, you can take meaningful steps toward wellness. TherapySync is designed to support you every step of the way.</p>
        
        <h3>What to Expect</h3>
        <p>When you begin using TherapySync, you'll start with a comprehensive assessment that helps our AI understand your unique needs, preferences, and goals. This personalized approach ensures that every interaction is tailored to your specific situation.</p>
        
        <h3>Building Your Foundation</h3>
        <p>Mental health care is most effective when built on a strong foundation of:</p>
        <ul>
          <li>Regular self-reflection and awareness</li>
          <li>Consistent engagement with therapeutic tools</li>
          <li>Open communication about your experiences</li>
          <li>Patience with the process of growth and healing</li>
        </ul>
        
        <h3>Setting Realistic Goals</h3>
        <p>Recovery and wellness are not linear processes. It's important to set realistic, achievable goals that can be adjusted as you progress. Our AI will help you identify and track these goals throughout your journey.</p>
        
        <h3>When to Seek Additional Support</h3>
        <p>While TherapySync provides comprehensive AI-powered support, there may be times when additional human professional support is beneficial. Our platform can help you identify these moments and connect you with appropriate resources.</p>
      `,
      tags: ['mental health', 'getting started', 'wellness', 'goals']
    },
    '2': {
      title: 'Maximizing Your AI Therapy Sessions',
      category: 'AI Therapy',
      readTime: '7 min read',
      publishDate: '2024-06-14',
      content: `
        <h2>Getting the Most from AI Therapy</h2>
        <p>AI therapy represents a new frontier in mental health care, offering 24/7 availability and personalized support. Here's how to maximize your experience with TherapySync's AI therapy features.</p>
        
        <h3>Preparation is Key</h3>
        <p>Before starting a session, take a moment to:</p>
        <ul>
          <li>Reflect on your current emotional state</li>
          <li>Identify specific topics or concerns you'd like to discuss</li>
          <li>Find a quiet, private space where you can focus</li>
          <li>Set aside adequate time without distractions</li>
        </ul>
        
        <h3>Communication Strategies</h3>
        <p>Effective communication with AI involves being clear, honest, and specific about your experiences. The more context you provide, the better the AI can understand and respond to your needs.</p>
        
        <h3>Building Therapeutic Rapport</h3>
        <p>Even with AI, building a therapeutic relationship takes time. Be patient as the system learns your preferences, communication style, and therapeutic needs. Regular engagement helps improve the quality of interactions over time.</p>
        
        <h3>Using Session Insights</h3>
        <p>After each session, review the insights and recommendations provided. These summaries can help you track progress and identify patterns in your thoughts and emotions.</p>
      `,
      tags: ['AI therapy', 'communication', 'sessions', 'tips']
    }
    // Add more articles as needed
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-therapy-900 mb-4">Article Not Found</h1>
          <p className="text-therapy-600 mb-8">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/help/articles')}>
            Back to Articles
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/help/articles')}
              className="mb-4 text-therapy-600 hover:text-therapy-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
            
            <div className="mb-6">
              <span className="text-sm bg-therapy-100 text-therapy-700 px-3 py-1 rounded-full">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-therapy-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-therapy-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.publishDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {article.readTime}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-therapy-200">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Helpful
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-therapy max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  lineHeight: '1.7',
                }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-therapy-200">
            <h3 className="text-sm font-semibold text-therapy-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-therapy-50 text-therapy-600 px-2 py-1 rounded border border-therapy-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-therapy-900 mb-4">Related Articles</h3>
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => navigate('/help/articles/2')}
                >
                  <BookOpen className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Maximizing Your AI Therapy Sessions</div>
                    <div className="text-sm text-therapy-600">Tips and strategies for effective therapeutic conversations</div>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => navigate('/help/articles/3')}
                >
                  <BookOpen className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Building Healthy Coping Strategies</div>
                    <div className="text-sm text-therapy-600">Evidence-based techniques for managing difficult emotions</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpArticleDetail;
