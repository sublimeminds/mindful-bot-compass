import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, MapPin, Clock, Shield, AlertTriangle, CheckCircle, Globe, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  trust_level: string;
  confidence_score: number;
  verification_count: number;
  location_history: Array<{
    country: string;
    timestamp: string;
    ip_address: string;
    confidence: number;
  }>;
  behavioral_flags: string[];
  subscription_history: Array<{
    plan: string;
    created_at: string;
    price: number;
    currency: string;
  }>;
}

const UserInvestigationPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search term',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would search across user profiles, emails, etc.
      // For now, we'll simulate with mock data
      const mockResults: UserProfile[] = [
        {
          id: 'user_123',
          email: 'user@example.com',
          created_at: '2024-01-15T10:30:00Z',
          trust_level: 'suspicious',
          confidence_score: 0.65,
          verification_count: 2,
          location_history: [
            { country: 'US', timestamp: '2024-01-15T10:30:00Z', ip_address: '192.168.1.1', confidence: 0.95 },
            { country: 'IN', timestamp: '2024-01-15T11:00:00Z', ip_address: '103.45.67.89', confidence: 0.78 },
            { country: 'AR', timestamp: '2024-01-15T11:15:00Z', ip_address: '190.123.45.67', confidence: 0.45 }
          ],
          behavioral_flags: ['rapid_country_change', 'vpn_usage', 'multiple_devices'],
          subscription_history: [
            { plan: 'Premium', created_at: '2024-01-15T10:35:00Z', price: 2.99, currency: 'USD' }
          ]
        }
      ];

      setSearchResults(mockResults);
      if (mockResults.length > 0) {
        setSelectedUser(mockResults[0]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrustLevel = async (userId: string, newTrustLevel: string) => {
    try {
      // In real implementation, update the trust level in the database
      toast({
        title: 'Success',
        description: `Trust level updated to ${newTrustLevel}`,
      });

      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          trust_level: newTrustLevel
        });
      }
    } catch (error) {
      console.error('Error updating trust level:', error);
      toast({
        title: 'Error',
        description: 'Failed to update trust level',
        variant: 'destructive'
      });
    }
  };

  const getTrustBadge = (trustLevel: string) => {
    const variants = {
      trusted: 'bg-green-600 text-white',
      building: 'bg-blue-600 text-white',
      new: 'bg-gray-600 text-white',
      suspicious: 'bg-red-600 text-white'
    };
    return variants[trustLevel as keyof typeof variants] || 'bg-gray-600 text-white';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            User Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email, user ID, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button onClick={searchUsers} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-900/30 border-blue-500'
                      : 'bg-gray-900 border-gray-600 hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">{user.email}</p>
                        <p className="text-gray-400 text-sm">ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTrustBadge(user.trust_level)}>
                        {user.trust_level.toUpperCase()}
                      </Badge>
                      <span className={`font-mono text-sm ${getConfidenceColor(user.confidence_score)}`}>
                        {(user.confidence_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Details */}
      {selectedUser && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Profile: {selectedUser.email}
              </span>
              <div className="flex items-center space-x-2">
                <Badge className={getTrustBadge(selectedUser.trust_level)}>
                  {selectedUser.trust_level.toUpperCase()}
                </Badge>
                <span className={`font-mono ${getConfidenceColor(selectedUser.confidence_score)}`}>
                  {(selectedUser.confidence_score * 100).toFixed(1)}% Confidence
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="location">Location History</TabsTrigger>
                <TabsTrigger value="behavior">Behavioral Analysis</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscription History</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-mono text-sm">{selectedUser.id}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Verifications</p>
                    <p className="text-white text-sm">{selectedUser.verification_count}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Trust Score</p>
                    <p className={`text-sm font-bold ${getConfidenceColor(selectedUser.confidence_score)}`}>
                      {(selectedUser.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {selectedUser.behavioral_flags.length > 0 && (
                  <Alert className="border-yellow-500 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      <strong>Behavioral Flags Detected:</strong>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedUser.behavioral_flags.map((flag, index) => (
                          <Badge key={index} variant="outline" className="border-yellow-500 text-yellow-200">
                            {flag.replace('_', ' ').toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="space-y-3">
                  {selectedUser.location_history.map((location, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">{location.country}</p>
                            <p className="text-gray-400 text-sm">IP: {location.ip_address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-sm ${getConfidenceColor(location.confidence)}`}>
                            {(location.confidence * 100).toFixed(1)}%
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(location.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Risk Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedUser.behavioral_flags.map((flag, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-300">{flag.replace('_', ' ')}</span>
                            <Badge variant="outline" className="border-red-500 text-red-400">
                              HIGH RISK
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Device Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Multiple Devices</span>
                          <span className="text-yellow-400">3 detected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">VPN Usage</span>
                          <Badge variant="outline" className="border-red-500 text-red-400">
                            DETECTED
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Location Jumps</span>
                          <span className="text-red-400">5 in 1 hour</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subscriptions" className="space-y-4">
                <div className="space-y-3">
                  {selectedUser.subscription_history.map((sub, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{sub.plan} Plan</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(sub.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {sub.currency} {sub.price}
                          </p>
                          <Badge className="bg-yellow-600 text-white">
                            DISCOUNTED
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Trust Level Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={() => updateTrustLevel(selectedUser.id, 'trusted')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Trusted
                      </Button>
                      <Button
                        onClick={() => updateTrustLevel(selectedUser.id, 'building')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Set to Building Trust
                      </Button>
                      <Button
                        onClick={() => updateTrustLevel(selectedUser.id, 'suspicious')}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Flag as Suspicious
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Manual Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Force Location Verification
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Request Device Verification
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Generate Manual Override
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserInvestigationPanel;