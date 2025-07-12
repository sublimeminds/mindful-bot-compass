import React from 'react';
import FamilyAccessGate from '@/components/family/FamilyAccessGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Calendar,
  Users,
  Share,
  Bell,
  Shield,
  Video,
  Plus
} from 'lucide-react';

const FamilyFeaturesPage = () => {
  return (
    <FamilyAccessGate>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
            Family Therapy Features
          </h1>
          <p className="text-muted-foreground mt-2">
            Therapy tools designed for families - shared goals, communication, and support
          </p>
        </div>

        {/* Family Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Shared Goals */}
          <Card className="border-therapy-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-therapy-700">
                  <Target className="h-5 w-5 mr-2" />
                  Shared Goals
                </CardTitle>
                <Badge className="bg-therapy-100 text-therapy-700">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and track family therapy goals together. Monitor progress and celebrate achievements as a unit.
              </p>
              <Button className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Family Goal
              </Button>
            </CardContent>
          </Card>

          {/* Family Communication */}
          <Card className="border-harmony-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-harmony-700">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Family Chat
                </CardTitle>
                <Badge className="bg-harmony-100 text-harmony-700">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Secure family communication channel with guided conversation prompts and emotion check-ins.
              </p>
              <Button className="w-full bg-gradient-to-r from-harmony-500 to-harmony-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Family Chat
              </Button>
            </CardContent>
          </Card>

          {/* Progress Sharing */}
          <Card className="border-flow-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-flow-700">
                  <Share className="h-5 w-5 mr-2" />
                  Progress Sharing
                </CardTitle>
                <Badge className="bg-flow-100 text-flow-700">Pro</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share therapy progress, mood updates, and insights with family members you trust.
              </p>
              <Button className="w-full bg-gradient-to-r from-flow-500 to-flow-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </CardContent>
          </Card>

          {/* Family Therapy Sessions */}
          <Card className="border-calm-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-calm-700">
                  <Video className="h-5 w-5 mr-2" />
                  Group Sessions
                </CardTitle>
                <Badge className="bg-calm-100 text-calm-700">Premium</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule and conduct guided family therapy sessions with AI moderation and professional oversight.
              </p>
              <Button className="w-full bg-gradient-to-r from-calm-500 to-calm-600">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </CardContent>
          </Card>

          {/* Crisis Alerts */}
          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-orange-700">
                  <Shield className="h-5 w-5 mr-2" />
                  Crisis Support
                </CardTitle>
                <Badge className="bg-orange-100 text-orange-700">24/7</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Automated crisis detection and family alert system. Get notified when a family member needs support.
              </p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                <Bell className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Family Wellness */}
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-green-700">
                  <Heart className="h-5 w-5 mr-2" />
                  Family Wellness
                </CardTitle>
                <Badge className="bg-green-100 text-green-700">Coming Soon</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track family wellness metrics, mood patterns, and collective mental health insights.
              </p>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600" disabled>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Wellness
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-therapy-600" />
              Quick Family Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <MessageCircle className="h-6 w-6" />
                <span>Family Check-in</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Schedule Together</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Heart className="h-6 w-6" />
                <span>Mood Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </FamilyAccessGate>
  );
};

export default FamilyFeaturesPage;