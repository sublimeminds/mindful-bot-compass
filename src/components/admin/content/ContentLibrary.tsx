
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { useContentLibrary } from '@/hooks/useContentLibrary';

// Using ContentItem from useContentLibrary hook

const ContentLibrary = () => {
  const { content, loading, deleteContent, publishContent, unpublishContent } = useContentLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || item.content_type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🧘';
      case 'article': return '📖';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'worksheet': return '📊';
      default: return '📄';
    }
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content Library</h2>
          <p className="text-gray-400">Manage therapy content, guides, and resources</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="exercise">Exercises</option>
                <option value="worksheet">Worksheets</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-white mb-2">Loading Content...</h3>
          <p className="text-gray-400">Fetching content library</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(item.content_type)}</span>
                    <div>
                      <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-gray-400">{item.category}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(item.is_published) as any} className="text-xs">
                    {item.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{item.description || 'No description available'}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.difficulty_level && `${item.difficulty_level} level`}</span>
                    <span>{item.duration_minutes ? `${item.duration_minutes}m` : 'No duration'}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                    {item.therapeutic_approach && (
                      <span className="capitalize">{item.therapeutic_approach}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => deleteContent(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{content.length}</div>
            <p className="text-sm text-gray-400">Total Content Items</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">
              {content.filter(item => item.is_published).length}
            </div>
            <p className="text-sm text-gray-400">Published</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">
              {content.filter(item => !item.is_published).length}
            </div>
            <p className="text-sm text-gray-400">Drafts</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">
              {Array.from(new Set(content.map(item => item.category))).length}
            </div>
            <p className="text-sm text-gray-400">Categories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentLibrary;
