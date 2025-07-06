# API Reference Documentation

## Overview

TherapySync AI provides a comprehensive API through Supabase Edge Functions, offering AI-powered therapy capabilities, crisis detection, real-time communication, and administrative features.

## Base Configuration

```typescript
const supabaseUrl = 'https://dbwrbjjmraodegffupnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Authentication

All API endpoints require authentication via Supabase Auth JWT tokens, except where explicitly noted as public.

```typescript
// Set auth header
const { data: { session } } = await supabase.auth.getSession()
const authHeader = `Bearer ${session?.access_token}`
```

## Edge Functions

### AI Therapy Chat

**Endpoint**: `/functions/v1/ai-therapy-chat`
**Method**: POST
**Authentication**: Required

Handles AI-powered therapy conversations with crisis detection and personalized responses.

```typescript
interface TherapyChatRequest {
  message: string;
  sessionId?: string;
  userId: string;
  personalityId?: string;
  culturalContext?: {
    language: string;
    culturalBackground?: string;
    communicationStyle?: string;
  };
}

interface TherapyChatResponse {
  response: string;
  sessionId: string;
  crisisDetected?: {
    level: 'mild' | 'moderate' | 'severe' | 'immediate';
    resources: CrisisResource[];
    interventionTriggered: boolean;
  };
  emotionalAnalysis?: {
    sentiment: number;
    emotions: string[];
    intensity: number;
  };
  recommendations?: string[];
}

// Usage example
const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
  body: {
    message: "I've been feeling really overwhelmed lately",
    userId: user.id,
    personalityId: "empathetic-therapist",
    culturalContext: {
      language: "en",
      communicationStyle: "supportive"
    }
  }
});
```

### Crisis Detection & Analysis

**Endpoint**: `/functions/v1/analyze-emotion`
**Method**: POST
**Authentication**: Required

Advanced emotion analysis and crisis detection service.

```typescript
interface EmotionAnalysisRequest {
  text: string;
  userId: string;
  sessionContext?: {
    previousMessages: string[];
    sessionDuration: number;
  };
}

interface EmotionAnalysisResponse {
  emotions: {
    primary: string;
    secondary: string[];
    intensity: number;
  };
  crisisIndicators: {
    detected: boolean;
    level: 'none' | 'mild' | 'moderate' | 'severe' | 'immediate';
    keywords: string[];
    confidence: number;
  };
  recommendations: {
    immediate: string[];
    followUp: string[];
    resources: CrisisResource[];
  };
}
```

### WhatsApp Integration

**Endpoint**: `/functions/v1/whatsapp-webhook`
**Method**: POST
**Authentication**: Public (Webhook)

Handles incoming WhatsApp messages and automated responses.

```typescript
interface WhatsAppWebhookPayload {
  entry: [{
    changes: [{
      value: {
        messages: [{
          id: string;
          from: string;
          type: 'text' | 'image' | 'audio';
          text?: { body: string };
          timestamp: string;
        }];
      };
    }];
  }];
}

// Automatic response configuration
interface WhatsAppConfig {
  userId: string;
  personalityId: string;
  responseDelay: number;
  businessHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  crisisEscalation: boolean;
}
```

**Endpoint**: `/functions/v1/whatsapp-send-message`
**Method**: POST
**Authentication**: Required

Send messages through WhatsApp Business API.

```typescript
interface SendWhatsAppMessageRequest {
  phoneNumber: string;
  message: string;
  messageType: 'text' | 'template';
  templateName?: string;
  templateParams?: Record<string, string>;
}
```

### Personalized Recommendations

**Endpoint**: `/functions/v1/generate-personalized-recommendations`
**Method**: POST
**Authentication**: Required

AI-generated personalized recommendations based on user behavior and therapy progress.

```typescript
interface RecommendationRequest {
  userId: string;
  context: {
    recentSessions: number;
    moodTrend: 'improving' | 'stable' | 'declining';
    goalProgress: Record<string, number>;
    preferredTechniques: string[];
  };
}

interface RecommendationResponse {
  recommendations: {
    id: string;
    type: 'technique' | 'goal' | 'session' | 'resource';
    title: string;
    description: string;
    reasoning: string;
    priority: number;
    estimatedImpact: number;
    actionSteps: string[];
  }[];
  insights: {
    patterns: string[];
    progress: string;
    areas: string[];
  };
}
```

### Notification System

**Endpoint**: `/functions/v1/generate-intelligent-notifications`
**Method**: POST
**Authentication**: System (Cron Job)

Intelligent notification generation based on user behavior patterns.

```typescript
interface NotificationTrigger {
  userId: string;
  triggerType: 'session_gap' | 'mood_decline' | 'goal_stagnation' | 'crisis_detection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, any>;
}

interface NotificationResponse {
  notificationsCreated: number;
  crisisInterventions: number;
  usersProcessed: number;
  summary: {
    sessionReminders: number;
    moodCheckins: number;
    goalMotivation: number;
    crisisSupport: number;
  };
}
```

### User Preferences

**Endpoint**: `/functions/v1/user-preferences`
**Method**: GET/POST
**Authentication**: Required

Manage user preferences and personalization settings.

```typescript
interface UserPreferences {
  therapy: {
    preferredPersonality: string;
    sessionFrequency: 'daily' | 'weekly' | 'biweekly';
    reminderTime: string;
    communicationStyle: 'direct' | 'gentle' | 'motivational';
  };
  notifications: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    frequency: 'minimal' | 'normal' | 'frequent';
  };
  privacy: {
    dataSharing: boolean;
    analyticsTracking: boolean;
    familyVisibility: 'private' | 'limited' | 'full';
  };
  cultural: {
    language: string;
    culturalBackground?: string;
    religiousConsiderations: boolean;
    communicationPreferences: string[];
  };
}

// Get user preferences
const { data } = await supabase.functions.invoke('user-preferences', {
  method: 'GET'
});

// Update user preferences
const { data } = await supabase.functions.invoke('user-preferences', {
  method: 'POST',
  body: preferences
});
```

### Voice Services

**Endpoint**: `/functions/v1/text-to-speech`
**Method**: POST
**Authentication**: Required

Text-to-speech conversion with emotional context and personalization.

```typescript
interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
  emotionalContext?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    intensity: 'low' | 'medium' | 'high';
    crisisLevel?: boolean;
  };
  settings: {
    speed: number;
    pitch: number;
    stability: number;
  };
}

interface TextToSpeechResponse {
  audioUrl: string;
  duration: number;
  format: 'mp3' | 'wav';
  cost: number;
}
```

**Endpoint**: `/functions/v1/voice-to-text`
**Method**: POST
**Authentication**: Required

Voice-to-text transcription with emotional analysis.

```typescript
interface VoiceToTextRequest {
  audioFile: File | Blob;
  language?: string;
  emotionalAnalysis?: boolean;
}

interface VoiceToTextResponse {
  transcript: string;
  confidence: number;
  emotionalAnalysis?: {
    sentiment: number;
    emotions: string[];
    voiceStress: number;
  };
  duration: number;
}
```

### Administrative APIs

**Endpoint**: `/functions/v1/admin-whatsapp-config`
**Method**: GET/POST
**Authentication**: Admin Required

Administrative WhatsApp configuration management.

```typescript
interface AdminWhatsAppConfig {
  globalSettings: {
    defaultPersonality: string;
    responseDelayRange: [number, number];
    crisisEscalationEnabled: boolean;
    businessHoursEnforcement: boolean;
  };
  systemPrompts: {
    id: string;
    name: string;
    personality: string;
    prompt: string;
    isActive: boolean;
  }[];
  analytics: {
    totalMessages: number;
    responseRate: number;
    crisisDetections: number;
    userSatisfaction: number;
  };
}
```

### Security & Monitoring

**Endpoint**: `/functions/v1/security-monitor`
**Method**: POST
**Authentication**: System

Security monitoring and threat detection.

```typescript
interface SecurityEvent {
  eventType: 'login_attempt' | 'data_access' | 'api_abuse' | 'suspicious_activity';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityResponse {
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
  blocked: boolean;
  alertsSent: number;
}
```

## Error Handling

All API endpoints return consistent error responses:

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}

// Common error codes
enum ErrorCodes {
  AUTHENTICATION_REQUIRED = 'auth_required',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  CRISIS_DETECTED = 'crisis_detected',
  AI_SERVICE_UNAVAILABLE = 'ai_service_unavailable',
  VALIDATION_ERROR = 'validation_error',
  INTERNAL_ERROR = 'internal_error'
}
```

## Rate Limiting

API endpoints have the following rate limits:

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| AI Chat | 60 requests | per minute |
| Crisis Detection | 100 requests | per minute |
| WhatsApp | 1000 requests | per minute |
| Analytics | 30 requests | per minute |
| Voice Services | 20 requests | per minute |
| Admin APIs | 100 requests | per minute |

## Webhooks

### WhatsApp Webhook Configuration

```typescript
// Webhook URL format
const webhookUrl = 'https://dbwrbjjmraodegffupnx.supabase.co/functions/v1/whatsapp-webhook'

// Verification setup
const verifyToken = 'your-verify-token'
const webhookSecret = 'your-webhook-secret'

// Webhook payload validation
function validateWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  return signature === `sha256=${expectedSignature}`;
}
```

## SDK Examples

### JavaScript/TypeScript Client

```typescript
class TherapySyncAPI {
  private supabase: SupabaseClient;

  constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  async startTherapySession(message: string, options?: TherapyChatOptions): Promise<TherapyChatResponse> {
    const { data, error } = await this.supabase.functions.invoke('ai-therapy-chat', {
      body: { message, ...options }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async analyzeEmotion(text: string): Promise<EmotionAnalysisResponse> {
    const { data, error } = await this.supabase.functions.invoke('analyze-emotion', {
      body: { text }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getRecommendations(context: RecommendationContext): Promise<RecommendationResponse> {
    const { data, error } = await this.supabase.functions.invoke('generate-personalized-recommendations', {
      body: { context }
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
}

// Usage
const api = new TherapySyncAPI(supabaseUrl, supabaseKey);
const response = await api.startTherapySession("I'm feeling anxious today");
```

---

*API documentation updated regularly to reflect new features and improvements.*