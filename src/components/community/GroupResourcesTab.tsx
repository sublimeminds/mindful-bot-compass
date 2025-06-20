
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Link, Download, Share, Plus } from 'lucide-react';
import CreateResourceDialog from './CreateResourceDialog';

interface GroupResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'worksheet' | 'link' | 'audio';
  url?: string;
  file_size?: string;
  author_name: string;
  created_at: string;
  download_count: number;
  is_featured: boolean;
  tags: string[];
}

interface GroupResourcesTabProps {
  groupId: string;
  isJoined: boolean;
  canModerate?: boolean;
}

const GroupResourcesTab: React.FC<GroupResourcesTabProps> = ({ 
  groupId, 
  isJoined, 
  canModerate = false 
}) => {
  const [resources] = useState<GroupResource[]>([
    {
      id: '1',
      title: 'Anxiety Management Techniques',
      description: 'A comprehensive guide to managing anxiety with practical exercises and techniques.',
      type: 'article',
      author_name: 'Dr. Sarah Johnson',
      created_at: '2025-06-15',
      download_count: 45,
      is_featured: true,
      tags: ['anxiety', 'coping-strategies', 'self-help']
    },
    {
      id: '2',
      title: '10-Minute Guided Meditation',
      description: 'A calming meditation session perfect for daily practice.',
      type: 'audio',
      file_size: '15 MB',
      author_name: 'Michael Chen',
      created_at: '2025-06-12',
      download_count: 78,
      is_featured: false,
      tags: ['meditation', 'mindfulness', 'relaxation']
    },
    {
      id: '3',
      title: 'Mood Tracking Worksheet',
      description: 'A printable worksheet to help track your daily mood and identify patterns.',
      type: 'worksheet',
      file_size: '2 MB',
      author_name: 'Emma Wilson',
      created_at: '2025-06-10',
      download_count: 32,
      is_featured: true,
      tags: ['mood-tracking', 'worksheet', 'self-assessment']
    }
  ]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <Link className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'worksheet':
        return 'bg-green-100 text-green-800';
      case 'audio':
        return 'bg-orange-100 text-orange-800';
      case 'link':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (resourceId: string) => {
    console.log('Downloading resource:', resourceId);
    // TODO: Implement download functionality
  };

  const handleShare = (resourceId: string) => {
    console.log('Sharing resource:', resourceId);
    // TODO: Implement share functionality
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Group Resources</h3>
        {(isJoined || canModerate) && (
          <CreateResourceDialog groupId={groupId} onResourceCreated={() => {}} />
        )}
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-600">
              {isJoined 
                ? 'Be the first to share a helpful resource with the group!' 
                : 'Join the group to access and share resources.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resources.map(resource => (
            <Card key={resource.id} className={resource.is_featured ? 'ring-2 ring-therapy-200' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-gray-100 rounded">
                        {getResourceIcon(resource.type)}
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge className={getResourceTypeColor(resource.type)}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="mb-3">
                      {resource.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>By {resource.author_name}</span>
                      <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                      {resource.file_size && <span>{resource.file_size}</span>}
                      <span>{resource.download_count} downloads</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isJoined && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(resource.id)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(resource.id)}
                        className="bg-therapy-600 hover:bg-therapy-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupResourcesTab;
