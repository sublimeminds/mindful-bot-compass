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

// Hook to detect screen size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState(() => {
    if (typeof window === 'undefined') return { isTablet: false, isMedium: false };
    const width = window.innerWidth;
    return {
      isTablet: width >= 768 && width < 1024,
      isMedium: width >= 1024 && width < 1280,
    };
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isTablet: width >= 768 && width < 1024,
        isMedium: width >= 1024 && width < 1280,
      });
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};

const HeaderDropdowns = () => {
  const { user } = useAuth();
  const { isTablet, isMedium } = useScreenSize();

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
        <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/therapy-ai-core" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-therapy-50 to-calm-50 hover:from-therapy-100 hover:to-calm-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-therapy-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">TherapySync AI Core</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Advanced AI therapy engine</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">Core</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-therapy-chat" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">AI Therapy Chat</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Real-time AI conversations</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">Popular</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/voice-ai-technology" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Mic className="h-5 w-5 text-purple-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Voice AI Technology</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Natural voice interactions</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">New</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Cultural AI</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Culturally sensitive therapy</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-personalization" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200">
                <Target className="h-5 w-5 text-orange-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">AI Personalization</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Personalized therapy approach</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cbt-therapy" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-200">
                <BookOpen className="h-5 w-5 text-teal-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Cognitive Behavioral Therapy</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Evidence-based CBT techniques</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dbt-therapy" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-all duration-200">
                <Settings className="h-5 w-5 text-rose-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Dialectical Behavior Therapy</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">DBT skills and techniques</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mindfulness-therapy" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-200">
                <Heart className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Mindfulness-Based Therapy</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Mindfulness practices</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/trauma-therapy" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-200">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Trauma-Focused Therapy</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Trauma-informed care</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/adaptive-systems" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Adaptive Systems</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">AI that learns with you</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">Advanced</Badge>
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
        <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/ai-therapist-team" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200">
                <Users className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">AI Therapist Team</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Team of specialized AI therapists</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mood-progress-tracking" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-all duration-200">
                <Heart className="h-5 w-5 text-pink-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Mood & Progress Tracking</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Track emotional well-being</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis-support-system" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Crisis Support System</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">24/7 emergency support</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/family-account-sharing" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all duration-200">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Family Account Sharing</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Shared family therapy plans</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/community-groups" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-violet-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Community & Groups</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Connect with support groups</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-violet-600 border-violet-200 bg-violet-50">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/integrations-hub" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-200">
                <Settings className="h-5 w-5 text-cyan-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Integrations Hub</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Connect health apps</p>}
                </div>
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
        <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/analytics-dashboard" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Analytics Dashboard</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Advanced analytics & insights</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">Premium</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/api-access" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">API Access</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Developer API integration</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mobile-apps" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Mobile Apps</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">iOS & Android apps</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/progress-reports" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Progress Reports</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Detailed progress tracking</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50">Premium</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/data-export" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-slate-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Data Export</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Export your therapy data</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 bg-slate-50">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/custom-integrations" className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Custom Integrations</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Enterprise-level integrations</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">Enterprise</Badge>
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
        <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/for-individuals" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200">
                <Target className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">For Individuals</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Personal therapy solutions</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-families" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">For Families</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Family therapy & support</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-healthcare-providers" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">For Healthcare Providers</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Professional tools & features</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-organizations" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-all duration-200">
                <Building2 className="h-5 w-5 text-violet-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">For Organizations</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Enterprise mental health</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing-plans" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 transition-all duration-200">
                <Calculator className="h-5 w-5 text-yellow-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Pricing Plans</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Plans & pricing options</p>}
                </div>
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
        <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/help-center" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-200">
                <HelpCircle className="h-5 w-5 text-cyan-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Help Center</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Support & documentation</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/getting-started" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Getting Started</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Setup & onboarding guide</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/security-compliance" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-200">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Security & Compliance</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Privacy & security info</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/learning-hub" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-200">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Learning Hub</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Educational resources</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/blog" className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200">
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Blog</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Latest news & insights</p>}
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