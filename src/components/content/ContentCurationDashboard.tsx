
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
import { useContentLibrary } from '@/hooks/useContentLibrary';

// Using ContentItem from useContentLibrary hook

const ContentCurationDashboard = () => {
  const { toast } = useToast();
  const { content, loading, createContent, updateContent, deleteContent, publishContent, unpublishContent } = useContentLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = ['all', ...Array.from(new Set(content.map(item => item.category)))];
  const types = ['all', 'article', 'video', 'audio', 'worksheet', 'exercise'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Eye className="h-4 w-4" />;
      case 'audio': return <Users className="h-4 w-4" />;
      case 'exercise': return <Star className="h-4 w-4" />;
      case 'worksheet': return <Upload className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
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

  const handleDeleteContent = async (id: string) => {
    await deleteContent(id);
  };

  const handleTogglePublish = async (id: string, isCurrentlyPublished: boolean) => {
    if (isCurrentlyPublished) {
      await unpublishContent(id);
    } else {
      await publishContent(id);
    }
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
      {loading ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Loading Content...</h3>
          <p className="text-muted-foreground">Fetching your content library</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.content_type)}
                    <span className="text-sm font-medium capitalize">{item.content_type}</span>
                  </div>
                  <Badge className={getStatusColor(item.is_published)}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description || 'No description available'}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.difficulty_level && (
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.difficulty_level}
                        </Badge>
                      )}
                    </span>
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {item.duration_minutes && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration_minutes}m
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags && item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags && item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(item.id, item.is_published)}
                      className="flex-1"
                    >
                      {item.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
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
      )}

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
