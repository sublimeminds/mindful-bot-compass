
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, BarChart3, Settings, Target } from 'lucide-react';
import { SEOService } from '@/services/seoService';

const AdminSEODashboard = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    keywords: '',
    image: ''
  });

  const pages = [
    { id: 'home', name: 'Home Page', url: '/' },
    { id: 'plans', name: 'Pricing Plans', url: '/plans' },
    { id: 'dashboard', name: 'Dashboard', url: '/dashboard' },
    { id: 'onboarding', name: 'Onboarding', url: '/onboarding' },
    { id: 'chat', name: 'AI Therapy Chat', url: '/chat' },
    { id: 'community', name: 'Community', url: '/community' }
  ];

  const handleSaveMetaData = () => {
    SEOService.updateMetaTags(metaData);
    // Here you would typically save to your backend
    console.log('Meta data saved for page:', selectedPage, metaData);
  };

  const loadPageData = (pageId: string) => {
    const config = SEOService.getPageSEOConfig(pageId);
    setMetaData({
      title: config.title || '',
      description: config.description || '',
      keywords: config.keywords || '',
      image: config.image || ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Management</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your search engine visibility and manage meta tags
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          SEO Active
        </Badge>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Page Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pages.map((page) => (
                  <Button
                    key={page.id}
                    variant={selectedPage === page.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedPage(page.id);
                      loadPageData(page.id);
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Meta Data Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  Meta Data - {pages.find(p => p.id === selectedPage)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={metaData.title}
                    onChange={(e) => setMetaData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter page title (50-60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {metaData.title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Meta Description</Label>
                  <Textarea
                    id="description"
                    value={metaData.description}
                    onChange={(e) => setMetaData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter meta description (150-160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {metaData.description.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={metaData.keywords}
                    onChange={(e) => setMetaData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Open Graph Image URL</Label>
                  <Input
                    id="image"
                    value={metaData.image}
                    onChange={(e) => setMetaData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL for social sharing"
                  />
                </div>

                <Button onClick={handleSaveMetaData} className="w-full">
                  Save Meta Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* SEO Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                  {metaData.title || 'Page Title'}
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  {window.location.origin}{pages.find(p => p.id === selectedPage)?.url}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {metaData.description || 'Meta description will appear here...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Search Traffic</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,456</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-muted-foreground">+0.3 from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keyword Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { keyword: 'AI therapy', position: 3, clicks: 1250, impressions: 8900 },
                  { keyword: 'mental health app', position: 7, clicks: 890, impressions: 5600 },
                  { keyword: 'online therapy', position: 12, clicks: 450, impressions: 3200 },
                  { keyword: 'mood tracking', position: 5, clicks: 720, impressions: 4100 }
                ].map((item) => (
                  <div key={item.keyword} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.keyword}</p>
                      <p className="text-sm text-muted-foreground">
                        Position: {item.position} • Clicks: {item.clicks} • Impressions: {item.impressions}
                      </p>
                    </div>
                    <Badge variant={item.position <= 5 ? "default" : "secondary"}>
                      #{item.position}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Site Title</Label>
                <Input defaultValue="TherapySync - AI-Powered Mental Wellness" />
              </div>
              
              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea defaultValue="Transform your mental wellness journey with AI-powered therapy, mood tracking, and personalized insights." />
              </div>

              <div className="space-y-2">
                <Label>Default Keywords</Label>
                <Input defaultValue="AI therapy, mental health, wellness, mood tracking, online therapy" />
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEODashboard;
