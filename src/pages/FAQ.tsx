
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, ChevronDown, ChevronUp, HelpCircle, ThumbsUp } from 'lucide-react';
import { SupportService, FAQItem } from '@/services/supportService';
import { useToast } from '@/hooks/use-toast';
import SupportLayout from '@/components/layout/SupportLayout';

const FAQ = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchQuery, selectedCategory]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await SupportService.getFAQItems();
      setFaqs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load FAQ items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  if (loading) {
    return (
      <SupportLayout>
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading FAQ...</div>
          </div>
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center space-x-2">
              <HelpCircle className="h-8 w-8 text-therapy-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-700 to-therapy-900 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Find quick answers to common questions about our therapy platform
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="border-therapy-200 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-therapy-400" />
                <Input
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-therapy-200 focus:border-therapy-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700' 
                    : 'border-therapy-200 text-therapy-600 hover:bg-therapy-50'
                  }
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700' 
                      : 'border-therapy-200 text-therapy-600 hover:bg-therapy-50'
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4 pb-8">
            {filteredFaqs.length === 0 ? (
              <Card className="border-therapy-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No FAQ items found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden border-therapy-200 shadow-lg hover:shadow-xl transition-shadow">
                  <Collapsible
                    open={expandedItems.has(faq.id)}
                    onOpenChange={() => toggleExpanded(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-therapy-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-left">
                            <CardTitle className="text-lg text-therapy-900 mb-2">
                              {faq.question}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs border-therapy-200 text-therapy-600">
                                {faq.category}
                              </Badge>
                              {faq.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-calm-100 text-calm-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {faq.viewCount} views
                            </span>
                            {expandedItems.has(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-therapy-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-therapy-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-6">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-therapy-100">
                          <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4 text-therapy-400" />
                            <span className="text-sm text-gray-500">
                              {faq.helpfulCount} people found this helpful
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                            Was this helpful?
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-therapy-800 mb-2">
                Still need help?
              </h3>
              <p className="text-therapy-600 mb-4">
                If you can't find the answer you're looking for, our support team is here to help.
              </p>
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SupportLayout>
  );
};

export default FAQ;
