
// Common component prop types and interfaces
import { ReactNode } from 'react';

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface FormStepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
}

export interface SessionData {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
  }>;
  mood?: number;
  techniques?: string[];
  notes?: string;
  status: 'active' | 'completed' | 'paused';
}
