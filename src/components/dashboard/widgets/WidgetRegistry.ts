import { LucideIcon } from 'lucide-react';
import { 
  Heart, 
  Zap, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Target,
  Users,
  Activity,
  Brain,
  Clock,
  Star,
  CheckCircle,
  BarChart3,
  Settings
} from 'lucide-react';

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  category: 'essential' | 'progress' | 'ai-features' | 'analytics' | 'communication' | 'wellness';
  icon: LucideIcon;
  defaultSize: 'small' | 'medium' | 'large';
  minSize: 'small' | 'medium' | 'large';
  maxSize: 'small' | 'medium' | 'large';
  isResizable: boolean;
  requiresData?: string[];
  component: string;
  defaultProps?: Record<string, any>;
}

export const WIDGET_REGISTRY: WidgetConfig[] = [
  // Essential Widgets
  {
    id: 'welcome',
    name: 'Welcome',
    description: 'Personalized welcome message and quick overview',
    category: 'essential',
    icon: Heart,
    defaultSize: 'large',
    minSize: 'medium',
    maxSize: 'large',
    isResizable: true,
    component: 'WelcomeWidget'
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Fast access to key features and tools',
    category: 'essential',
    icon: Zap,
    defaultSize: 'medium',
    minSize: 'medium',
    maxSize: 'large',
    isResizable: true,
    component: 'QuickActionsWidget'
  },
  {
    id: 'mood-tracker',
    name: 'Mood Tracker',
    description: 'Track and visualize your mood patterns',
    category: 'essential',
    icon: Heart,
    defaultSize: 'medium',
    minSize: 'small',
    maxSize: 'large',
    isResizable: true,
    component: 'MoodTrackerWidget'
  },

  // Progress Widgets
  {
    id: 'xp-progress',
    name: 'XP Progress',
    description: 'Your therapy journey progress and achievements',
    category: 'progress',
    icon: Award,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'XPProgressWidget'
  },
  {
    id: 'recent-achievements',
    name: 'Recent Achievements',
    description: 'Latest milestones and accomplishments',
    category: 'progress',
    icon: Star,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'RecentAchievementsWidget'
  },
  {
    id: 'session-history',
    name: 'Session History',
    description: 'Recent therapy sessions and insights',
    category: 'progress',
    icon: Clock,
    defaultSize: 'large',
    minSize: 'medium',
    maxSize: 'large',
    isResizable: true,
    component: 'SessionHistoryWidget'
  },
  {
    id: 'progress-overview',
    name: 'Progress Overview',
    description: 'Comprehensive view of your therapy progress',
    category: 'progress',
    icon: TrendingUp,
    defaultSize: 'medium',
    minSize: 'medium',
    maxSize: 'large',
    isResizable: true,
    component: 'ProgressOverviewWidget'
  },

  // AI Features
  {
    id: 'ai-insights',
    name: 'AI Insights',
    description: 'Personalized insights and recommendations',
    category: 'ai-features',
    icon: Brain,
    defaultSize: 'medium',
    minSize: 'small',
    maxSize: 'large',
    isResizable: true,
    component: 'AIInsightsWidget'
  },
  {
    id: 'smart-recommendations',
    name: 'Smart Recommendations',
    description: 'AI-powered therapy suggestions',
    category: 'ai-features',
    icon: Target,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'SmartRecommendationsWidget'
  },
  {
    id: 'transcription-insights',
    name: 'Session Insights',
    description: 'AI-generated insights from your therapy sessions',
    category: 'ai-features',
    icon: MessageSquare,
    defaultSize: 'medium',
    minSize: 'small',
    maxSize: 'large',
    isResizable: true,
    component: 'TranscriptionInsightsWidget'
  },
  {
    id: 'therapist-avatar',
    name: 'Therapist Avatar',
    description: 'Your AI therapist companion',
    category: 'ai-features',
    icon: Users,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'TherapistAvatarWidget'
  },

  // Analytics
  {
    id: 'compliance-status',
    name: 'Compliance Status',
    description: 'Therapy plan adherence and compliance',
    category: 'analytics',
    icon: CheckCircle,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'ComplianceStatusWidget'
  },
  {
    id: 'analytics-overview',
    name: 'Analytics Overview',
    description: 'Detailed analytics and trends',
    category: 'analytics',
    icon: BarChart3,
    defaultSize: 'large',
    minSize: 'medium',
    maxSize: 'large',
    isResizable: true,
    component: 'AnalyticsOverviewWidget'
  },

  // Communication
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Recent notifications and updates',
    category: 'communication',
    icon: MessageSquare,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'NotificationWidget'
  },

  // Wellness
  {
    id: 'daily-goals',
    name: 'Daily Goals',
    description: 'Track your daily therapy goals',
    category: 'wellness',
    icon: Target,
    defaultSize: 'medium',
    minSize: 'small',
    maxSize: 'large',
    isResizable: true,
    component: 'DailyGoalsWidget'
  },
  {
    id: 'streak-tracker',
    name: 'Streak Tracker',
    description: 'Maintain your therapy engagement streak',
    category: 'wellness',
    icon: Activity,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'StreakTrackerWidget'
  },
  {
    id: 'mindfulness-reminders',
    name: 'Mindfulness Reminders',
    description: 'Gentle reminders for mindfulness practice',
    category: 'wellness',
    icon: Heart,
    defaultSize: 'small',
    minSize: 'small',
    maxSize: 'medium',
    isResizable: true,
    component: 'MindfulnessWidget'
  }
];

export const DEFAULT_LAYOUT = [
  'welcome',
  'quick-actions',
  'mood-tracker',
  'xp-progress',
  'recent-achievements',
  'notifications'
];

export const getWidgetsByCategory = (category: WidgetConfig['category']) => {
  return WIDGET_REGISTRY.filter(widget => widget.category === category);
};

export const getWidgetById = (id: string) => {
  return WIDGET_REGISTRY.find(widget => widget.id === id);
};