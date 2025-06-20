
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, ArrowLeft, BookOpen, Filter } from 'lucide-react';

const HelpArticles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'AI Therapy', 'Techniques', 'Security', 'Billing', 'Community'];

  const articles = [
    {
      id: '1',
      title: 'Understanding Your Mental Health Journey',
      excerpt: 'A comprehensive guide to starting your mental wellness journey with TherapySync.',
      content: 'Learn the fundamentals of mental health care and how to begin your therapeutic journey.',
      readTime: '5 min read',
      category: 'Getting Started',
      publishDate: '2024-06-15'
    },
    {
      id: '2',
      title: 'Maximizing Your AI Therapy Sessions',
      excerpt: 'Tips and strategies for getting the most out of your therapeutic conversations with our AI.',
      content: 'Discover effective communication techniques and session preparation strategies.',
      readTime: '7 min read',
      category: 'AI Therapy',
      publishDate: '2024-06-14'
    },
    {
      id: '3',
      title: 'Building Healthy Coping Strategies',
      excerpt: 'Learn evidence-based techniques for managing stress, anxiety, and difficult emotions.',
      content: 'Explore various coping mechanisms and stress management techniques.',
      readTime: '10 min read',
      category: 'Techniques',
      publishDate: '2024-06-13'
    },
    {
      id: '4',
      title: 'Privacy and Security in Digital Therapy',
      excerpt: 'Understanding how your data is protected and what privacy measures we have in place.',
      content: 'Learn about our security protocols and data protection measures.',
      readTime: '4 min read',
      category: 'Security',
      publishDate: '2024-06-12'
    },
    {
      id: '5',
      title: 'Setting Up Your TherapySync Account',
      excerpt: 'Step-by-step guide to creating and configuring your account for optimal use.',
      content: 'Complete walkthrough of account setup and initial configuration.',
      readTime: '6 min read',
      category: 'Getting Started',
      publishDate: '2024-06-11'
    },
    {
      id: '6',
      title: 'Understanding Subscription Plans',
      excerpt: 'Compare different subscription options and find the plan that works best for you.',
      content: 'Detailed breakdown of features and pricing for each subscription tier.',
      readTime: '5 min read',
      category: 'Billing',
      publishDate: '2024-06-10'
    },
    {
      id: '7',
      title: 'Joining the TherapySync Community',
      excerpt: 'Learn how to connect with others and participate in support groups.',
      content: 'Guide to community features, support groups, and peer connections.',
      readTime: '8 min read',
      category: 'Community',
      publishDate: '2024-06-09'
    },
    {
      id: '8',
      title: 'Advanced AI Conversation Techniques',
      excerpt: 'Master advanced techniques for deeper, more meaningful therapeutic conversations.',
      content: 'Advanced strategies for engaging with AI therapy and deeper exploration.',
      readTime: '12 min read',
      category: 'AI Therapy',
      publishDate: '2024-06-08'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/help')}
            className="mb-4 text-therapy-600 hover:text-therapy-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
          <h1 className="text-4xl font-bold text-therapy-900 mb-4">Help Articles</h1>
          <p className="text-xl text-therapy-600 max-w-2xl">
            Browse our comprehensive collection of guides, tutorials, and helpful resources.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-400 h-5 w-5" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-therapy-600 hover:bg-therapy-700" : 
                  "text-therapy-600 border-therapy-200 hover:bg-therapy-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/help/articles/${article.id}`)}>
              <CardHeader className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-therapy-100 text-therapy-700 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-therapy-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="text-therapy-800 hover:text-therapy-600 transition-colors text-lg">
                  {article.title}
                </CardTitle>
                <p className="text-therapy-600 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-therapy-500">
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Read Article
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-therapy-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-therapy-700 mb-2">No articles found</h3>
            <p className="text-therapy-600">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HelpArticles;
