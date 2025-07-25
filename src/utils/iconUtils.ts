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
  MentalHealthLibrary
} from '@/components/icons';

// Create a wrapper component that converts custom icons to Lucide-compatible format
const createIconWrapper = (CustomIcon: React.FC<{ className?: string; size?: number }>) => {
  const WrappedIcon = (props: { className?: string; size?: number }) => {
    return React.createElement(CustomIcon, props);
  };
  return WrappedIcon as unknown as LucideIcon;
};

// Map of icon names to custom React components wrapped to be Lucide-compatible
const customIcons: Record<string, LucideIcon> = {
  // Therapy AI Icons
  'therapy-ai-core': createIconWrapper(TherapyAICore),
  'ai-therapy-chat': createIconWrapper(AITherapyChat),
  'ai-personalization': createIconWrapper(AIPersonalization),
  'adaptive-systems': createIconWrapper(AdaptiveSystems),
  'cognitive-behavioral-therapy': createIconWrapper(CognitiveBehavioralTherapy),
  'dialectical-behavior-therapy': createIconWrapper(DialecticalBehaviorTherapy),
  'mindfulness-based-therapy': createIconWrapper(MindfulnessBasedTherapy),
  'trauma-focused-therapy': createIconWrapper(TraumaFocusedTherapy),
  'cultural-ai': createIconWrapper(CulturalAI),
  'group-therapy-ai': createIconWrapper(GroupTherapyAI),
  'voice-ai-therapy': createIconWrapper(VoiceAITherapy),

  // Platform Icons
  'ai-therapist-team': createIconWrapper(AITherapistTeam),
  'mood-progress-tracking': createIconWrapper(MoodProgressTracking),
  'crisis-support-system': createIconWrapper(CrisisSupportSystem),
  'family-account-sharing': createIconWrapper(FamilyAccountSharing),
  'community-groups': createIconWrapper(CommunityGroups),
  'integrations-hub': createIconWrapper(IntegrationsHub),
  'crisis-support': createIconWrapper(CrisisSupport),

  // Tools & Data Icons
  'api-access': createIconWrapper(APIAccess),
  'mobile-apps': createIconWrapper(MobileApps),
  'data-export': createIconWrapper(DataExport),
  'custom-integrations': createIconWrapper(CustomIntegrations),
  'wearable-integration': createIconWrapper(WearableIntegration),

  // Solutions Icons
  'for-individuals': createIconWrapper(ForIndividuals),
  'for-families': createIconWrapper(ForFamilies),
  'for-organizations': createIconWrapper(ForOrganizations),
  'pricing-plans': createIconWrapper(PricingPlans),
  'healthcare-providers': createIconWrapper(HealthcareProviders),
  'enterprise-security': createIconWrapper(EnterpriseSecurity),

  // Resources Icons
  'how-it-works': createIconWrapper(HowItWorks),
  'support-center': createIconWrapper(SupportCenter),
  'learning-hub': createIconWrapper(LearningHub),
  'blog-insights': createIconWrapper(BlogInsights),
  'research-studies': createIconWrapper(ResearchStudies),
  'therapist-directory': createIconWrapper(TherapistDirectory),
  'mental-health-library': createIconWrapper(MentalHealthLibrary),
};

// Function to get either custom icon component or fallback to Lucide
export const getItemIcon = (iconName: string): LucideIcon => {
  return customIcons[iconName] || Brain; // Use custom icons or fallback to Brain
};