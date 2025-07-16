import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  MessageSquare, 
  Heart, 
  Headphones, 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Target, 
  Calendar,
  Music,
  BookOpen,
  HelpCircle,
  FileText,
  Star,
  Globe,
  Zap,
  ChevronDown 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const HeaderDropdowns = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      {/* Therapy AI dropdown - Simple tablet style with same items as desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Brain className="h-4 w-4 mr-2" />
            Therapy AI
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              AI Technology
            </div>
            <DropdownMenuItem asChild>
              <Link to="/therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <MessageSquare className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">AI Therapy Sessions</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/voice-therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Headphones className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Voice Technology</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Crisis Support</span>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200 ml-auto">
                  24/7
                </Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Globe className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Cultural AI Features</span>
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem asChild>
                <Link to="/chat" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                  <Zap className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Quick Chat</span>
                </Link>
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Features dropdown - Simple tablet style with same items as desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Settings className="h-4 w-4 mr-2" />
            Features
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            {user ? (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Your Tools
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mood-tracking" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Heart className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Mood Tracker</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/analytics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Progress Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/goals" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Target className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Goals & Objectives</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calendar" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Calendar className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Calendar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/audio-library" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Music className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Audio Library</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/community" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Users className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Community</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/family-features" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Users className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Family Features</span>
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Platform Features
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/mood-tracking" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Heart className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Mood Tracking</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/analytics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Progress Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features#meditation" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Music className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Meditation Library</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features#family" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Users className="h-4 w-4 text-therapy-600" />
                    <span className="text-sm font-medium text-gray-900">Family Features</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Solutions dropdown - Simple tablet style with same items as desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <BookOpen className="h-4 w-4 mr-2" />
            Solutions
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Solutions
            </div>
            <DropdownMenuItem asChild>
              <Link to="/individuals" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Target className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Individuals</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/families" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Families</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/providers" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Providers</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Star className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Pricing</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Resources
            </div>
            <DropdownMenuItem asChild>
              <Link to="/help" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <HelpCircle className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Help Center</span>
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem asChild>
                <Link to="/community" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                  <Users className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Community</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link to="/getting-started" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <BookOpen className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Getting Started</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/compliance" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Security & Compliance</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;