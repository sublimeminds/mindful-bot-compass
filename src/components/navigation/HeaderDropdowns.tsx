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
  Lightbulb,
  Mic,
  Smartphone,
  Building2,
  Building
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
            <DropdownMenuItem asChild>
              <Link to="/therapy-ai-core" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">TherapySync AI Core</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Core</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-therapy-chat" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">AI Therapy Chat</span>
                </div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">Popular</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/voice-ai-technology" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mic className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Voice AI Technology</span>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">New</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Globe className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Cultural AI</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-personalization" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Target className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">AI Personalization</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cbt-therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <BookOpen className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Cognitive Behavioral Therapy (CBT)</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dbt-therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Settings className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Dialectical Behavior Therapy (DBT)</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mindfulness-therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Heart className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Mindfulness-Based Therapy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/trauma-therapy" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Trauma-Focused Therapy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/adaptive-systems" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Adaptive Systems</span>
                </div>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">Advanced</Badge>
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
            <DropdownMenuItem asChild>
              <Link to="/ai-therapist-team" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">AI Therapist Team</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mood-progress-tracking" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Heart className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Mood & Progress Tracking</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis-support-system" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Crisis Support System</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/family-account-sharing" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Family Account Sharing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/community-groups" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Community & Groups</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/integrations-hub" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Settings className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Integrations Hub</span>
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
            <DropdownMenuItem asChild>
              <Link to="/analytics-dashboard" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Analytics Dashboard</span>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">Premium</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/api-access" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">API Access</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mobile-apps" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Smartphone className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Mobile Apps</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/progress-reports" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Progress Reports</span>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">Premium</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/data-export" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Data Export</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/custom-integrations" className="flex items-center justify-between p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium text-gray-900">Custom Integrations</span>
                </div>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">Enterprise</Badge>
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
            <DropdownMenuItem asChild>
              <Link to="/for-individuals" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Target className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Individuals</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-families" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Users className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Families</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-healthcare-providers" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Healthcare Providers</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-organizations" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Building2 className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">For Organizations</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing-plans" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Calculator className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Pricing Plans</span>
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
            <DropdownMenuItem asChild>
              <Link to="/help-center" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
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
              <Link to="/security-compliance" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Security & Compliance</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/learning-hub" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <GraduationCap className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Learning Hub</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/blog" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors">
                <FileText className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-900">Blog</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;