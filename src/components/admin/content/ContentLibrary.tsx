
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

interface ContentItem {
  id: string;
  title: string;
  type: 'technique' | 'guide' | 'exercise' | 'assessment';
  category: string;
  description: string;
  status: 'published' | 'draft' | 'archived';
  lastModified: Date;
  author: string;
  usageCount: number;
}

const ContentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Deep Breathing Exercise',
      type: 'technique',
      category: 'Anxiety Management',
      description: 'Guided breathing technique for stress relief',
      status: 'published',
      lastModified: new Date(2024, 5, 10),
      author: 'Dr. Sarah Wilson',
      usageCount: 245
    },
    {
      id: '2',
      title: 'Cognitive Restructuring Guide',
      type: 'guide',
      category: 'CBT Techniques',
      description: 'Step-by-step guide for thought challenging',
      status: 'published',
      lastModified: new Date(2024, 5, 8),
      author: 'Dr. Michael Chen',
      usageCount: 189
    },
    {
      id: '3',
      title: 'Mindfulness Assessment',
      type: 'assessment',
      category: 'Mindfulness',
      description: 'Self-assessment for mindfulness practice',
      status: 'draft',
      lastModified: new Date(2024, 5, 5),
      author: 'Dr. Emily Rodriguez',
      usageCount: 0
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technique': return '🧘';
      case 'guide': return '📖';
      case 'exercise': return '💪';
      case 'assessment': return '📊';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'outline';
    }
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
                <option value="technique">Techniques</option>
                <option value="guide">Guides</option>
                <option value="exercise">Exercises</option>
                <option value="assessment">Assessments</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContent.map((item) => (
          <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(item.status) as any} className="text-xs">
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">{item.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>By {item.author}</span>
                  <span>{item.usageCount} uses</span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Modified: {item.lastModified.toLocaleDateString()}</span>
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
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-sm text-gray-400">Total Content Items</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">18</div>
            <p className="text-sm text-gray-400">Published</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">4</div>
            <p className="text-sm text-gray-400">Drafts</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">1,247</div>
            <p className="text-sm text-gray-400">Total Usage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentLibrary;
