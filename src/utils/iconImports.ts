
import { 
  Printer,
  ArrowLeft, 
  Clock, 
  Calendar, 
  BookOpen, 
  ThumbsUp, 
  Share2,
  Shield,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Users,
  Lock,
  Archive,
  Eye,
  BarChart3,
  Brain,
  Heart,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  Lightbulb,
  Compass,
  Globe,
  Star,
  Building,
  GraduationCap
} from 'lucide-react';

// Safe icon exports with validation
export const SafeIcons = {
  Printer,
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  ThumbsUp,
  Share2,
  Shield,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Users,
  Lock,
  Archive,
  Eye,
  BarChart3,
  Brain,
  Heart,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  Lightbulb,
  Compass,
  Globe,
  Star,
  Building,
  GraduationCap
} as const;

// Type-safe icon getter
export const getIcon = (name: keyof typeof SafeIcons) => {
  return SafeIcons[name];
};

// Validate icon exists before use
export const validateIcon = (name: string): name is keyof typeof SafeIcons => {
  return name in SafeIcons;
};
