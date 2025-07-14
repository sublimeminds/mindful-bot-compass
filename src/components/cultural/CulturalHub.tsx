import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Users, 
  BookOpen, 
  Heart, 
  Star, 
  Clock, 
  Languages,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { 
  CulturalContentLibraryService, 
  CulturalSupportGroupService,
  FamilyIntegrationService,
  CulturalPeerMatchingService,
  type CulturalContent,
  type CulturalSupportGroup,
  type FamilyIntegrationProfile,
  type CulturalPeerMatch
} from '@/services/culturalEnhancedServices';
import { culturalAIService } from '@/services/culturalAiService';

const CulturalHub = () => {
  const { user } = useSimpleApp();
  const [loading, setLoading] = useState(true);
  const [culturalContent, setCulturalContent] = useState<CulturalContent[]>([]);
  const [supportGroups, setSupportGroups] = useState<CulturalSupportGroup[]>([]);
  const [familyProfile, setFamilyProfile] = useState<FamilyIntegrationProfile | null>(null);
  const [peerMatches, setPeerMatches] = useState<CulturalPeerMatch[]>([]);
  const [culturalContext, setCulturalContext] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadCulturalData();
    }
  }, [user]);

  const loadCulturalData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load all cultural data in parallel
      const [content, groups, family, peers, context] = await Promise.all([
        CulturalContentLibraryService.getRecommendedContent(user.id),
        CulturalSupportGroupService.getCulturalSupportGroups(user.id),
        FamilyIntegrationService.getFamilyProfile(user.id),
        CulturalPeerMatchingService.findCulturalPeers(user.id),
        culturalAIService.getEnhancedCulturalContext(user.id)
      ]);

      setCulturalContent(content);
      setSupportGroups(groups);
      setFamilyProfile(family);
      setPeerMatches(peers);
      setCulturalContext(context);
    } catch (error) {
      console.error('Error loading cultural data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    const success = await CulturalSupportGroupService.joinSupportGroup(groupId, user.id);
    if (success) {
      await loadCulturalData(); // Refresh data
    }
  };

  const handleContentUsage = async (contentId: string, effectiveness: number) => {
    if (!user) return;
    
    await CulturalContentLibraryService.trackContentUsage(contentId, user.id, effectiveness);
    await loadCulturalData(); // Refresh to update usage stats
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Globe className="h-8 w-8 text-primary" />
          <span>Cultural Therapy Hub</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover culturally-adapted therapy resources, connect with your community, and embrace healing approaches that honor your cultural background.
        </p>
        
        {culturalContext && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Languages className="h-5 w-5 text-primary" />
              <span className="font-medium">Your Cultural Profile</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Background:</span>
                <p className="font-medium capitalize">{culturalContext.culturalBackground?.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Language:</span>
                <p className="font-medium">{culturalContext.primaryLanguage || 'English'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Family Structure:</span>
                <p className="font-medium capitalize">{culturalContext.familyStructure}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Adaptation Level:</span>
                <Badge variant="secondary" className="capitalize">
                  {culturalContext.adaptationLevel}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Cultural Content</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Community</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Family</span>
          </TabsTrigger>
          <TabsTrigger value="peers" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Peer Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalContent.map(content => (
              <CulturalContentCard 
                key={content.id} 
                content={content} 
                onUse={handleContentUsage}
              />
            ))}
          </div>
          
          {culturalContent.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Cultural Content Available</h3>
                <p className="text-muted-foreground">
                  We're working on adding more culturally-adapted content for your background.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportGroups.map(group => (
              <SupportGroupCard 
                key={group.id} 
                group={group} 
                onJoin={handleJoinGroup}
              />
            ))}
          </div>
          
          {supportGroups.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Support Groups Available</h3>
                <p className="text-muted-foreground">
                  Support groups for your cultural background will be available soon.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <FamilyIntegrationPanel 
            familyProfile={familyProfile}
            culturalContext={culturalContext}
            userId={user?.id}
            onUpdate={loadCulturalData}
          />
        </TabsContent>

        <TabsContent value="peers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {peerMatches.map(match => (
              <PeerMatchCard key={match.id} match={match} />
            ))}
          </div>
          
          {peerMatches.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Peer Matches Found</h3>
                <p className="text-muted-foreground">
                  We'll notify you when we find culturally compatible therapy peers.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CulturalContentCard = ({ 
  content, 
  onUse 
}: { 
  content: CulturalContent; 
  onUse: (contentId: string, effectiveness: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const handleUseContent = () => {
    if (userRating > 0) {
      onUse(content.id, userRating);
      setUserRating(0);
      setIsExpanded(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Target className="h-5 w-5" />;
      case 'exercise': return <Award className="h-5 w-5" />;
      case 'story': return <BookOpen className="h-5 w-5" />;
      case 'technique': return <Lightbulb className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getContentIcon(content.contentType)}
            <CardTitle className="text-lg">{content.title}</CardTitle>
          </div>
          <Badge variant="outline" className="capitalize">
            {content.contentType}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{content.effectivenessScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{content.content.duration || 15} min</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {content.difficultyLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {content.content.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {content.culturalBackgrounds.map(bg => (
            <Badge key={bg} variant="outline" className="text-xs capitalize">
              {bg.replace('_', ' ')}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </Button>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {content.content.instructions && (
              <div>
                <h4 className="font-medium mb-2">Instructions:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {content.content.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Rate Effectiveness:</h4>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Button
                    key={star}
                    variant={userRating >= star ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserRating(star)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
                <Button 
                  onClick={handleUseContent}
                  disabled={userRating === 0}
                  className="ml-4"
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SupportGroupCard = ({ 
  group, 
  onJoin 
}: { 
  group: CulturalSupportGroup; 
  onJoin: (groupId: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>{group.name}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{group.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Members:</span>
            <span>{group.currentMembers}/{group.maxMembers}</span>
          </div>
          
          <Progress 
            value={(group.currentMembers / group.maxMembers) * 100} 
            className="h-2"
          />
          
          <div className="flex flex-wrap gap-2">
            {group.culturalBackgrounds.map(bg => (
              <Badge key={bg} variant="secondary" className="text-xs capitalize">
                {bg.replace('_', ' ')}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {group.languages.map(lang => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
          
          <Button 
            onClick={() => onJoin(group.id)}
            className="w-full"
            disabled={group.currentMembers >= group.maxMembers}
          >
            {group.currentMembers >= group.maxMembers ? 'Group Full' : 'Join Group'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FamilyIntegrationPanel = ({ 
  familyProfile, 
  culturalContext, 
  userId,
  onUpdate 
}: {
  familyProfile: FamilyIntegrationProfile | null;
  culturalContext: any;
  userId?: string;
  onUpdate: () => void;
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadFamilyRecommendations();
    }
  }, [userId, familyProfile]);

  const loadFamilyRecommendations = async () => {
    if (!userId) return;
    
    const recs = await FamilyIntegrationService.getFamilyTherapyRecommendations(userId);
    setRecommendations(recs);
  };

  if (!familyProfile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Family Integration Profile</h3>
          <p className="text-muted-foreground mb-4">
            Set up your family integration preferences to receive culturally-appropriate family therapy recommendations.
          </p>
          <Button>Create Family Profile</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Family Integration Profile</span>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Involvement Level:</span>
              <p className="font-medium capitalize">{familyProfile.familyInvolvementLevel}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Decision Making:</span>
              <p className="font-medium capitalize">{familyProfile.culturalDecisionMaking}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Family Members:</span>
              <p className="font-medium">{familyProfile.familyMembers.length}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Family Therapy:</span>
              <p className="font-medium">{familyProfile.familyTherapyConsent ? 'Consented' : 'Not Consented'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Family Therapy Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  <p className="text-xs text-primary mt-2">{rec.culturalRationale}</p>
                  <Badge className="mt-2" variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const PeerMatchCard = ({ match }: { match: CulturalPeerMatch }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>Peer Match</span>
          <Badge variant="secondary">{(match.matchScore * 100).toFixed(0)}% match</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(match.matchCriteria).map(([key, matches]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${matches ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {match.matchType.replace('_', ' ')}
            </Badge>
            <Badge variant={match.status === 'active' ? 'default' : 'secondary'}>
              {match.status}
            </Badge>
          </div>
          
          <Button className="w-full" disabled={match.status !== 'pending'}>
            {match.status === 'pending' ? 'Connect' : match.status === 'active' ? 'Connected' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CulturalHub;