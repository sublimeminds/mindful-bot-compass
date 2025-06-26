
// Browser API types for Speech Recognition, PWA, and other browser APIs
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export interface WindowWithBeforeInstallPrompt extends Window {
  beforeinstallprompt?: BeforeInstallPromptEvent;
}

export interface UserMetrics {
  sessionCount: number;
  avgSessionDuration: number;
  completionRate: number;
  lastActive: string;
  totalMoodEntries: number;
  averageMood: number;
  streakDays: number;
  goalsCompleted: number;
  techniquesUsed: string[];
  preferredThemes: string[];
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
  systemLoad: number;
}

export interface TherapistData {
  id: string;
  name: string;
  specializations: string[];
  avatar?: string;
  rating: number;
  experience: number;
  approach: string;
  availability: boolean;
  languages: string[];
}

export interface OnboardingData {
  personalInfo: {
    name: string;
    age: number;
    location: string;
  };
  preferences: {
    language: string;
    timezone: string;
    themes: string[];
  };
  mentalHealthInfo: {
    goals: string[];
    challenges: string[];
    experience: string;
  };
  culturalContext: {
    background: string;
    preferences: string[];
  };
}
