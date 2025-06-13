
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Star, Eye, ArrowRight } from 'lucide-react';
import { SupportService, HelpArticle } from '@/services/supportService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import SupportLayout from '@/components/layout/SupportLayout';

const Help = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<HelpArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHelpArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  const loadHelpArticles = async () => {
    try {
      setLoading(true);
      const data = await SupportService.getHelpArticles();
      setArticles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load help articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  };

  const categories = [...new Set(articles.map(article => article.category))];
  const featuredArticles = articles.filter(article => article.isFeatured);

  if (loading) {
    return (
      <SupportLayout>
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">Loading help center...</div>
          </div>
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-8 w-8 text-therapy-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-700 to-therapy-900 bg-clip-text text-transparent">
                Help Center
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Comprehensive guides and documentation to help you get the most out of your therapy journey
            </p>
          </div>

          {/* Search */}
          <Card className="border-therapy-200 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-therapy-400" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-therapy-200 focus:border-therapy-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-therapy-900 mb-4">Featured Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-xl transition-shadow cursor-pointer border-therapy-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Star className="h-5 w-5 text-yellow-500 mt-1" />
                        <Badge variant="outline" className="text-xs border-therapy-200 text-therapy-600">
                          {article.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 text-therapy-900">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.viewCount}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories and Articles */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-therapy-900">Browse by Category</h2>
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
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredArticles.length === 0 ? (
                <div className="col-span-full">
                  <Card className="border-therapy-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No articles found matching your criteria.</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-xl transition-shadow cursor-pointer border-therapy-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-xs border-therapy-200 text-therapy-600">
                          {article.category}
                        </Badge>
                        {article.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 text-therapy-900">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-calm-100 text-calm-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.viewCount}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-therapy-800 mb-2">
                Need personalized help?
              </h3>
              <p className="text-therapy-600 mb-4">
                Our support team is ready to assist you with any questions or issues.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/faq')}
                  className="border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                >
                  View FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SupportLayout>
  );
};

export default Help;
