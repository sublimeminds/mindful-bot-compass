
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Star,
  Eye,
  Edit,
  Trash2,
  Upload,
  Tag,
  Clock,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'worksheet' | 'guide';
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  views: number;
  rating: number;
  description: string;
  thumbnail?: string;
}

const ContentCurationDashboard = () => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Mock content data
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Understanding Anxiety: A Complete Guide',
        type: 'article',
        category: 'Mental Health',
        tags: ['anxiety', 'coping', 'mental-health'],
        status: 'published',
        author: 'Dr. Sarah Chen',
        createdAt: '2024-01-15',
        views: 1250,
        rating: 4.8,
        description: 'Comprehensive guide to understanding and managing anxiety disorders.'
      },
      {
        id: '2',
        title: 'Guided Meditation for Sleep',
        type: 'audio',
        category: 'Relaxation',
        tags: ['meditation', 'sleep', 'relaxation'],
        status: 'published',
        author: 'Michael Rodriguez',
        createdAt: '2024-01-20',
        views: 890,
        rating: 4.9,
        description: '20-minute guided meditation to help you fall asleep peacefully.'
      },
      {
        id: '3',
        title: 'Cognitive Behavioral Therapy Techniques',
        type: 'video',
        category: 'Therapy',
        tags: ['cbt', 'therapy', 'techniques'],
        status: 'draft',
        author: 'Dr. Emily Johnson',
        createdAt: '2024-01-25',
        views: 0,
        rating: 0,
        description: 'Introduction to CBT techniques for therapists and clients.'
      }
    ];
    setContentItems(mockContent);
  }, []);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = ['all', ...Array.from(new Set(contentItems.map(item => item.category)))];
  const types = ['all', 'article', 'video', 'audio', 'worksheet', 'guide'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Eye className="h-4 w-4" />;
      case 'audio': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateContent = () => {
    setIsCreating(true);
    toast({
      title: "Content Creator",
      description: "Opening content creation interface...",
    });
  };

  const handleEditContent = (id: string) => {
    toast({
      title: "Edit Content",
      description: `Editing content item ${id}`,
    });
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Content Deleted",
      description: "Content item has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Curation Dashboard</h2>
          <p className="text-muted-foreground">Manage and organize your digital content library</p>
        </div>
        <Button onClick={handleCreateContent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-medium capitalize">{item.type}</span>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">By {item.author}</span>
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.createdAt}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {item.views}
                    </span>
                    {item.rating > 0 && (
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditContent(item.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteContent(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ContentCurationDashboard;
