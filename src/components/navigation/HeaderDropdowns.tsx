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
  ChevronDown,
  Database,
  Calculator,
  Phone,
  GraduationCap,
  Lightbulb 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const HeaderDropdowns = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      {/* Therapy AI dropdown */}
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
              <Link to="/adaptive-ai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Target className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Adaptive AI</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Globe className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Cultural AI</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Features dropdown */}
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
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Core Features
            </div>
            <DropdownMenuItem asChild>
              <Link to="/mood-tracking" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Heart className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Mood Tracking</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis-support" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Crisis Support</span>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200 ml-auto">
                  24/7
                </Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/family-features" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Family Features</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/community" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Community</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools & Data dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Database className="h-4 w-4 mr-2" />
            Tools & Data
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Analytics & Tools
            </div>
            <DropdownMenuItem asChild>
              <Link to="/analytics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <BarChart3 className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Analytics Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/api-docs" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <BookOpen className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">API Access</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/data-export" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Database className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Data Export</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Solutions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <Target className="h-4 w-4 mr-2" />
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
                <Calculator className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Pricing</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Resources dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Resources
            </div>
            <DropdownMenuItem asChild>
              <Link to="/help" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <HelpCircle className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Help Center</span>
              </Link>
            </DropdownMenuItem>
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
            <DropdownMenuItem asChild>
              <Link to="/learning" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <GraduationCap className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Learning Hub</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;