export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string
          id: string
          title: string
          type: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon: string
          id?: string
          title: string
          type: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string
          id?: string
          title?: string
          type?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_activity_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          can_delete: boolean | null
          can_read: boolean | null
          can_write: boolean | null
          created_at: string
          id: string
          permission_name: string
          resource_type: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string
          id?: string
          permission_name: string
          resource_type: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string
          id?: string
          permission_name?: string
          resource_type?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      ai_ab_tests: {
        Row: {
          created_at: string
          description: string
          ended_at: string | null
          id: string
          model_a_id: string | null
          model_b_id: string | null
          name: string
          results: Json
          status: string
          target_metric: string
          user_segment: string
        }
        Insert: {
          created_at?: string
          description: string
          ended_at?: string | null
          id?: string
          model_a_id?: string | null
          model_b_id?: string | null
          name: string
          results?: Json
          status?: string
          target_metric: string
          user_segment: string
        }
        Update: {
          created_at?: string
          description?: string
          ended_at?: string | null
          id?: string
          model_a_id?: string | null
          model_b_id?: string | null
          name?: string
          results?: Json
          status?: string
          target_metric?: string
          user_segment?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_ab_tests_model_a_id_fkey"
            columns: ["model_a_id"]
            isOneToOne: false
            referencedRelation: "ai_model_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_tests_model_b_id_fkey"
            columns: ["model_b_id"]
            isOneToOne: false
            referencedRelation: "ai_model_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_configs: {
        Row: {
          capabilities: string[]
          cost_per_token: number
          created_at: string
          id: string
          is_active: boolean
          max_tokens: number
          model: string
          name: string
          provider: string
          system_prompt: string
          temperature: number
          updated_at: string
        }
        Insert: {
          capabilities?: string[]
          cost_per_token?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number
          model: string
          name: string
          provider: string
          system_prompt: string
          temperature?: number
          updated_at?: string
        }
        Update: {
          capabilities?: string[]
          cost_per_token?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number
          model?: string
          name?: string
          provider?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_performance_stats: {
        Row: {
          cost: number
          created_at: string
          id: string
          model_id: string | null
          response_time: number
          token_usage: number
          user_rating: number | null
        }
        Insert: {
          cost: number
          created_at?: string
          id?: string
          model_id?: string | null
          response_time: number
          token_usage: number
          user_rating?: number | null
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          model_id?: string | null
          response_time?: number
          token_usage?: number
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_performance_stats_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_quality_metrics: {
        Row: {
          flagged_content: boolean
          id: string
          response_quality: number
          review_required: boolean
          safety_score: number
          session_id: string
          therapeutic_value: number
          timestamp: string
          user_satisfaction: number
        }
        Insert: {
          flagged_content?: boolean
          id?: string
          response_quality: number
          review_required?: boolean
          safety_score: number
          session_id: string
          therapeutic_value: number
          timestamp?: string
          user_satisfaction?: number
        }
        Update: {
          flagged_content?: boolean
          id?: string
          response_quality?: number
          review_required?: boolean
          safety_score?: number
          session_id?: string
          therapeutic_value?: number
          timestamp?: string
          user_satisfaction?: number
        }
        Relationships: []
      }
      ai_therapy_analysis: {
        Row: {
          analysis_version: string
          communication_adaptations: Json | null
          computed_risk_level: string | null
          confidence_score: number | null
          created_at: string
          estimated_therapy_duration: number | null
          id: string
          intervention_priorities: string[] | null
          personality_profile: Json | null
          predicted_outcomes: Json | null
          protective_factors: string[] | null
          risk_factors: string[] | null
          therapist_match_scores: Json | null
          treatment_recommendations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_version?: string
          communication_adaptations?: Json | null
          computed_risk_level?: string | null
          confidence_score?: number | null
          created_at?: string
          estimated_therapy_duration?: number | null
          id?: string
          intervention_priorities?: string[] | null
          personality_profile?: Json | null
          predicted_outcomes?: Json | null
          protective_factors?: string[] | null
          risk_factors?: string[] | null
          therapist_match_scores?: Json | null
          treatment_recommendations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_version?: string
          communication_adaptations?: Json | null
          computed_risk_level?: string | null
          confidence_score?: number | null
          created_at?: string
          estimated_therapy_duration?: number | null
          id?: string
          intervention_priorities?: string[] | null
          personality_profile?: Json | null
          predicted_outcomes?: Json | null
          protective_factors?: string[] | null
          risk_factors?: string[] | null
          therapist_match_scores?: Json | null
          treatment_recommendations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_history: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          status: string
          stripe_invoice_id?: string | null
          subscription_id: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_memory: {
        Row: {
          content: string
          created_at: string
          emotional_context: Json | null
          id: string
          importance_score: number
          is_active: boolean
          memory_type: string
          session_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          emotional_context?: Json | null
          id?: string
          importance_score?: number
          is_active?: boolean
          memory_type: string
          session_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          emotional_context?: Json | null
          id?: string
          importance_score?: number
          is_active?: boolean
          memory_type?: string
          session_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotional_patterns: {
        Row: {
          effectiveness_score: number
          first_identified: string
          frequency_score: number
          id: string
          last_occurred: string | null
          pattern_data: Json
          pattern_type: string
          user_id: string
        }
        Insert: {
          effectiveness_score?: number
          first_identified?: string
          frequency_score?: number
          id?: string
          last_occurred?: string | null
          pattern_data?: Json
          pattern_type: string
          user_id: string
        }
        Update: {
          effectiveness_score?: number
          first_identified?: string
          frequency_score?: number
          id?: string
          last_occurred?: string | null
          pattern_data?: Json
          pattern_type?: string
          user_id?: string
        }
        Relationships: []
      }
      emotional_states: {
        Row: {
          arousal: number
          confidence: number
          id: string
          intensity: number
          primary_emotion: string
          secondary_emotion: string | null
          timestamp: string
          user_id: string
          valence: number
        }
        Insert: {
          arousal?: number
          confidence?: number
          id?: string
          intensity?: number
          primary_emotion: string
          secondary_emotion?: string | null
          timestamp?: string
          user_id: string
          valence?: number
        }
        Update: {
          arousal?: number
          confidence?: number
          id?: string
          intensity?: number
          primary_emotion?: string
          secondary_emotion?: string | null
          timestamp?: string
          user_id?: string
          valence?: number
        }
        Relationships: []
      }
      enhanced_therapy_preferences: {
        Row: {
          communication_style: string | null
          created_at: string
          cultural_competency_needs: string[] | null
          experience_level_preference: string | null
          feedback_preference: string | null
          group_therapy_interest: boolean | null
          homework_comfort_level: number | null
          id: string
          learning_style: string | null
          preferred_days: string[] | null
          preferred_time_of_day: string | null
          session_duration: number | null
          session_frequency: string | null
          specialty_requirements: string[] | null
          therapist_gender_preference: string | null
          therapy_modalities: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          cultural_competency_needs?: string[] | null
          experience_level_preference?: string | null
          feedback_preference?: string | null
          group_therapy_interest?: boolean | null
          homework_comfort_level?: number | null
          id?: string
          learning_style?: string | null
          preferred_days?: string[] | null
          preferred_time_of_day?: string | null
          session_duration?: number | null
          session_frequency?: string | null
          specialty_requirements?: string[] | null
          therapist_gender_preference?: string | null
          therapy_modalities?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          cultural_competency_needs?: string[] | null
          experience_level_preference?: string | null
          feedback_preference?: string | null
          group_therapy_interest?: boolean | null
          homework_comfort_level?: number | null
          id?: string
          learning_style?: string | null
          preferred_days?: string[] | null
          preferred_time_of_day?: string | null
          session_duration?: number | null
          session_frequency?: string | null
          specialty_requirements?: string[] | null
          therapist_gender_preference?: string | null
          therapy_modalities?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string
          created_at: string
          helpful_count: number
          id: string
          is_active: boolean
          priority: number
          question: string
          tags: string[] | null
          updated_at: string
          view_count: number
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_active?: boolean
          priority?: number
          question: string
          tags?: string[] | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_active?: boolean
          priority?: number
          question?: string
          tags?: string[] | null
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          goal_id: string
          id: string
          is_completed: boolean
          reward: string | null
          target_value: number
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          is_completed?: boolean
          reward?: string | null
          target_value: number
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          is_completed?: boolean
          reward?: string | null
          target_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress: {
        Row: {
          goal_id: string
          id: string
          note: string | null
          recorded_at: string
          value: number
        }
        Insert: {
          goal_id: string
          id?: string
          note?: string | null
          recorded_at?: string
          value: number
        }
        Update: {
          goal_id?: string
          id?: string
          note?: string | null
          recorded_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string
          current_progress: number
          description: string | null
          id: string
          is_completed: boolean
          notes: string | null
          priority: string
          start_date: string
          tags: string[] | null
          target_date: string
          target_value: number
          title: string
          type: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          current_progress?: number
          description?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          priority?: string
          start_date?: string
          tags?: string[] | null
          target_date: string
          target_value?: number
          title: string
          type: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_progress?: number
          description?: string | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          priority?: string
          start_date?: string
          tags?: string[] | null
          target_date?: string
          target_value?: number
          title?: string
          type?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          helpful_count: number
          id: string
          is_active: boolean
          is_featured: boolean
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      mental_health_assessments: {
        Row: {
          assessment_type: string
          completed_at: string
          created_at: string
          id: string
          interpretation: string | null
          recommendations: string[] | null
          responses: Json
          severity_level: string | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          recommendations?: string[] | null
          responses?: Json
          severity_level?: string | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          recommendations?: string[] | null
          responses?: Json
          severity_level?: string | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          activities: string[] | null
          anxiety: number
          created_at: string
          depression: number
          energy: number
          id: string
          notes: string | null
          overall: number
          sleep_quality: number | null
          social_connection: number | null
          stress: number
          timestamp: string
          triggers: string[] | null
          user_id: string
          weather: string | null
        }
        Insert: {
          activities?: string[] | null
          anxiety: number
          created_at?: string
          depression: number
          energy: number
          id?: string
          notes?: string | null
          overall: number
          sleep_quality?: number | null
          social_connection?: number | null
          stress: number
          timestamp?: string
          triggers?: string[] | null
          user_id: string
          weather?: string | null
        }
        Update: {
          activities?: string[] | null
          anxiety?: number
          created_at?: string
          depression?: number
          energy?: number
          id?: string
          notes?: string | null
          overall?: number
          sleep_quality?: number | null
          social_connection?: number | null
          stress?: number
          timestamp?: string
          triggers?: string[] | null
          user_id?: string
          weather?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          daily_summaries: boolean | null
          email_notifications: boolean | null
          id: string
          insight_notifications: boolean | null
          milestone_notifications: boolean | null
          notification_frequency: string | null
          progress_updates: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          session_reminders: boolean | null
          streak_reminders: boolean | null
          updated_at: string | null
          user_id: string
          weekly_reports: boolean | null
        }
        Insert: {
          created_at?: string | null
          daily_summaries?: boolean | null
          email_notifications?: boolean | null
          id?: string
          insight_notifications?: boolean | null
          milestone_notifications?: boolean | null
          notification_frequency?: string | null
          progress_updates?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          session_reminders?: boolean | null
          streak_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_reports?: boolean | null
        }
        Update: {
          created_at?: string | null
          daily_summaries?: boolean | null
          email_notifications?: boolean | null
          id?: string
          insight_notifications?: boolean | null
          milestone_notifications?: boolean | null
          notification_frequency?: string | null
          progress_updates?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          session_reminders?: boolean | null
          streak_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_reports?: boolean | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message: string
          name: string
          priority: string
          title: string
          type: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message: string
          name: string
          priority?: string
          title: string
          type: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          name?: string
          priority?: string
          title?: string
          type?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          priority: string
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          priority?: string
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      personalization_configs: {
        Row: {
          adaptation_level: string
          communication_style: string
          created_at: string
          cultural_context: string
          emotional_sensitivity: number
          id: string
          is_global: boolean
          preferred_techniques: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          adaptation_level: string
          communication_style: string
          created_at?: string
          cultural_context?: string
          emotional_sensitivity?: number
          id?: string
          is_global?: boolean
          preferred_techniques?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          adaptation_level?: string
          communication_style?: string
          created_at?: string
          cultural_context?: string
          emotional_sensitivity?: number
          id?: string
          is_global?: boolean
          preferred_techniques?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      personalization_profiles: {
        Row: {
          adaptive_rules: Json | null
          avoidance_triggers: string[] | null
          communication_style: string | null
          created_at: string
          id: string
          learning_style: string | null
          motivation_factors: string[] | null
          progress_patterns: Json | null
          therapy_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adaptive_rules?: Json | null
          avoidance_triggers?: string[] | null
          communication_style?: string | null
          created_at?: string
          id?: string
          learning_style?: string | null
          motivation_factors?: string[] | null
          progress_patterns?: Json | null
          therapy_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adaptive_rules?: Json | null
          avoidance_triggers?: string[] | null
          communication_style?: string | null
          created_at?: string
          id?: string
          learning_style?: string | null
          motivation_factors?: string[] | null
          progress_patterns?: Json | null
          therapy_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      personalized_recommendations: {
        Row: {
          acted_upon_at: string | null
          created_at: string
          description: string
          estimated_impact: number
          id: string
          is_active: boolean
          priority_score: number
          reasoning: string
          recommendation_type: string
          shown_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          acted_upon_at?: string | null
          created_at?: string
          description: string
          estimated_impact: number
          id?: string
          is_active?: boolean
          priority_score: number
          reasoning: string
          recommendation_type: string
          shown_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          acted_upon_at?: string | null
          created_at?: string
          description?: string
          estimated_impact?: number
          id?: string
          is_active?: boolean
          priority_score?: number
          reasoning?: string
          recommendation_type?: string
          shown_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          onboarding_complete: boolean | null
          plan: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          onboarding_complete?: boolean | null
          plan?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_complete?: boolean | null
          plan?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          alcohol_use_frequency: string | null
          assessed_at: string
          created_at: string
          drug_use_frequency: string | null
          id: string
          intervention_notes: string | null
          previous_attempts: boolean | null
          requires_immediate_intervention: boolean | null
          risk_level: string
          safety_plan: Json | null
          self_harm_frequency: string | null
          self_harm_history: boolean | null
          substance_abuse_concern: boolean | null
          suicidal_ideation_level: number | null
          suicide_plan: boolean | null
          user_id: string
        }
        Insert: {
          alcohol_use_frequency?: string | null
          assessed_at?: string
          created_at?: string
          drug_use_frequency?: string | null
          id?: string
          intervention_notes?: string | null
          previous_attempts?: boolean | null
          requires_immediate_intervention?: boolean | null
          risk_level?: string
          safety_plan?: Json | null
          self_harm_frequency?: string | null
          self_harm_history?: boolean | null
          substance_abuse_concern?: boolean | null
          suicidal_ideation_level?: number | null
          suicide_plan?: boolean | null
          user_id: string
        }
        Update: {
          alcohol_use_frequency?: string | null
          assessed_at?: string
          created_at?: string
          drug_use_frequency?: string | null
          id?: string
          intervention_notes?: string | null
          previous_attempts?: boolean | null
          requires_immediate_intervention?: boolean | null
          risk_level?: string
          safety_plan?: Json | null
          self_harm_frequency?: string | null
          self_harm_history?: boolean | null
          substance_abuse_concern?: boolean | null
          suicidal_ideation_level?: number | null
          suicide_plan?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      scheduled_notifications: {
        Row: {
          created_at: string
          id: string
          scheduled_for: string
          status: string
          template_id: string | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          scheduled_for: string
          status?: string
          template_id?: string | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          scheduled_for?: string
          status?: string
          template_id?: string | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      session_analytics: {
        Row: {
          created_at: string
          effectiveness_score: number
          id: string
          key_breakthrough: string | null
          mood_improvement: number | null
          session_id: string
          session_rating: number | null
          techniques_effectiveness: Json | null
        }
        Insert: {
          created_at?: string
          effectiveness_score: number
          id?: string
          key_breakthrough?: string | null
          mood_improvement?: number | null
          session_id: string
          session_rating?: number | null
          techniques_effectiveness?: Json | null
        }
        Update: {
          created_at?: string
          effectiveness_score?: number
          id?: string
          key_breakthrough?: string | null
          mood_improvement?: number | null
          session_id?: string
          session_rating?: number | null
          techniques_effectiveness?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "session_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_context: {
        Row: {
          addressed: boolean
          context_data: Json
          context_type: string
          created_at: string
          id: string
          priority_level: number
          requires_attention: boolean
          session_id: string | null
          user_id: string
        }
        Insert: {
          addressed?: boolean
          context_data?: Json
          context_type: string
          created_at?: string
          id?: string
          priority_level?: number
          requires_attention?: boolean
          session_id?: string | null
          user_id: string
        }
        Update: {
          addressed?: boolean
          context_data?: Json
          context_type?: string
          created_at?: string
          id?: string
          priority_level?: number
          requires_attention?: boolean
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_insights: {
        Row: {
          actionable_suggestion: string | null
          confidence_score: number | null
          created_at: string
          description: string
          id: string
          insight_type: string
          priority: string
          session_id: string
          title: string
        }
        Insert: {
          actionable_suggestion?: string | null
          confidence_score?: number | null
          created_at?: string
          description: string
          id?: string
          insight_type: string
          priority?: string
          session_id: string
          title: string
        }
        Update: {
          actionable_suggestion?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          priority?: string
          session_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_insights_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_messages: {
        Row: {
          content: string
          emotion: string | null
          id: string
          sender: string
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          emotion?: string | null
          id?: string
          sender: string
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          emotion?: string | null
          id?: string
          sender?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          is_active: boolean
          limits: Json
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          limits?: Json
          name: string
          price_monthly: number
          price_yearly: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          limits?: Json
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          admin_name: string | null
          created_at: string
          id: string
          message: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          admin_name?: string | null
          created_at?: string
          id?: string
          message: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          admin_name?: string | null
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapeutic_approach_configs: {
        Row: {
          created_at: string
          description: string
          effectiveness_score: number
          id: string
          is_active: boolean
          name: string
          system_prompt_addition: string
          target_conditions: string[]
          techniques: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          effectiveness_score?: number
          id?: string
          is_active?: boolean
          name: string
          system_prompt_addition?: string
          target_conditions?: string[]
          techniques?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          effectiveness_score?: number
          id?: string
          is_active?: boolean
          name?: string
          system_prompt_addition?: string
          target_conditions?: string[]
          techniques?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      therapeutic_relationship: {
        Row: {
          boundary_preferences: Json | null
          communication_preferences: Json | null
          created_at: string
          effective_techniques: string[] | null
          id: string
          ineffective_techniques: string[] | null
          last_interaction: string | null
          rapport_score: number
          relationship_milestones: Json[] | null
          therapist_id: string | null
          trust_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          boundary_preferences?: Json | null
          communication_preferences?: Json | null
          created_at?: string
          effective_techniques?: string[] | null
          id?: string
          ineffective_techniques?: string[] | null
          last_interaction?: string | null
          rapport_score?: number
          relationship_milestones?: Json[] | null
          therapist_id?: string | null
          trust_level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          boundary_preferences?: Json | null
          communication_preferences?: Json | null
          created_at?: string
          effective_techniques?: string[] | null
          id?: string
          ineffective_techniques?: string[] | null
          last_interaction?: string | null
          rapport_score?: number
          relationship_milestones?: Json[] | null
          therapist_id?: string | null
          trust_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapist_assessments: {
        Row: {
          assessment_version: number
          completed_at: string
          id: string
          recommended_therapists: Json
          responses: Json
          selected_therapist_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_version?: number
          completed_at?: string
          id?: string
          recommended_therapists?: Json
          responses?: Json
          selected_therapist_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_version?: number
          completed_at?: string
          id?: string
          recommended_therapists?: Json
          responses?: Json
          selected_therapist_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_assessments_selected_therapist_id_fkey"
            columns: ["selected_therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_compatibility: {
        Row: {
          average_rating: number | null
          compatibility_score: number
          created_at: string
          effectiveness_metrics: Json | null
          id: string
          last_interaction: string | null
          session_count: number
          therapist_id: string
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          compatibility_score: number
          created_at?: string
          effectiveness_metrics?: Json | null
          id?: string
          last_interaction?: string | null
          session_count?: number
          therapist_id: string
          user_id: string
        }
        Update: {
          average_rating?: number | null
          compatibility_score?: number
          created_at?: string
          effectiveness_metrics?: Json | null
          id?: string
          last_interaction?: string | null
          session_count?: number
          therapist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_compatibility_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_personalities: {
        Row: {
          approach: string
          color_scheme: string
          communication_style: string
          created_at: string
          description: string
          effectiveness_areas: Json | null
          experience_level: string
          icon: string
          id: string
          is_active: boolean
          name: string
          personality_traits: Json | null
          specialties: string[]
          title: string
        }
        Insert: {
          approach: string
          color_scheme?: string
          communication_style: string
          created_at?: string
          description: string
          effectiveness_areas?: Json | null
          experience_level?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          personality_traits?: Json | null
          specialties?: string[]
          title: string
        }
        Update: {
          approach?: string
          color_scheme?: string
          communication_style?: string
          created_at?: string
          description?: string
          effectiveness_areas?: Json | null
          experience_level?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          personality_traits?: Json | null
          specialties?: string[]
          title?: string
        }
        Relationships: []
      }
      therapy_effectiveness_stats: {
        Row: {
          created_at: string
          goal_progress: number | null
          id: string
          measurement_date: string
          mood_improvement: number | null
          session_completion_rate: number | null
          technique_effectiveness: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          goal_progress?: number | null
          id?: string
          measurement_date: string
          mood_improvement?: number | null
          session_completion_rate?: number | null
          technique_effectiveness?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          goal_progress?: number | null
          id?: string
          measurement_date?: string
          mood_improvement?: number | null
          session_completion_rate?: number | null
          technique_effectiveness?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      therapy_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          start_time: string
          techniques: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          start_time?: string
          techniques?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          start_time?: string
          techniques?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      trauma_history: {
        Row: {
          ace_responses: Json | null
          ace_score: number | null
          adult_trauma: boolean | null
          childhood_trauma: boolean | null
          coping_mechanisms: string[] | null
          created_at: string
          id: string
          ptsd_severity: string | null
          ptsd_symptoms: Json | null
          trauma_details: string | null
          trauma_types: string[] | null
          triggers: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ace_responses?: Json | null
          ace_score?: number | null
          adult_trauma?: boolean | null
          childhood_trauma?: boolean | null
          coping_mechanisms?: string[] | null
          created_at?: string
          id?: string
          ptsd_severity?: string | null
          ptsd_symptoms?: Json | null
          trauma_details?: string | null
          trauma_types?: string[] | null
          triggers?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ace_responses?: Json | null
          ace_score?: number | null
          adult_trauma?: boolean | null
          childhood_trauma?: boolean | null
          coping_mechanisms?: string[] | null
          created_at?: string
          id?: string
          ptsd_severity?: string | null
          ptsd_symptoms?: Json | null
          trauma_details?: string | null
          trauma_types?: string[] | null
          triggers?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_intake_data: {
        Row: {
          age: number | null
          created_at: string
          crisis_contacts: Json | null
          cultural_background: string | null
          current_medications: string[] | null
          diet_quality: string | null
          employment_status: string | null
          exercise_frequency: string | null
          family_mental_health_history: string | null
          financial_stress_level: number | null
          gender: string | null
          hospitalization_history: boolean | null
          id: string
          living_situation: string | null
          location: string | null
          medical_conditions: string[] | null
          mental_health_diagnoses: string[] | null
          preferred_communication_style: string | null
          previous_therapy: boolean | null
          previous_therapy_details: string | null
          primary_concerns: string[] | null
          relationship_status: string | null
          session_frequency_preference: string | null
          sleep_hours_avg: number | null
          social_support_level: number | null
          therapy_goals: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          crisis_contacts?: Json | null
          cultural_background?: string | null
          current_medications?: string[] | null
          diet_quality?: string | null
          employment_status?: string | null
          exercise_frequency?: string | null
          family_mental_health_history?: string | null
          financial_stress_level?: number | null
          gender?: string | null
          hospitalization_history?: boolean | null
          id?: string
          living_situation?: string | null
          location?: string | null
          medical_conditions?: string[] | null
          mental_health_diagnoses?: string[] | null
          preferred_communication_style?: string | null
          previous_therapy?: boolean | null
          previous_therapy_details?: string | null
          primary_concerns?: string[] | null
          relationship_status?: string | null
          session_frequency_preference?: string | null
          sleep_hours_avg?: number | null
          social_support_level?: number | null
          therapy_goals?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          crisis_contacts?: Json | null
          cultural_background?: string | null
          current_medications?: string[] | null
          diet_quality?: string | null
          employment_status?: string | null
          exercise_frequency?: string | null
          family_mental_health_history?: string | null
          financial_stress_level?: number | null
          gender?: string | null
          hospitalization_history?: boolean | null
          id?: string
          living_situation?: string | null
          location?: string | null
          medical_conditions?: string[] | null
          mental_health_diagnoses?: string[] | null
          preferred_communication_style?: string | null
          previous_therapy?: boolean | null
          previous_therapy_details?: string | null
          primary_concerns?: string[] | null
          relationship_status?: string | null
          session_frequency_preference?: string | null
          sleep_hours_avg?: number | null
          social_support_level?: number | null
          therapy_goals?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          data: Json | null
          id: string
          interaction_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          data?: Json | null
          id?: string
          interaction_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          data?: Json | null
          id?: string
          interaction_type?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          concerns: string[] | null
          created_at: string
          experience: string | null
          goals: string[] | null
          id: string
          preferences: string[] | null
          user_id: string
        }
        Insert: {
          concerns?: string[] | null
          created_at?: string
          experience?: string | null
          goals?: string[] | null
          id?: string
          preferences?: string[] | null
          user_id: string
        }
        Update: {
          concerns?: string[] | null
          created_at?: string
          experience?: string | null
          goals?: string[] | null
          id?: string
          preferences?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          communication_style: string | null
          created_at: string
          emotional_patterns: Json | null
          id: string
          preferred_approaches: string[] | null
          session_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          emotional_patterns?: Json | null
          id?: string
          preferred_approaches?: string[] | null
          session_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          emotional_patterns?: Json | null
          id?: string
          preferred_approaches?: string[] | null
          session_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          id: string
          progress_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          progress_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          progress_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_method_id: string | null
          stripe_setup_intent_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_setup_intent_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_setup_intent_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          resource_type: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          resource_type: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          resource_type?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_perform_action: {
        Args: {
          user_id_param: string
          action_type: string
          current_usage?: number
        }
        Returns: boolean
      }
      get_user_plan_limits: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      handle_trial_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "content_admin"
        | "support_admin"
        | "analytics_admin"
        | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "content_admin",
        "support_admin",
        "analytics_admin",
        "user",
      ],
    },
  },
} as const
