
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  BarChart3, 
  FileText, 
  Settings, 
  Activity, 
  Shield,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  UserCheck,
  MessageCircle,
  TrendingUp,
  Zap,
  Webhook,
  Monitor,
  AlertTriangle,
  CreditCard,
  Key,
  Globe,
  Database,
  Lock,
  ClipboardList,
  Heart,
  Phone,
  Briefcase,
  DollarSign,
  PieChart,
  FileSearch,
  Headphones,
  BookOpen,
  HelpCircle,
  TestTube,
  Gauge,
  Eye,
  Moon,
  Sun
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarSection {
  title: string;
  icon: React.ElementType;
  items: {
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: number;
    description?: string;
  }[];
}

const AdminSidebarEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard, description: 'Main metrics and insights' },
        { label: 'Quick Actions', path: '/admin/quick-actions', icon: Zap, description: 'Frequently used actions' },
        { label: 'System Status', path: '/admin/system-status', icon: Activity, description: 'Real-time system health' },
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      items: [
        { label: 'User Accounts', path: '/admin/users', icon: Users, badge: 5, description: 'Manage user accounts' },
        { label: 'Roles & Permissions', path: '/admin/roles', icon: UserCheck, description: 'User access control' },
        { label: 'Communication Center', path: '/admin/user-communications', icon: MessageCircle, description: 'User messaging' },
        { label: 'User Analytics', path: '/admin/user-analytics', icon: TrendingUp, description: 'User behavior insights' },
      ]
    },
    {
      title: 'Content & Therapy',
      icon: BookOpen,
      items: [
        { label: 'Content Library', path: '/admin/content', icon: FileText, description: 'Therapy resources' },
        { label: 'AI Templates', path: '/admin/ai-templates', icon: Brain, description: 'Response templates' },
        { label: 'Crisis Resources', path: '/admin/crisis-resources', icon: AlertTriangle, description: 'Emergency resources' },
        { label: 'Notification Templates', path: '/admin/notification-templates', icon: Bell, description: 'Message templates' },
        { label: 'Help & FAQ', path: '/admin/help-content', icon: HelpCircle, description: 'Support content' },
      ]
    },
    {
      title: 'AI & Intelligence',
      icon: Brain,
      items: [
        { label: 'AI Configuration', path: '/admin/ai', icon: Brain, description: 'AI model settings' },
        { label: 'Therapeutic Approaches', path: '/admin/therapeutic-approaches', icon: Heart, description: 'Therapy methodologies' },
        { label: 'Quality Assurance', path: '/admin/quality-assurance', icon: Eye, description: 'AI response quality' },
        { label: 'A/B Testing', path: '/admin/ab-testing', icon: TestTube, description: 'Feature testing' },
        { label: 'Performance Metrics', path: '/admin/ai-performance', icon: Gauge, description: 'AI effectiveness' },
      ]
    },
    {
      title: 'Analytics & Reporting',
      icon: BarChart3,
      items: [
        { label: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3, description: 'Overall platform metrics' },
        { label: 'User Engagement', path: '/admin/engagement-analytics', icon: TrendingUp, description: 'User interaction data' },
        { label: 'Therapist Performance', path: '/admin/therapist-analytics', icon: Briefcase, description: 'Therapist effectiveness' },
        { label: 'Business Intelligence', path: '/admin/business-intelligence', icon: PieChart, description: 'Business insights' },
        { label: 'Custom Reports', path: '/admin/custom-reports', icon: FileSearch, description: 'Report builder' },
      ]
    },
    {
      title: 'Integrations & APIs',
      icon: Webhook,
      items: [
        { label: 'WhatsApp Business', path: '/admin/integrations', icon: MessageSquare, description: 'WhatsApp integration' },
        { label: 'External APIs', path: '/admin/external-apis', icon: Globe, description: 'Third-party APIs' },
        { label: 'Webhook Management', path: '/admin/webhooks', icon: Webhook, description: 'Webhook configuration' },
        { label: 'Third-party Services', path: '/admin/third-party', icon: Zap, description: 'External services' },
      ]
    },
    {
      title: 'System Administration',
      icon: Settings,
      items: [
        { label: 'System Health', path: '/admin/system-health', icon: Monitor, description: 'System monitoring' },
        { label: 'Performance', path: '/admin/performance', icon: Activity, description: 'Performance optimization' },
        { label: 'Security Management', path: '/admin/security', icon: Lock, description: 'Security settings' },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList, description: 'Activity tracking' },
        { label: 'Configuration', path: '/admin/system', icon: Settings, description: 'System configuration' },
      ]
    },
    {
      title: 'Crisis & Safety',
      icon: Shield,
      items: [
        { label: 'Crisis Dashboard', path: '/admin/crisis', icon: AlertTriangle, badge: 2, description: 'Crisis intervention' },
        { label: 'Safety Monitoring', path: '/admin/safety-monitoring', icon: Shield, description: 'User safety tracking' },
        { label: 'Emergency Protocols', path: '/admin/emergency-protocols', icon: Phone, description: 'Emergency procedures' },
        { label: 'Resource Management', path: '/admin/crisis-resource-mgmt', icon: Headphones, description: 'Crisis resources' },
      ]
    },
    {
      title: 'Billing & Subscriptions',
      icon: CreditCard,
      items: [
        { label: 'Subscription Management', path: '/admin/subscriptions', icon: CreditCard, description: 'User subscriptions' },
        { label: 'Payment Processing', path: '/admin/payments', icon: DollarSign, description: 'Payment handling' },
        { label: 'Revenue Analytics', path: '/admin/revenue-analytics', icon: TrendingUp, description: 'Financial metrics' },
        { label: 'Plan Configuration', path: '/admin/plan-config', icon: Key, description: 'Subscription plans' },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const filteredSections = sidebarSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0 || searchQuery === '');

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-gray-900 text-white h-full flex flex-col transition-all duration-300 border-r border-gray-700`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-400 hover:text-white"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
            </Button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search admin features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => !isCollapsed && toggleSection(section.title)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  expandedSections.includes(section.title) ? 'bg-gray-800' : 'hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5 text-blue-400" />
                  {!isCollapsed && (
                    <span className="font-medium text-gray-300">{section.title}</span>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    expandedSections.includes(section.title) ? 'rotate-180' : ''
                  }`} />
                )}
              </button>

              {(expandedSections.includes(section.title) || isCollapsed) && (
                <div className={`mt-1 space-y-1 ${isCollapsed ? 'hidden' : ''}`}>
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-6 py-2 rounded-lg transition-colors group ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && (
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 group-hover:text-gray-400">
                                {item.description}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {!isCollapsed && item.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebarEnhanced;
