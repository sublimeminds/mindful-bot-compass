import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, Users, Heart, Share2, Clock, TrendingUp,
  ChevronRight, MessageCircle, ThumbsUp, BookOpen, Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  likes: number;
  comments: number;
  user_name: string;
  user_avatar: string | null;
}

const CommunityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration
        const mockPosts: Post[] = [
          {
            id: '1',
            created_at: new Date().toISOString(),
            user_id: user?.id || 'mock_user',
            content: 'Just finished a great therapy session! Feeling much better.',
            likes: 15,
            comments: 5,
            user_name: user?.email?.split('@')[0] || 'User',
            user_avatar: null
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: 'another_user',
            content: 'Anyone else find journaling really helpful?',
            likes: 22,
            comments: 8,
            user_name: 'AnotherUser',
            user_avatar: null
          }
        ];
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error loading community posts",
          description: "Failed to load community data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, toast]);

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      // Mock post submission
      const newPostObj: Post = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        user_id: user?.id || 'mock_user',
        content: newPost,
        likes: 0,
        comments: 0,
        user_name: user?.email?.split('@')[0] || 'User',
        user_avatar: null
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Error submitting post",
        description: "Failed to submit your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return <div>Please log in to access the community.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-6 w-6 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">Connect with others on their mental health journey</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="feed" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="space-y-4">
          {/* Post Submission */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <Button onClick={handlePostSubmit}>Post</Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Feed */}
          {loading ? (
            <div className="text-center">Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="flex items-center space-x-4">
                    <Avatar>
                      {post.user_avatar ? (
                        <AvatarImage src={post.user_avatar} alt={post.user_name} />
                      ) : (
                        <AvatarFallback>{post.user_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle>{post.user_name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{getFormattedDate(post.created_at)}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {post.likes} Likes
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments} Comments
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <a href="#" className="underline">Mental Health Articles</a>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <a href="#" className="underline">Local Support Groups</a>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-yellow-500" />
                    <a href="#" className="underline">Online Forums</a>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;
