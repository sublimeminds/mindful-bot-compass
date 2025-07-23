
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  BarChart3, 
  User, 
  Calendar, 
  Settings, 
  Target, 
  TrendingUp, 
  Users, 
  Building, 
  BookOpen, 
  Book, 
  FileText,
  LucideIcon
} from 'lucide-react';

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Heart,
  MessageCircle,
  BarChart3,
  User,
  Calendar,
  Settings,
  Target,
  TrendingUp,
  Users,
  Building,
  BookOpen,
  Book,
  FileText,
};

export const getItemIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Brain; // Default to Brain if icon not found
};
