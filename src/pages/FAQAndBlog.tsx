import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Star, 
  Clock, 
  User,
  Calendar,
  Tag,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';

const FAQAndBlog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'ai-therapy', name: 'AI Therapy', count: 6 },
    { id: 'pricing', name: 'Pricing & Billing', count: 5 },
    { id: 'technical', name: 'Technical Support', count: 5 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I start my first AI therapy session?',
      answer: 'Simply sign up for a free account, complete our quick onboarding assessment, and you can immediately start chatting with our AI therapists. Your first session is completely free and requires no commitment.',
      popular: true
    },
    {
      id: 2,
      category: 'ai-therapy',
      question: 'Is AI therapy as effective as traditional therapy?',
      answer: 'Research shows AI therapy can be highly effective for many mental health concerns. Our AI is trained on evidence-based therapeutic techniques and provides 24/7 support. While it may not replace all forms of traditional therapy, it offers accessible, immediate help that complements professional care.',
      popular: true
    },
    {
      id: 3,
      category: 'pricing',
      question: 'What does the free plan include?',
      answer: 'The free plan includes 3 AI therapy sessions per month, basic mood tracking, text-based conversations, community access, crisis resources, and basic progress reports. Perfect for getting started with AI therapy.',
      popular: true
    },
    {
      id: 4,
      category: 'ai-therapy',
      question: 'How does the AI understand my emotions?',
      answer: 'Our AI uses advanced natural language processing and emotion detection algorithms to analyze your messages, tone, and patterns. It can identify emotional states, stress levels, and mood changes to provide personalized therapeutic responses.',
      popular: false
    },
    {
      id: 5,
      category: 'technical',
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We use end-to-end encryption, comply with HIPAA regulations, and never share your personal information. Your therapy conversations are completely confidential and stored securely.',
      popular: true
    },
    {
      id: 6,
      category: 'getting-started',
      question: 'Can I use TherapySync AI on my phone?',
      answer: 'Yes! TherapySync AI works perfectly on all devices - phones, tablets, and computers. We also have dedicated mobile apps for iOS and Android for the best experience.',
      popular: false
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Mental Health: How AI is Revolutionizing Therapy',
      excerpt: 'Discover how artificial intelligence is making mental healthcare more accessible, affordable, and effective for millions of people worldwide.',
      author: 'Dr. Sarah Chen',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'AI Innovation',
      featured: true,
      image: '/blog/ai-therapy-future.jpg'
    },
    {
      id: 2,
      title: '5 Evidence-Based Techniques Your AI Therapist Uses',
      excerpt: 'Learn about the proven therapeutic methods integrated into our AI, from CBT to mindfulness-based interventions.',
      author: 'Dr. Michael Thompson',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'Therapy Techniques',
      featured: false,
      image: '/blog/therapy-techniques.jpg'
    },
    {
      id: 3,
      title: 'Breaking the Stigma: Making Mental Health Support Accessible',
      excerpt: 'How AI therapy is removing barriers and making mental health support available to everyone, regardless of location or financial situation.',
      author: 'Dr. Elena Rodriguez',
      date: '2024-01-10',
      readTime: '7 min read',
      category: 'Mental Health',
      featured: true,
      image: '/blog/mental-health-accessibility.jpg'
    },
    {
      id: 4,
      title: 'Crisis Prevention: How AI Detects Early Warning Signs',
      excerpt: 'Understanding how our advanced AI monitoring system identifies potential mental health crises before they escalate.',
      author: 'Dr. Sarah Chen',
      date: '2024-01-08',
      readTime: '5 min read',
      category: 'Crisis Prevention',
      featured: false,
      image: '/blog/crisis-detection.jpg'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFaqs = faqs.filter(faq => faq.popular);
  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
                <HelpCircle className="h-4 w-4 mr-2" />
                Knowledge Center
                <Book className="h-4 w-4 ml-2" />
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="therapy-text-gradient-animated">
                  FAQ & Mental Health Blog
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Find answers to common questions and explore expert insights on AI therapy, 
                mental health, and wellness strategies.
              </p>
              
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search FAQs and articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-therapy-200 focus:border-therapy-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
                <TabsTrigger value="faq" className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  Blog
                </TabsTrigger>
              </TabsList>

              {/* FAQ Section */}
              <TabsContent value="faq" className="space-y-8">
                {/* Popular FAQs */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 therapy-text-gradient">Popular Questions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {popularFaqs.map((faq) => (
                      <Card key={faq.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {faqCategories.find(cat => cat.id === faq.category)?.name}
                            </Badge>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                          <h3 className="font-semibold mb-2 text-slate-800">{faq.question}</h3>
                          <p className="text-slate-600 text-sm line-clamp-3">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* FAQ Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1">
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-1">
                          {faqCategories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-none hover:bg-accent transition-colors ${
                                selectedCategory === category.id ? 'bg-accent border-r-2 border-therapy-600' : ''
                              }`}
                            >
                              <span className={`text-sm ${selectedCategory === category.id ? 'font-medium' : ''}`}>
                                {category.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {category.count}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-3">
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {selectedCategory === 'all' ? 'All Questions' : 
                           faqCategories.find(cat => cat.id === selectedCategory)?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {filteredFaqs.map((faq) => (
                            <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                              <AccordionTrigger className="text-left">
                                <div className="flex items-center">
                                  {faq.popular && <Star className="h-4 w-4 text-yellow-500 mr-2" />}
                                  {faq.question}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Blog Section */}
              <TabsContent value="blog" className="space-y-8">
                {/* Featured Posts */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 therapy-text-gradient">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredPosts.map((post) => (
                      <Card key={post.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-therapy-500 to-calm-500"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className="therapy-gradient-bg text-white">
                              {post.category}
                            </Badge>
                            <span className="text-xs text-slate-500">{post.readTime}</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-slate-800">{post.title}</h3>
                          <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-slate-400 mr-2" />
                              <span className="text-sm text-slate-600">{post.author}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* All Blog Posts */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 therapy-text-gradient">Recent Articles</h2>
                  <div className="space-y-6">
                    {blogPosts.map((post) => (
                      <Card key={post.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">
                                  {post.category}
                                </Badge>
                                <span className="text-xs text-slate-500">{post.readTime}</span>
                              </div>
                              <h3 className="font-bold text-xl mb-2 text-slate-800">{post.title}</h3>
                              <p className="text-slate-600 mb-4">{post.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    {post.author}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(post.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Read More
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Still Have Questions?
              </h2>
              <p className="text-xl text-therapy-100 mb-8">
                Our support team and AI assistants are here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  className="bg-white text-therapy-700 px-8 py-4 text-lg rounded-xl hover:bg-therapy-50"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white px-8 py-4 text-lg rounded-xl hover:bg-white/10"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQAndBlog;