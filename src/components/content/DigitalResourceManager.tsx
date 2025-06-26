
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  File, 
  Download, 
  Share2, 
  Star,
  Archive,
  Search,
  Upload,
  Grid,
  List,
  SortAsc,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DigitalResource {
  id: string;
  name: string;
  type: 'pdf' | 'audio' | 'video' | 'image' | 'document';
  size: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  uploadedAt: string;
  description: string;
  thumbnail?: string;
}

interface ResourceFolder {
  id: string;
  name: string;
  resourceCount: number;
  color: string;
}

const DigitalResourceManager = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<DigitalResource[]>([]);
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Mock data
    const mockFolders: ResourceFolder[] = [
      { id: '1', name: 'Therapy Worksheets', resourceCount: 15, color: 'bg-blue-100' },
      { id: '2', name: 'Guided Meditations', resourceCount: 8, color: 'bg-green-100' },
      { id: '3', name: 'Educational Videos', resourceCount: 12, color: 'bg-purple-100' },
      { id: '4', name: 'Assessment Tools', resourceCount: 6, color: 'bg-yellow-100' }
    ];

    const mockResources: DigitalResource[] = [
      {
        id: '1',
        name: 'Anxiety Assessment Worksheet.pdf',
        type: 'pdf',
        size: '2.3 MB',
        category: 'Assessment',
        tags: ['anxiety', 'assessment', 'worksheet'],
        downloads: 234,
        rating: 4.7,
        uploadedAt: '2024-01-15',
        description: 'Comprehensive anxiety assessment tool for therapeutic use'
      },
      {
        id: '2',
        name: 'Breathing Exercise Guide.mp3',
        type: 'audio',
        size: '15.2 MB',
        category: 'Relaxation',
        tags: ['breathing', 'relaxation', 'meditation'],
        downloads: 189,
        rating: 4.9,
        uploadedAt: '2024-01-20',
        description: '10-minute guided breathing exercise for stress relief'
      },
      {
        id: '3',
        name: 'CBT Techniques Overview.mp4',
        type: 'video',
        size: '89.5 MB',
        category: 'Education',
        tags: ['cbt', 'therapy', 'techniques'],
        downloads: 156,
        rating: 4.8,
        uploadedAt: '2024-01-25',
        description: 'Introduction to cognitive behavioral therapy techniques'
      }
    ];

    setFolders(mockFolders);
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  const handleDownload = (resource: DigitalResource) => {
    toast({
      title: "Download Started",
      description: `Downloading ${resource.name}`,
    });
  };

  const handleShare = (resource: DigitalResource) => {
    toast({
      title: "Share Link Copied",
      description: `Share link for ${resource.name} copied to clipboard`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload Interface",
      description: "Opening file upload dialog...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Resource Manager</h2>
          <p className="text-muted-foreground">Organize and manage your therapy resources</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="downloads">Sort by Downloads</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folders */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resource Folders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <Card key={folder.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${folder.color} flex items-center justify-center`}>
                    <FolderOpen className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{folder.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {folder.resourceCount} resources
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resources</h3>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getFileIcon(resource.type)}</span>
                      <div>
                        <CardTitle className="text-base leading-tight">{resource.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{resource.size}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {resource.downloads}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {resource.rating}
                        </span>
                      </div>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(resource)}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl">{getFileIcon(resource.type)}</span>
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.size} • {resource.downloads} downloads • ⭐ {resource.rating}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{resource.category}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(resource)}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default DigitalResourceManager;
