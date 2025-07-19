export interface TherapistCharacterProfile {
  id: string;
  therapist_id: string;
  personal_backstory: {
    early_inspiration?: string;
    personal_journey?: string;
    cultural_influence?: string;
    motivation?: string;
    approach_development?: string;
    community_connection?: string;
  };
  signature_phrases: string[];
  speech_patterns: {
    speaking_pace?: string;
    tone?: string;
    uses_metaphors?: boolean;
    uses_humor?: string;
    cultural_references?: string;
    validation_focused?: boolean;
  };
  cultural_stories: Record<string, any>;
  therapy_philosophy: string;
  personal_interests: string[];
  professional_background: {
    education?: string[];
    specializations?: string[];
    years_practicing?: number;
    certifications?: string[];
  };
  emotional_intelligence_profile: Record<string, any>;
  crisis_response_style: Record<string, any>;
  session_style_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TherapistClientRelationship {
  id: string;
  user_id: string;
  therapist_id: string;
  relationship_stage: 'initial' | 'building' | 'established' | 'deepening' | 'maintenance';
  rapport_level: number; // 0.0 to 1.0
  communication_preferences: {
    preferred_pace?: string;
    response_style?: string;
    feedback_frequency?: string;
    session_structure?: string;
  };
  shared_memories: Array<{
    session_id?: string;
    memory_type: string;
    content: string;
    emotional_significance: number;
    date: string;
  }>;
  therapeutic_progress: {
    key_breakthroughs?: string[];
    current_focus_areas?: string[];
    client_growth_observations?: string[];
    therapeutic_alliance_strength?: number;
  };
  last_interaction: string;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface TherapistNoteStyle {
  id: string;
  therapist_id: string;
  note_taking_style: 'structured' | 'narrative' | 'holistic_narrative' | 'strength_based_structured';
  documentation_format: {
    structure?: string;
    includes_body_awareness?: boolean;
    includes_social_context?: boolean;
    cultural_context_noted?: boolean;
    action_oriented?: boolean;
  };
  focus_areas: string[];
  observation_style: string;
  progress_tracking_method: string;
  homework_assignment_style: Record<string, any>;
  created_at: string;
}

export interface TherapistExpression {
  id: string;
  therapist_id: string;
  context_type: 'session_start' | 'session_end' | 'crisis' | 'breakthrough' | 'struggle' | 'celebration' | 'transition';
  emotional_context: string;
  expression_data: {
    phrases?: string[];
    tone_adjustments?: Record<string, any>;
    body_language?: Record<string, any>;
    voice_modulation?: Record<string, any>;
    therapeutic_approach?: string;
  };
  usage_frequency: number;
  effectiveness_score: number;
  created_at: string;
}

export interface PersonalizedResponse {
  content: string;
  tone: string;
  therapeutic_technique: string;
  cultural_adaptation?: Record<string, any>;
  relationship_context?: Record<string, any>;
}

export interface SessionNote {
  id: string;
  session_id: string;
  therapist_id: string;
  user_id: string;
  note_content: {
    observations: string[];
    key_moments: string[];
    therapeutic_interventions: string[];
    client_responses: string[];
    homework_assigned?: string[];
    next_session_focus?: string[];
  };
  therapist_reflections: string;
  progress_assessment: {
    session_effectiveness: number;
    client_engagement: number;
    therapeutic_alliance: number;
    goal_progress: Record<string, number>;
  };
  documentation_style: string;
  created_at: string;
}