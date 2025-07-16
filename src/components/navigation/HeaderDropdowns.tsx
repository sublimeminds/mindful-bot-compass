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
      {/* Therapy & AI dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Brain className="h-4 w-4 mr-2" />
            Therapy & AI
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              AI Therapy
            </div>
            <DropdownMenuItem asChild>
              <Link to="/therapy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <MessageSquare className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Therapy Sessions</p>
                  <p className="text-xs text-gray-500">Personalized therapy with AI</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/voice-therapy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Headphones className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Voice Technology</p>
                  <p className="text-xs text-gray-500">Natural voice conversations</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Crisis Support</p>
                  <p className="text-xs text-gray-500">24/7 crisis intervention</p>
                </div>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                  24/7
                </Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Globe className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cultural AI Features</p>
                  <p className="text-xs text-gray-500">Culturally sensitive support</p>
                </div>
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem asChild>
                <Link to="/chat" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                  <Zap className="h-4 w-4 text-therapy-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quick Chat</p>
                    <p className="text-xs text-gray-500">Instant AI support</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Features & Tools dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Settings className="h-4 w-4 mr-2" />
            Features & Tools
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            {user ? (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Your Tools
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dashboard</p>
                      <p className="text-xs text-gray-500">Your therapy overview</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mood-tracking" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Heart className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mood Tracker</p>
                      <p className="text-xs text-gray-500">Track your emotions</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Progress Analytics</p>
                      <p className="text-xs text-gray-500">Insights and trends</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/goals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Target className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Goals & Objectives</p>
                      <p className="text-xs text-gray-500">Set and track goals</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calendar" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Calendar className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Calendar</p>
                      <p className="text-xs text-gray-500">Schedule sessions</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/audio-library" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Music className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Audio Library</p>
                      <p className="text-xs text-gray-500">Meditation & exercises</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Platform Features
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/features#mood-tracking" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Heart className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mood Tracking</p>
                      <p className="text-xs text-gray-500">Advanced mood analytics</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features#analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <BarChart3 className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Progress Analytics</p>
                      <p className="text-xs text-gray-500">Detailed insights</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features#meditation" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Music className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Meditation Library</p>
                      <p className="text-xs text-gray-500">Guided sessions</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features#family" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                    <Users className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Family Features</p>
                      <p className="text-xs text-gray-500">Family therapy support</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Solutions & Resources dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <BookOpen className="h-4 w-4 mr-2" />
            Solutions & Resources
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Solutions
            </div>
            <DropdownMenuItem asChild>
              <Link to="/individuals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Target className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">For Individuals</p>
                  <p className="text-xs text-gray-500">Personal therapy plans</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/families" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">For Families</p>
                  <p className="text-xs text-gray-500">Family therapy support</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/providers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">For Providers</p>
                  <p className="text-xs text-gray-500">Professional tools</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Star className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pricing</p>
                  <p className="text-xs text-gray-500">Plans and pricing</p>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Resources
            </div>
            <DropdownMenuItem asChild>
              <Link to="/help" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <HelpCircle className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Help Center</p>
                  <p className="text-xs text-gray-500">Support and guides</p>
                </div>
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem asChild>
                <Link to="/community" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                  <Users className="h-4 w-4 text-therapy-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Community</p>
                    <p className="text-xs text-gray-500">Connect with others</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link to="/getting-started" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <BookOpen className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Getting Started</p>
                  <p className="text-xs text-gray-500">Learn how to use TherapySync</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/compliance" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Security & Compliance</p>
                  <p className="text-xs text-gray-500">Privacy and security</p>
                </div>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;