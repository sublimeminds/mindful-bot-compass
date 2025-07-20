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
    if (typeof window === 'undefined') return { isTablet: false, isMedium: false, isDesktop: false };
    const width = window.innerWidth;
    return {
      isTablet: width >= 768 && width < 1024,
      isMedium: width >= 1024 && width < 1280,
      isDesktop: width >= 1280,
    };
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isTablet: width >= 768 && width < 1024,
        isMedium: width >= 1024 && width < 1280,
        isDesktop: width >= 1280,
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
  const { isTablet, isMedium, isDesktop } = useScreenSize();

  // Helper function to get responsive styles
  const getDropdownItemClasses = () => isDesktop ? 'p-4' : 'p-3';
  const getIconClasses = () => isDesktop ? 'h-8 w-8' : 'h-5 w-5';
  const getTitleClasses = () => isDesktop ? 'text-base' : 'text-sm';
  const getDropdownWidth = () => isDesktop ? 'w-96' : 'w-80';

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
        <DropdownMenuContent className={`${getDropdownWidth()} bg-white border border-gray-200 shadow-lg z-50`}>
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/therapy-ai-core" className={`flex items-center justify-between ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-therapy-50 to-calm-50 hover:from-therapy-100 hover:to-calm-100 transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <Brain className={`${getIconClasses()} text-therapy-600`} />
                  <div>
                    <span className={`${getTitleClasses()} font-medium text-gray-900`}>TherapySync AI Core</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Advanced AI therapy engine</p>}
                    {isDesktop && <p className="text-sm text-gray-600 mt-1">Advanced AI therapy engine with personalized treatment plans and adaptive learning</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">Core</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ai-therapy-chat" className={`flex items-center justify-between ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <MessageSquare className={`${getIconClasses()} text-green-600`} />
                  <div>
                    <span className={`${getTitleClasses()} font-medium text-gray-900`}>AI Therapy Chat</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Real-time AI conversations</p>}
                    {isDesktop && <p className="text-sm text-gray-600 mt-1">Real-time AI conversations with natural language processing and emotional intelligence</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">Popular</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/voice-ai-technology" className={`flex items-center justify-between ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <Mic className={`${getIconClasses()} text-purple-600`} />
                  <div>
                    <span className={`${getTitleClasses()} font-medium text-gray-900`}>Voice AI Technology</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Natural voice interactions</p>}
                    {isDesktop && <p className="text-sm text-gray-600 mt-1">Natural voice interactions with emotion detection and 29 language support</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">New</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cultural-ai" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200`}>
                <Globe className={`${getIconClasses()} text-blue-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Cultural AI</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Culturally sensitive therapy</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Culturally sensitive therapy with understanding of diverse backgrounds and values</p>}
                </div>
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
        <DropdownMenuContent className={`${getDropdownWidth()} bg-white border border-gray-200 shadow-lg z-50`}>
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/mood-progress-tracking" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-all duration-200`}>
                <Heart className={`${getIconClasses()} text-pink-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Mood & Progress Tracking</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Track emotional well-being</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Advanced mood tracking with AI-powered insights and pattern recognition</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/crisis-support-system" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200`}>
                <Shield className={`${getIconClasses()} text-red-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Crisis Support System</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">24/7 emergency support</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">24/7 emergency support with automated detection and immediate intervention</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/family-account-sharing" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all duration-200`}>
                <Users className={`${getIconClasses()} text-green-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Family Account Sharing</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Shared family therapy plans</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Comprehensive family therapy plans with parental controls and shared progress</p>}
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
        <DropdownMenuContent className={`${getDropdownWidth()} bg-white border border-gray-200 shadow-lg z-50`}>
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/analytics-dashboard" className={`flex items-center justify-between ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <BarChart3 className={`${getIconClasses()} text-purple-600`} />
                  <div>
                    <span className={`${getTitleClasses()} font-medium text-gray-900`}>Analytics Dashboard</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Advanced analytics & insights</p>}
                    {isDesktop && <p className="text-sm text-gray-600 mt-1">Advanced analytics dashboard with comprehensive insights and personalized recommendations</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">Premium</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/api-access" className={`flex items-center justify-between ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200`}>
                <div className="flex items-center space-x-3">
                  <BookOpen className={`${getIconClasses()} text-blue-600`} />
                  <div>
                    <span className={`${getTitleClasses()} font-medium text-gray-900`}>API Access</span>
                    {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Developer API integration</p>}
                    {isDesktop && <p className="text-sm text-gray-600 mt-1">Complete developer API access with comprehensive documentation and support</p>}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">Pro</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mobile-apps" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200`}>
                <Smartphone className={`${getIconClasses()} text-green-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Mobile Apps</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">iOS & Android apps</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Full-featured iOS and Android apps with offline support and sync</p>}
                </div>
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
        <DropdownMenuContent className={`${getDropdownWidth()} bg-white border border-gray-200 shadow-lg z-50`}>
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/for-individuals" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200`}>
                <Target className={`${getIconClasses()} text-emerald-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>For Individuals</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Personal therapy solutions</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Personalized therapy solutions tailored to individual mental health needs</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-families" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200`}>
                <Users className={`${getIconClasses()} text-blue-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>For Families</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Family therapy & support</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Comprehensive family therapy support with adaptive pricing and shared progress tracking</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/for-healthcare-providers" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200`}>
                <Shield className={`${getIconClasses()} text-red-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>For Healthcare Providers</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Professional tools & features</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Professional-grade tools and features designed for healthcare providers</p>}
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
        <DropdownMenuContent className={`${getDropdownWidth()} bg-white border border-gray-200 shadow-lg z-50`}>
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link to="/help-center" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-200`}>
                <HelpCircle className={`${getIconClasses()} text-cyan-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Help Center</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Support & documentation</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Comprehensive support center with documentation, guides, and live chat</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/getting-started" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200`}>
                <BookOpen className={`${getIconClasses()} text-green-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Getting Started</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Setup & onboarding guide</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Complete setup and onboarding guide to get you started quickly</p>}
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/learning-hub" className={`flex items-center space-x-3 ${getDropdownItemClasses()} rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-200`}>
                <GraduationCap className={`${getIconClasses()} text-purple-600`} />
                <div>
                  <span className={`${getTitleClasses()} font-medium text-gray-900`}>Learning Hub</span>
                  {(isTablet || isMedium) && <p className="text-xs text-gray-600 mt-1">Educational resources</p>}
                  {isDesktop && <p className="text-sm text-gray-600 mt-1">Educational resources and mental health learning materials</p>}
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