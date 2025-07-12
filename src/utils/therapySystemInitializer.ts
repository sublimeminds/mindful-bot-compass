import { supabase } from '@/integrations/supabase/client';

interface ComponentRegistryEntry {
  id: string;
  name: string;
  version: string;
  category: string;
  status: 'active' | 'inactive' | 'deprecated';
  features: string[];
  dependencies: string[];
  criticality: 'low' | 'medium' | 'high' | 'critical';
  last_updated: string;
  changelog: string;
}

interface AdaptiveTherapyPlan {
  user_id: string;
  primary_approach: string;
  secondary_approach?: string;
  goals: string[];
  techniques: string[];
  effectiveness_score: number;
  adaptations: any;
  next_session_recommendations: any;
}

class TherapySystemInitializer {
  private static instance: TherapySystemInitializer;
  private initialized = false;

  static getInstance(): TherapySystemInitializer {
    if (!TherapySystemInitializer.instance) {
      TherapySystemInitializer.instance = new TherapySystemInitializer();
    }
    return TherapySystemInitializer.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('Initializing therapy system...');
      
      await Promise.all([
        this.initializeComponentRegistry(),
        this.seedAdaptiveTherapyPlans(),
        this.initializeSystemConfigurations(),
        this.setupHealthMonitoring()
      ]);

      this.initialized = true;
      console.log('Therapy system initialization complete');
    } catch (error) {
      console.error('Error initializing therapy system:', error);
      throw error;
    }
  }

  private async initializeComponentRegistry(): Promise<void> {
    console.log('Initializing component registry...');
    
    const components: ComponentRegistryEntry[] = [
      {
        id: 'structured-session-interface',
        name: 'Structured Session Interface',
        version: '1.0.0',
        category: 'core_interface',
        status: 'active',
        features: ['5_phase_therapy', 'real_time_monitoring', 'emotion_detection', 'voice_integration'],
        dependencies: ['ai-therapy-chat-enhanced', 'session-preparation-ai'],
        criticality: 'critical',
        last_updated: new Date().toISOString(),
        changelog: 'Initial implementation with full structured therapy support'
      },
      {
        id: 'ai-therapy-chat-enhanced',
        name: 'Enhanced AI Therapy Chat',
        version: '2.1.0',
        category: 'ai_core',
        status: 'active',
        features: ['context_aware_responses', 'therapeutic_techniques', 'crisis_detection', 'adaptive_learning'],
        dependencies: ['openai-api', 'session-technique-tracking'],
        criticality: 'critical',
        last_updated: new Date().toISOString(),
        changelog: 'Enhanced with playbook integration and structured session support'
      },
      {
        id: 'session-preparation-ai',
        name: 'Session Preparation AI',
        version: '1.0.0',
        category: 'preparation',
        status: 'active',
        features: ['personalized_preparation', 'risk_assessment', 'approach_optimization'],
        dependencies: ['ai-therapy-analysis', 'user-cultural-profiles'],
        criticality: 'high',
        last_updated: new Date().toISOString(),
        changelog: 'AI-powered session preparation with personalization'
      },
      {
        id: 'generate-session-analysis',
        name: 'Session Analysis Generator',
        version: '1.0.0',
        category: 'analytics',
        status: 'active',
        features: ['emotion_analysis', 'technique_effectiveness', 'breakthrough_detection', 'crisis_indicators'],
        dependencies: ['openai-api', 'session-technique-tracking'],
        criticality: 'high',
        last_updated: new Date().toISOString(),
        changelog: 'Comprehensive session analysis with AI insights'
      },
      {
        id: 'adaptive-therapy-planner',
        name: 'Adaptive Therapy Planner',
        version: '1.0.0',
        category: 'personalization',
        status: 'active',
        features: ['plan_adaptation', 'progress_tracking', 'approach_optimization', 'outcome_prediction'],
        dependencies: ['ai-therapy-analysis', 'session-analysis'],
        criticality: 'high',
        last_updated: new Date().toISOString(),
        changelog: 'Dynamic therapy plan adaptation based on user progress'
      },
      {
        id: 'emotion-detection-system',
        name: 'Emotion Detection System',
        version: '1.0.0',
        category: 'biometric',
        status: 'active',
        features: ['camera_emotion_detection', 'voice_emotion_analysis', 'real_time_monitoring'],
        dependencies: ['hume-ai-api', 'camera-permissions'],
        criticality: 'medium',
        last_updated: new Date().toISOString(),
        changelog: 'Multi-modal emotion detection for enhanced therapy sessions'
      }
    ];

    // Insert components into registry
    for (const component of components) {
      await supabase.from('component_registry').upsert(component);
    }
  }

  private async seedAdaptiveTherapyPlans(): Promise<void> {
    console.log('Seeding adaptive therapy plans...');
    
    // Get users who don't have therapy plans yet
    const { data: usersWithoutPlans } = await supabase
      .from('profiles')
      .select('id')
      .not('id', 'in', 
        await supabase.from('adaptive_therapy_plans').select('user_id').then(result => 
          result.data?.map(p => p.user_id) || []
        )
      );

    if (!usersWithoutPlans || usersWithoutPlans.length === 0) {
      console.log('All users already have therapy plans');
      return;
    }

    const defaultPlans: Omit<AdaptiveTherapyPlan, 'user_id'>[] = [
      {
        primary_approach: 'Cognitive Behavioral Therapy',
        secondary_approach: 'Mindfulness-Based Therapy',
        goals: ['Improve emotional regulation', 'Develop coping strategies', 'Enhance self-awareness'],
        techniques: ['cognitive_restructuring', 'behavioral_activation', 'mindfulness_meditation', 'thought_record'],
        effectiveness_score: 0.75,
        adaptations: {
          communication_style: 'supportive',
          session_pace: 'moderate',
          technique_preference: 'structured',
          feedback_frequency: 'regular'
        },
        next_session_recommendations: {
          focus_areas: ['stress_management', 'cognitive_patterns'],
          techniques_to_explore: ['grounding_exercises', 'progressive_muscle_relaxation'],
          homework_suggestions: ['daily_mood_tracking', 'thought_challenging_exercises']
        }
      },
      {
        primary_approach: 'Humanistic Therapy',
        secondary_approach: 'Solution-Focused Therapy',
        goals: ['Build self-confidence', 'Improve relationships', 'Clarify personal values'],
        techniques: ['active_listening', 'reflective_questioning', 'goal_setting', 'strength_identification'],
        effectiveness_score: 0.70,
        adaptations: {
          communication_style: 'empathetic',
          session_pace: 'flexible',
          technique_preference: 'exploratory',
          feedback_frequency: 'as_needed'
        },
        next_session_recommendations: {
          focus_areas: ['personal_growth', 'relationship_dynamics'],
          techniques_to_explore: ['values_clarification', 'strengths_assessment'],
          homework_suggestions: ['journaling', 'relationship_mapping']
        }
      }
    ];

    // Create plans for users
    for (const user of usersWithoutPlans) {
      const randomPlan = defaultPlans[Math.floor(Math.random() * defaultPlans.length)];
      
      await supabase.from('adaptive_therapy_plans').insert({
        user_id: user.id,
        ...randomPlan
      });
    }

    console.log(`Created therapy plans for ${usersWithoutPlans.length} users`);
  }

  private async initializeSystemConfigurations(): Promise<void> {
    console.log('Initializing system configurations...');
    
    const configurations = [
      {
        communication_style: 'professional',
        adaptation_level: 'high',
        cultural_context: 'general',
        preferred_techniques: ['cognitive_restructuring', 'mindfulness', 'behavioral_activation'],
        emotional_sensitivity: 0.8,
        is_global: true
      },
      {
        communication_style: 'warm',
        adaptation_level: 'medium',
        cultural_context: 'general',
        preferred_techniques: ['active_listening', 'validation', 'solution_focused'],
        emotional_sensitivity: 0.7,
        is_global: true
      }
    ];

    for (const config of configurations) {
      await supabase.from('personalization_configs').upsert(config);
    }
  }

  private async setupHealthMonitoring(): Promise<void> {
    console.log('Setting up health monitoring...');
    
    // Initialize baseline health metrics
    const baselineMetrics = [
      {
        metric_type: 'system_initialization',
        metric_value: 1.0,
        metric_metadata: {
          timestamp: new Date().toISOString(),
          components_initialized: 6,
          therapy_plans_created: true,
          health_monitoring_active: true
        }
      },
      {
        metric_type: 'component_health',
        metric_value: 0.95,
        metric_metadata: {
          all_components_active: true,
          critical_components_status: 'healthy',
          last_health_check: new Date().toISOString()
        }
      }
    ];

    for (const metric of baselineMetrics) {
      await supabase.from('real_time_metrics').insert(metric);
    }
  }

  async createUserTherapyPlan(userId: string, preferences: any = {}): Promise<void> {
    const existingPlan = await supabase
      .from('adaptive_therapy_plans')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingPlan.data) {
      console.log('User already has a therapy plan');
      return;
    }

    // Determine best approach based on preferences or use default
    const approach = preferences.preferred_approach || 'Cognitive Behavioral Therapy';
    
    const plan: AdaptiveTherapyPlan = {
      user_id: userId,
      primary_approach: approach,
      secondary_approach: this.getComplementaryApproach(approach),
      goals: preferences.goals || ['Improve emotional well-being', 'Develop coping strategies'],
      techniques: this.getTechniquesForApproach(approach),
      effectiveness_score: 0.75,
      adaptations: {
        communication_style: preferences.communication_style || 'supportive',
        session_pace: preferences.session_pace || 'moderate',
        technique_preference: preferences.technique_preference || 'structured'
      },
      next_session_recommendations: {
        focus_areas: this.getFocusAreasForApproach(approach),
        techniques_to_explore: this.getExplorableTechniques(approach),
        homework_suggestions: this.getHomeworkSuggestions(approach)
      }
    };

    await supabase.from('adaptive_therapy_plans').insert(plan);
    console.log(`Created personalized therapy plan for user ${userId}`);
  }

  private getComplementaryApproach(primaryApproach: string): string {
    const complementaryMap: Record<string, string> = {
      'Cognitive Behavioral Therapy': 'Mindfulness-Based Therapy',
      'Humanistic Therapy': 'Solution-Focused Therapy',
      'Psychodynamic Therapy': 'Cognitive Behavioral Therapy',
      'Mindfulness-Based Therapy': 'Cognitive Behavioral Therapy'
    };
    
    return complementaryMap[primaryApproach] || 'Mindfulness-Based Therapy';
  }

  private getTechniquesForApproach(approach: string): string[] {
    const techniqueMap: Record<string, string[]> = {
      'Cognitive Behavioral Therapy': ['cognitive_restructuring', 'behavioral_activation', 'thought_record', 'exposure_therapy'],
      'Humanistic Therapy': ['active_listening', 'reflective_questioning', 'empathetic_responding', 'here_and_now_focus'],
      'Mindfulness-Based Therapy': ['mindfulness_meditation', 'body_scan', 'breathing_exercises', 'present_moment_awareness']
    };
    
    return techniqueMap[approach] || techniqueMap['Cognitive Behavioral Therapy'];
  }

  private getFocusAreasForApproach(approach: string): string[] {
    const focusMap: Record<string, string[]> = {
      'Cognitive Behavioral Therapy': ['thought_patterns', 'behavioral_changes', 'problem_solving'],
      'Humanistic Therapy': ['self_exploration', 'personal_growth', 'authentic_expression'],
      'Mindfulness-Based Therapy': ['present_moment_awareness', 'emotional_regulation', 'stress_reduction']
    };
    
    return focusMap[approach] || focusMap['Cognitive Behavioral Therapy'];
  }

  private getExplorableTechniques(approach: string): string[] {
    const explorationMap: Record<string, string[]> = {
      'Cognitive Behavioral Therapy': ['grounding_exercises', 'progressive_muscle_relaxation', 'reality_testing'],
      'Humanistic Therapy': ['values_clarification', 'strengths_assessment', 'goal_exploration'],
      'Mindfulness-Based Therapy': ['loving_kindness_meditation', 'mindful_movement', 'acceptance_practices']
    };
    
    return explorationMap[approach] || explorationMap['Cognitive Behavioral Therapy'];
  }

  private getHomeworkSuggestions(approach: string): string[] {
    const homeworkMap: Record<string, string[]> = {
      'Cognitive Behavioral Therapy': ['daily_mood_tracking', 'thought_challenging_exercises', 'behavioral_experiments'],
      'Humanistic Therapy': ['journaling', 'self_reflection_exercises', 'values_exploration'],
      'Mindfulness-Based Therapy': ['daily_meditation_practice', 'mindful_eating', 'body_awareness_exercises']
    };
    
    return homeworkMap[approach] || homeworkMap['Cognitive Behavioral Therapy'];
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const therapySystemInitializer = TherapySystemInitializer.getInstance();