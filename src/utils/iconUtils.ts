import React from 'react';
import { LucideIcon, Brain } from 'lucide-react';

// Import all custom AI-generated icons
import {
  TherapyAICore,
  AITherapyChat,
  AIPersonalization,
  AdaptiveSystems,
  CognitiveBehavioralTherapy,
  DialecticalBehaviorTherapy,
  MindfulnessBasedTherapy,
  TraumaFocusedTherapy,
  CulturalAI,
  GroupTherapyAI,
  VoiceAITherapy,
  AITherapistTeam,
  MoodProgressTracking,
  CrisisSupportSystem,
  FamilyAccountSharing,
  CommunityGroups,
  IntegrationsHub,
  CrisisSupport,
  APIAccess,
  MobileApps,
  DataExport,
  CustomIntegrations,
  WearableIntegration,
  ForIndividuals,
  ForFamilies,
  ForOrganizations,
  PricingPlans,
  HealthcareProviders,
  EnterpriseSecurity,
  HowItWorks,
  SupportCenter,
  LearningHub,
  BlogInsights,
  ResearchStudies,
  TherapistDirectory,
  MentalHealthLibrary,
  TherapySyncAICore,
  TherapyTypesOverview,
  AnalyticsDashboard,
  ProgressReports,
  GettingStarted,
  SecurityCompliance,
  TherapyAICategory,
  PlatformCategory,
  ToolsDataCategory,
  SolutionsCategory,
  ResourcesCategory
} from '@/components/icons';

// Import custom AI-generated icons separately
import ApproachesShowcaseIcon from '@/components/icons/custom/ApproachesShowcaseIcon';
import SecurityShieldIcon from '@/components/icons/custom/SecurityShieldIcon';
import FeaturesIcon from '@/components/icons/custom/FeaturesIcon';
import GetStartedIcon from '@/components/icons/custom/GetStartedIcon';

// Direct mapping without wrapper - icons are now proper SVG React components
const customIcons: Record<string, React.FC<{ className?: string; size?: number }>> = {
  // Therapy AI Icons
  'therapy-ai-core': TherapyAICore,
  'therapy-sync-ai-core': TherapySyncAICore,
  'therapy-types-overview': TherapyTypesOverview,
  'ai-therapy-chat': AITherapyChat,
  'ai-personalization': AIPersonalization,
  'adaptive-systems': AdaptiveSystems,
  'cognitive-behavioral-therapy': CognitiveBehavioralTherapy,
  'dialectical-behavior-therapy': DialecticalBehaviorTherapy,
  'mindfulness-based-therapy': MindfulnessBasedTherapy,
  'trauma-focused-therapy': TraumaFocusedTherapy,
  'cultural-ai': CulturalAI,
  'group-therapy-ai': GroupTherapyAI,
  'voice-ai-therapy': VoiceAITherapy,

  // Platform Icons
  'ai-therapist-team': AITherapistTeam,
  'mood-progress-tracking': MoodProgressTracking,
  'crisis-support-system': CrisisSupportSystem,
  'family-account-sharing': FamilyAccountSharing,
  'community-groups': CommunityGroups,
  'integrations-hub': IntegrationsHub,
  'crisis-support': CrisisSupport,

  // Tools & Data Icons
  'analytics-dashboard': AnalyticsDashboard,
  'api-access': APIAccess,
  'mobile-apps': MobileApps,
  'progress-reports': ProgressReports,
  'data-export': DataExport,
  'custom-integrations': CustomIntegrations,
  'wearable-integration': WearableIntegration,

  // Solutions Icons
  'for-individuals': ForIndividuals,
  'for-families': ForFamilies,
  'for-organizations': ForOrganizations,
  'pricing-plans': PricingPlans,
  'healthcare-providers': HealthcareProviders,
  'enterprise-security': EnterpriseSecurity,

  // Resources Icons
  'getting-started': GettingStarted,
  'how-it-works': HowItWorks,
  'security-compliance': SecurityCompliance,
  'support-center': SupportCenter,
  'learning-hub': LearningHub,
  'blog-insights': BlogInsights,
  'research-studies': ResearchStudies,
  'therapist-directory': TherapistDirectory,
  'mental-health-library': MentalHealthLibrary,

  // Navigation Category Icons
  'therapy-ai-category': TherapyAICategory,
  'platform-category': PlatformCategory,
  'tools-data-category': ToolsDataCategory,
  'solutions-category': SolutionsCategory,
  'resources-category': ResourcesCategory,

  // Custom AI-Generated Icons
  'approaches-showcase': ApproachesShowcaseIcon,
  'security-shield': SecurityShieldIcon,
  'features-icon': FeaturesIcon,
  'get-started': GetStartedIcon,
};

// Function to get either custom icon component or fallback to Lucide
export const getItemIcon = (iconName: string): React.FC<{ className?: string; size?: number }> | LucideIcon => {
  return customIcons[iconName] || Brain; // Use custom icons or fallback to Brain
};