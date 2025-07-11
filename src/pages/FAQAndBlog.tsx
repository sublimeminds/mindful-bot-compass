import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  ChevronRight,
  Star,
  Clock,
  Tag,
  Users,
  Brain,
  Heart,
  Shield,
  Settings,
  Mic
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const FAQAndBlog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Star },
    { id: 'ai-features', name: 'AI Features', icon: Brain },
    { id: 'therapy', name: 'Therapy Sessions', icon: Heart },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'settings', name: 'Settings & Account', icon: Settings },
    { id: 'technical', name: 'Technical Support', icon: HelpCircle }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I start my first therapy session?',
      answer: 'Navigate to your Dashboard and click "Begin Session". Our AI will guide you through a brief setup to understand your current state and therapy goals. The session will adapt in real-time to your needs.'
    },
    {
      category: 'ai-features',
      question: 'What makes TherapySync AI different from other therapy apps?',
      answer: 'TherapySync uses a unique combination of OpenAI GPT-4 and Anthropic Claude models, providing more nuanced and empathetic responses. We also offer voice therapy with emotion detection, real-time crisis intervention, and cultural intelligence across 29 languages.'
    },
    {
      category: 'therapy',
      question: 'Can I choose different therapy approaches?',
      answer: 'Yes! TherapySync supports multiple evidence-based approaches including CBT, DBT, mindfulness-based therapy, psychodynamic therapy, and humanistic therapy. You can set your preference in Settings or let our AI recommend the best approach for your specific needs.'
    },
    {
      category: 'privacy',
      question: 'How is my therapy data protected?',
      answer: 'All data is HIPAA-compliant with end-to-end encryption. Your sessions are stored securely and only accessible to you. We never share personal therapy content with third parties. You can export or delete your data at any time.'
    },
    {
      category: 'ai-features',
      question: 'How does voice therapy work?',
      answer: 'Our voice AI uses advanced emotion detection to analyze your speech patterns, tone, and emotional state. It provides real-time feedback and adapts the conversation accordingly. You can choose from multiple voice personalities and languages.'
    },
    {
      category: 'therapy',
      question: 'What happens if the AI detects a crisis situation?',
      answer: 'Our AI continuously monitors for crisis indicators. If detected, it immediately provides crisis resources, can contact your emergency contacts, and connects you with professional oversight. The system is designed to prioritize your safety above all else.'
    },
    {
      category: 'settings',
      question: 'Can I customize my AI therapist personality?',
      answer: 'Absolutely! You can choose from various AI therapist personalities, each with different communication styles, specialties, and approaches. You can also adjust cultural sensitivity settings and preferred therapeutic techniques.'
    },
    {
      category: 'getting-started',
      question: 'Is there a free version available?',
      answer: 'Yes! TherapySync offers a free tier with basic AI therapy sessions, mood tracking, and crisis support. Premium plans include unlimited sessions, voice therapy, family features, and advanced analytics.'
    }
  ];

  const blogPosts = [
    {
      title: 'Understanding the Science Behind AI Therapy',
      excerpt: 'Explore how artificial intelligence is revolutionizing mental health care and the research backing AI-powered therapeutic interventions.',
      category: 'AI Research',
      readTime: '8 min read',
      publishedAt: '2024-12-15',
      author: 'Dr. Sarah Chen',
      tags: ['AI', 'Research', 'Mental Health']
    },
    {
      title: 'Building Resilience: A CBT Approach',
      excerpt: 'Learn practical cognitive behavioral therapy techniques you can use daily to build emotional resilience and manage stress effectively.',
      category: 'Therapy Techniques',
      readTime: '6 min read',
      publishedAt: '2024-12-12',
      author: 'Dr. Michael Rodriguez',
      tags: ['CBT', 'Resilience', 'Self-Help']
    },
    {
      title: 'The Future of Voice-Based Mental Health Support',
      excerpt: 'How voice AI technology is creating more natural and accessible mental health interventions for people worldwide.',
      category: 'Technology',
      readTime: '10 min read',
      publishedAt: '2024-12-10',
      author: 'Dr. Emily Watson',
      tags: ['Voice AI', 'Innovation', 'Accessibility']
    },
    {
      title: 'Cultural Sensitivity in AI Therapy',
      excerpt: 'Understanding how AI can be trained to provide culturally appropriate and sensitive mental health support across diverse communities.',
      category: 'Cultural Awareness',
      readTime: '7 min read',
      publishedAt: '2024-12-08',
      author: 'Dr. Raj Patel',
      tags: ['Culture', 'Diversity', 'AI Training']
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-therapy-25 to-calm-25 min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold therapy-text-gradient mb-4">
              Help Center & Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions and explore insights about AI-powered mental health care
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-6 w-6 text-therapy-600" />
                    <span>Frequently Asked Questions</span>
                  </CardTitle>
                  <CardDescription>
                    Quick answers to the most common questions about TherapySync
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {faqCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No FAQs found matching your search.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-therapy-600" />
                    <span>Quick Links</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Getting Started Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Therapy Setup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Latest Blog Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-therapy-600" />
                    <span>Latest Articles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime}
                        </span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Articles
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Need More Help */}
              <Card className="bg-gradient-to-br from-therapy-50 to-harmony-50 border-therapy-200">
                <CardContent className="text-center p-6">
                  <MessageSquare className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-therapy-800 mb-2">Need More Help?</h3>
                  <p className="text-sm text-therapy-600 mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <Button className="w-full bg-therapy-600 hover:bg-therapy-700">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Blog Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold therapy-text-gradient">Mental Health Insights</h2>
              <Button variant="outline">
                View All Posts
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="group-hover:text-therapy-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">By {post.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-therapy-50">
                      Read Article
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQAndBlog;