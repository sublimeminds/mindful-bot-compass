
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Search, MessageSquare, CreditCard, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  helpful: number;
  views: number;
}

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ searchQuery }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);

  const faqData: FAQItem[] = [
    {
      id: '1',
      category: 'Therapy',
      question: 'How does AI therapy work and is it effective?',
      answer: 'Our AI therapy uses advanced natural language processing and evidence-based therapeutic techniques like CBT and DBT. Studies show AI therapy can be highly effective for anxiety, depression, and stress management. The AI adapts to your communication style and provides personalized responses. It\'s available 24/7 and supports 29 languages. While it doesn\'t replace human therapy, it provides accessible mental health support and can complement traditional therapy.',
      tags: ['ai', 'therapy', 'effectiveness', 'cbt', 'dbt'],
      helpful: 95,
      views: 1250
    },
    {
      id: '2',
      category: 'Billing',
      question: 'What are the differences between Free, Pro, and Premium plans?',
      answer: 'Free Plan: 3 AI therapy sessions/month, basic mood tracking, text-only conversations, community access. Pro Plan ($9/month or $79/year): Unlimited sessions, voice conversations in 29 languages, advanced mood analytics, personalized AI therapist selection, priority crisis support. Premium Plan ($19/month or $149/year): Everything in Pro plus advanced emotion detection, personalized treatment plans, 24/7 priority support, family account sharing (up to 4), exclusive content, and monthly expert consultations.',
      tags: ['pricing', 'plans', 'billing', 'features'],
      helpful: 87,
      views: 980
    },
    {
      id: '3',
      category: 'Technical',
      question: 'Why can\'t I start a therapy session?',
      answer: 'Common solutions: 1) Check your internet connection, 2) Clear browser cache and cookies, 3) Try a different browser (Chrome, Firefox, Safari), 4) Disable browser extensions temporarily, 5) Check if you\'ve reached your plan limits (Free users get 3 sessions/month), 6) Update your browser to the latest version. If the issue persists, our technical support team can help diagnose device-specific issues.',
      tags: ['technical', 'session', 'troubleshooting', 'browser'],
      helpful: 76,
      views: 650
    },
    {
      id: '4',
      category: 'Privacy',
      question: 'How secure and private are my therapy conversations?',
      answer: 'Your privacy is our top priority. All conversations are encrypted end-to-end, stored securely with AES-256 encryption, and never shared with third parties without your explicit consent. We\'re HIPAA compliant and follow strict data protection protocols. You can delete your conversation history anytime. Our AI models are trained on anonymized data and don\'t retain personal information between sessions.',
      tags: ['privacy', 'security', 'hipaa', 'encryption'],
      helpful: 92,
      views: 1100
    },
    {
      id: '5',
      category: 'Crisis',
      question: 'What happens if I\'m having a mental health crisis?',
      answer: 'Our AI has built-in crisis detection that immediately connects you to crisis resources when severe risk is detected. You\'ll get instant access to: National Suicide Prevention Lifeline (988), Crisis Text Line (text HOME to 741741), local emergency services (911), and SAMHSA National Helpline. Premium users get 24/7 priority crisis support with trained counselors. Always call 911 or go to your nearest emergency room for immediate danger.',
      tags: ['crisis', 'emergency', 'suicide', 'safety', 'hotline'],
      helpful: 98,
      views: 450
    },
    {
      id: '6',
      category: 'Features',
      question: 'Can I use voice therapy sessions on mobile?',
      answer: 'Yes! Voice therapy is available on all devices through our web app. We support 29 languages with real-time emotion detection (Premium feature). Pro and Premium users can access unlimited voice sessions. The AI adapts its tone and pacing based on your emotional state. Voice sessions are particularly effective for anxiety management and emotional processing. No app download required - works directly in your mobile browser.',
      tags: ['voice', 'mobile', 'languages', 'emotion-detection'],
      helpful: 81,
      views: 720
    },
    {
      id: '7',
      category: 'Account',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel anytime: 1) Go to Settings > Billing, 2) Click "Manage Subscription", 3) Select "Cancel Subscription", 4) Choose your reason (helps us improve), 5) Confirm cancellation. You\'ll keep access until your current billing period ends. We offer a 30-day money-back guarantee. If you\'re having issues with the service, please contact support first - we\'re here to help!',
      tags: ['cancel', 'subscription', 'billing', 'refund'],
      helpful: 73,
      views: 390
    },
    {
      id: '8',
      category: 'Therapy',
      question: 'How do I choose the right AI therapist personality?',
      answer: 'During onboarding, you\'ll take a compatibility assessment that matches you with the best AI therapist based on your communication style, therapy goals, and preferences. You can switch therapists anytime in Settings. Available personalities include: Dr. Sarah (CBT specialist, direct approach), Dr. Marcus (mindfulness expert, gentle style), Dr. Elena (trauma-informed, compassionate), and Dr. Alex (youth-focused, casual tone). Each has different specialties and communication styles.',
      tags: ['therapist', 'personality', 'matching', 'compatibility'],
      helpful: 85,
      views: 560
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare, count: faqData.length },
    { id: 'Therapy', name: 'AI Therapy', icon: MessageSquare, count: faqData.filter(f => f.category === 'Therapy').length },
    { id: 'Billing', name: 'Billing & Plans', icon: CreditCard, count: faqData.filter(f => f.category === 'Billing').length },
    { id: 'Technical', name: 'Technical Support', icon: Settings, count: faqData.filter(f => f.category === 'Technical').length },
    { id: 'Crisis', name: 'Crisis Support', icon: AlertTriangle, count: faqData.filter(f => f.category === 'Crisis').length }
  ];

  useEffect(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleHelpful = (id: string, helpful: boolean) => {
    // In a real app, this would make an API call
    console.log(`FAQ ${id} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "therapy-gradient-bg text-white border-0" : ""}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {category.name} ({category.count})
            </Button>
          );
        })}
      </div>

      {/* FAQ Results */}
      {filteredFAQs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search terms or browse by category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Collapsible
                open={expandedItems.includes(faq.id)}
                onOpenChange={() => toggleExpanded(faq.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-therapy-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {faq.views} views • {faq.helpful}% helpful
                          </span>
                        </div>
                        <CardTitle className="text-left text-lg font-semibold text-slate-800">
                          {faq.question}
                        </CardTitle>
                      </div>
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="prose prose-sm max-w-none text-slate-700 mb-4">
                      {faq.answer}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Helpful buttons */}
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(faq.id, true)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(faq.id, false)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        No
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQSection;
