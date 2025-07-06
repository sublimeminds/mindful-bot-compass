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
      analytics_events: {
        Row: {
          created_at: string
          event_category: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_category: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used_at: string | null
          name: string
          permissions: Json | null
          rate_limit: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          rate_limit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          rate_limit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ar_therapy_sessions: {
        Row: {
          biometric_data: Json | null
          created_at: string
          end_time: string | null
          environment_id: string
          id: string
          interactions: Json | null
          session_data: Json | null
          start_time: string
          therapeutic_goals: string[] | null
          user_id: string
        }
        Insert: {
          biometric_data?: Json | null
          created_at?: string
          end_time?: string | null
          environment_id: string
          id?: string
          interactions?: Json | null
          session_data?: Json | null
          start_time?: string
          therapeutic_goals?: string[] | null
          user_id: string
        }
        Update: {
          biometric_data?: Json | null
          created_at?: string
          end_time?: string | null
          environment_id?: string
          id?: string
          interactions?: Json | null
          session_data?: Json | null
          start_time?: string
          therapeutic_goals?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource: string
          resource_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource: string
          resource_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource?: string
          resource_id?: string | null
          user_agent?: string | null
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
          description: string | null
          id: string
          invoice_url: string | null
          paid_at: string | null
          payment_method: string | null
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
          description?: string | null
          id?: string
          invoice_url?: string | null
          paid_at?: string | null
          payment_method?: string | null
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
          description?: string | null
          id?: string
          invoice_url?: string | null
          paid_at?: string | null
          payment_method?: string | null
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
      blockchain_health_records: {
        Row: {
          block_height: number | null
          created_at: string
          encrypted_data: string
          id: string
          record_hash: string
          record_type: string
          transaction_id: string | null
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          block_height?: number | null
          created_at?: string
          encrypted_data: string
          id?: string
          record_hash: string
          record_type: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          block_height?: number | null
          created_at?: string
          encrypted_data?: string
          id?: string
          record_hash?: string
          record_type?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      clinical_assessments: {
        Row: {
          administered_at: string
          assessment_type: string
          created_at: string
          id: string
          interpretation: string | null
          questions: Json
          recommendations: Json | null
          responses: Json
          severity_level: string
          total_score: number
          user_id: string
        }
        Insert: {
          administered_at?: string
          assessment_type: string
          created_at?: string
          id?: string
          interpretation?: string | null
          questions?: Json
          recommendations?: Json | null
          responses?: Json
          severity_level?: string
          total_score?: number
          user_id: string
        }
        Update: {
          administered_at?: string
          assessment_type?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          questions?: Json
          recommendations?: Json | null
          responses?: Json
          severity_level?: string
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      conversation_memories: {
        Row: {
          conversation_flow: Json
          created_at: string
          emotional_context: Json
          id: string
          learnings: Json
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          conversation_flow?: Json
          created_at?: string
          emotional_context?: Json
          id?: string
          learnings?: Json
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          conversation_flow?: Json
          created_at?: string
          emotional_context?: Json
          id?: string
          learnings?: Json
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
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
      crisis_assessments: {
        Row: {
          assessment_type: string
          counselor_notes: string | null
          created_at: string
          emergency_services_contacted: boolean | null
          follow_up_date: string | null
          follow_up_scheduled: boolean | null
          id: string
          immediate_actions_taken: string[] | null
          professional_contact_made: boolean | null
          responses: Json
          risk_level: string
          severity_indicators: string[] | null
          status: string
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type?: string
          counselor_notes?: string | null
          created_at?: string
          emergency_services_contacted?: boolean | null
          follow_up_date?: string | null
          follow_up_scheduled?: boolean | null
          id?: string
          immediate_actions_taken?: string[] | null
          professional_contact_made?: boolean | null
          responses?: Json
          risk_level?: string
          severity_indicators?: string[] | null
          status?: string
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          counselor_notes?: string | null
          created_at?: string
          emergency_services_contacted?: boolean | null
          follow_up_date?: string | null
          follow_up_scheduled?: boolean | null
          id?: string
          immediate_actions_taken?: string[] | null
          professional_contact_made?: boolean | null
          responses?: Json
          risk_level?: string
          severity_indicators?: string[] | null
          status?: string
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crisis_interventions: {
        Row: {
          completed_at: string | null
          created_at: string
          crisis_assessment_id: string | null
          follow_up_required: boolean | null
          id: string
          intervention_data: Json
          intervention_type: string
          outcome: string | null
          response_time_minutes: number | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          crisis_assessment_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          intervention_data?: Json
          intervention_type: string
          outcome?: string | null
          response_time_minutes?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          crisis_assessment_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          intervention_data?: Json
          intervention_type?: string
          outcome?: string | null
          response_time_minutes?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crisis_interventions_crisis_assessment_id_fkey"
            columns: ["crisis_assessment_id"]
            isOneToOne: false
            referencedRelation: "crisis_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      crisis_resources: {
        Row: {
          availability: string | null
          created_at: string
          description: string | null
          geographic_coverage: string | null
          id: string
          is_active: boolean | null
          language_support: string[] | null
          name: string
          phone_number: string | null
          priority_order: number | null
          resource_type: string
          specialties: string[] | null
          target_demographics: string[] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          description?: string | null
          geographic_coverage?: string | null
          id?: string
          is_active?: boolean | null
          language_support?: string[] | null
          name: string
          phone_number?: string | null
          priority_order?: number | null
          resource_type: string
          specialties?: string[] | null
          target_demographics?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          description?: string | null
          geographic_coverage?: string | null
          id?: string
          is_active?: boolean | null
          language_support?: string[] | null
          name?: string
          phone_number?: string | null
          priority_order?: number | null
          resource_type?: string
          specialties?: string[] | null
          target_demographics?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      cultural_interactions: {
        Row: {
          cultural_context: Json
          id: string
          interaction_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          cultural_context?: Json
          id?: string
          interaction_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          cultural_context?: Json
          id?: string
          interaction_type?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_reports: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_generated: string | null
          report_config: Json
          report_name: string
          report_type: string
          schedule_frequency: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          report_config?: Json
          report_name: string
          report_type: string
          schedule_frequency?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          report_config?: Json
          report_name?: string
          report_type?: string
          schedule_frequency?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          discussion_id: string
          id: string
          is_anonymous: boolean
          like_count: number | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          is_anonymous?: boolean
          like_count?: number | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_anonymous?: boolean
          like_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "group_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          contact_type: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          name: string
          notes: string | null
          phone_number: string | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_type?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          name: string
          notes?: string | null
          phone_number?: string | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_type?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          phone_number?: string | null
          relationship?: string | null
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
      enterprise_configurations: {
        Row: {
          configuration_type: string
          created_at: string
          id: string
          integration_endpoints: Json | null
          is_active: boolean
          organization_id: string
          settings: Json | null
          updated_at: string
          white_label_config: Json | null
        }
        Insert: {
          configuration_type: string
          created_at?: string
          id?: string
          integration_endpoints?: Json | null
          is_active?: boolean
          organization_id: string
          settings?: Json | null
          updated_at?: string
          white_label_config?: Json | null
        }
        Update: {
          configuration_type?: string
          created_at?: string
          id?: string
          integration_endpoints?: Json | null
          is_active?: boolean
          organization_id?: string
          settings?: Json | null
          updated_at?: string
          white_label_config?: Json | null
        }
        Relationships: []
      }
      enterprise_integrations: {
        Row: {
          api_key: string | null
          configuration: Json | null
          created_at: string
          endpoint_url: string | null
          id: string
          integration_type: string
          last_sync: string | null
          name: string
          status: string
          sync_count: number
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          integration_type: string
          last_sync?: string | null
          name: string
          status?: string
          sync_count?: number
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          integration_type?: string
          last_sync?: string | null
          name?: string
          status?: string
          sync_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          base_currency: string
          id: string
          last_updated: string
          provider: string
          rate: number
          target_currency: string
        }
        Insert: {
          base_currency?: string
          id?: string
          last_updated?: string
          provider?: string
          rate: number
          target_currency: string
        }
        Update: {
          base_currency?: string
          id?: string
          last_updated?: string
          provider?: string
          rate?: number
          target_currency?: string
        }
        Relationships: []
      }
      family_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_data: Json | null
          alert_type: string
          created_at: string
          description: string
          household_id: string
          id: string
          is_acknowledged: boolean | null
          member_user_id: string
          severity: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_data?: Json | null
          alert_type: string
          created_at?: string
          description: string
          household_id: string
          id?: string
          is_acknowledged?: boolean | null
          member_user_id: string
          severity?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_data?: Json | null
          alert_type?: string
          created_at?: string
          description?: string
          household_id?: string
          id?: string
          is_acknowledged?: boolean | null
          member_user_id?: string
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_alerts_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      family_invitations: {
        Row: {
          age: number | null
          created_at: string
          expires_at: string
          household_id: string
          id: string
          invitation_token: string
          invited_by_id: string
          invited_email: string
          member_type: string
          permission_level: string
          relationship: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          expires_at: string
          household_id: string
          id?: string
          invitation_token: string
          invited_by_id: string
          invited_email: string
          member_type?: string
          permission_level?: string
          relationship?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          expires_at?: string
          household_id?: string
          id?: string
          invitation_token?: string
          invited_by_id?: string
          invited_email?: string
          member_type?: string
          permission_level?: string
          relationship?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_invitations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      family_permissions: {
        Row: {
          created_at: string
          granted: boolean | null
          granted_by: string
          household_id: string
          id: string
          member_id: string
          permission_type: string
          target_member_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          granted?: boolean | null
          granted_by: string
          household_id: string
          id?: string
          member_id: string
          permission_type: string
          target_member_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          granted?: boolean | null
          granted_by?: string
          household_id?: string
          id?: string
          member_id?: string
          permission_type?: string
          target_member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_permissions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_permissions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "household_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_permissions_target_member_id_fkey"
            columns: ["target_member_id"]
            isOneToOne: false
            referencedRelation: "household_members"
            referencedColumns: ["id"]
          },
        ]
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
      global_infrastructure_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
          region: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          region: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          region?: string
        }
        Relationships: []
      }
      goal_achievements: {
        Row: {
          achievement_type: string
          description: string
          goal_id: string | null
          icon: string
          id: string
          metadata: Json | null
          points_earned: number | null
          title: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          description: string
          goal_id?: string | null
          icon: string
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          title: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          description?: string
          goal_id?: string | null
          icon?: string
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          title?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_insights: {
        Row: {
          acted_upon_at: string | null
          action_items: string[] | null
          confidence_score: number | null
          created_at: string
          description: string
          expires_at: string | null
          goal_id: string | null
          id: string
          insight_type: string
          priority: number | null
          title: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          acted_upon_at?: string | null
          action_items?: string[] | null
          confidence_score?: number | null
          created_at?: string
          description: string
          expires_at?: string | null
          goal_id?: string | null
          id?: string
          insight_type: string
          priority?: number | null
          title: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          acted_upon_at?: string | null
          action_items?: string[] | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          expires_at?: string | null
          goal_id?: string | null
          id?: string
          insight_type?: string
          priority?: number | null
          title?: string
          user_id?: string
          viewed_at?: string | null
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
      goal_progress_history: {
        Row: {
          change_amount: number
          context_data: Json | null
          created_at: string
          goal_id: string
          id: string
          mood_rating: number | null
          new_value: number
          notes: string | null
          previous_value: number
          progress_type: string
        }
        Insert: {
          change_amount: number
          context_data?: Json | null
          created_at?: string
          goal_id: string
          id?: string
          mood_rating?: number | null
          new_value: number
          notes?: string | null
          previous_value: number
          progress_type?: string
        }
        Update: {
          change_amount?: number
          context_data?: Json | null
          created_at?: string
          goal_id?: string
          id?: string
          mood_rating?: number | null
          new_value?: number
          notes?: string | null
          previous_value?: number
          progress_type?: string
        }
        Relationships: []
      }
      goal_sharing: {
        Row: {
          accepted_at: string | null
          created_at: string
          goal_id: string
          id: string
          is_active: boolean | null
          permission_level: string
          shared_by: string
          shared_with: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          goal_id: string
          id?: string
          is_active?: boolean | null
          permission_level?: string
          shared_by: string
          shared_with: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          goal_id?: string
          id?: string
          is_active?: boolean | null
          permission_level?: string
          shared_by?: string
          shared_with?: string
        }
        Relationships: []
      }
      goal_templates: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty_level: string
          estimated_duration_days: number | null
          icon: string | null
          id: string
          is_featured: boolean | null
          name: string
          success_rate: number | null
          tags: string[] | null
          target_value: number
          unit: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty_level?: string
          estimated_duration_days?: number | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          success_rate?: number | null
          tags?: string[] | null
          target_value?: number
          unit?: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: string
          estimated_duration_days?: number | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          success_rate?: number | null
          tags?: string[] | null
          target_value?: number
          unit?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          best_streak: number | null
          category: string
          created_at: string
          current_progress: number
          description: string | null
          difficulty_level: string | null
          id: string
          is_completed: boolean
          last_progress_date: string | null
          motivation_level: number | null
          notes: string | null
          parent_goal_id: string | null
          priority: string
          start_date: string
          streak_count: number | null
          tags: string[] | null
          target_date: string
          target_value: number
          template_id: string | null
          title: string
          type: string
          unit: string
          updated_at: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          best_streak?: number | null
          category: string
          created_at?: string
          current_progress?: number
          description?: string | null
          difficulty_level?: string | null
          id?: string
          is_completed?: boolean
          last_progress_date?: string | null
          motivation_level?: number | null
          notes?: string | null
          parent_goal_id?: string | null
          priority?: string
          start_date?: string
          streak_count?: number | null
          tags?: string[] | null
          target_date: string
          target_value?: number
          template_id?: string | null
          title: string
          type: string
          unit?: string
          updated_at?: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          best_streak?: number | null
          category?: string
          created_at?: string
          current_progress?: number
          description?: string | null
          difficulty_level?: string | null
          id?: string
          is_completed?: boolean
          last_progress_date?: string | null
          motivation_level?: number | null
          notes?: string | null
          parent_goal_id?: string | null
          priority?: string
          start_date?: string
          streak_count?: number | null
          tags?: string[] | null
          target_date?: string
          target_value?: number
          template_id?: string | null
          title?: string
          type?: string
          unit?: string
          updated_at?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      group_discussions: {
        Row: {
          author_id: string
          content: string
          created_at: string
          group_id: string
          id: string
          is_anonymous: boolean
          is_pinned: boolean
          like_count: number | null
          reply_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          group_id: string
          id?: string
          is_anonymous?: boolean
          is_pinned?: boolean
          like_count?: number | null
          reply_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          is_anonymous?: boolean
          is_pinned?: boolean
          like_count?: number | null
          reply_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_discussions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          is_active: boolean
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_integrations: {
        Row: {
          created_at: string
          credentials_encrypted: string | null
          ehr_config: Json | null
          fhir_endpoint: string | null
          id: string
          integration_type: string
          last_sync: string | null
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials_encrypted?: string | null
          ehr_config?: Json | null
          fhir_endpoint?: string | null
          id?: string
          integration_type: string
          last_sync?: string | null
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials_encrypted?: string | null
          ehr_config?: Json | null
          fhir_endpoint?: string | null
          id?: string
          integration_type?: string
          last_sync?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
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
      household_members: {
        Row: {
          age: number | null
          can_receive_alerts: boolean | null
          can_view_mood_data: boolean | null
          can_view_progress: boolean | null
          created_at: string
          household_id: string
          id: string
          invitation_status: string | null
          invited_at: string | null
          invited_email: string | null
          joined_at: string | null
          member_type: string
          permission_level: string
          relationship: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age?: number | null
          can_receive_alerts?: boolean | null
          can_view_mood_data?: boolean | null
          can_view_progress?: boolean | null
          created_at?: string
          household_id: string
          id?: string
          invitation_status?: string | null
          invited_at?: string | null
          invited_email?: string | null
          joined_at?: string | null
          member_type?: string
          permission_level?: string
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number | null
          can_receive_alerts?: boolean | null
          can_view_mood_data?: boolean | null
          can_view_progress?: boolean | null
          created_at?: string
          household_id?: string
          id?: string
          invitation_status?: string | null
          invited_at?: string | null
          invited_email?: string | null
          joined_at?: string | null
          member_type?: string
          permission_level?: string
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          current_members: number
          id: string
          max_members: number
          name: string
          plan_type: string
          primary_account_holder_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_members?: number
          id?: string
          max_members?: number
          name: string
          plan_type?: string
          primary_account_holder_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_members?: number
          id?: string
          max_members?: number
          name?: string
          plan_type?: string
          primary_account_holder_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      integration_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          integration_id: string | null
          payload: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          integration_id?: string | null
          payload?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          integration_id?: string | null
          payload?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          configuration: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string
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
      neural_interface_sessions: {
        Row: {
          biometric_feedback: Json | null
          created_at: string
          end_time: string | null
          id: string
          interface_type: string
          neural_patterns: Json | null
          session_effectiveness: number | null
          start_time: string
          therapy_adjustments: Json | null
          user_id: string
        }
        Insert: {
          biometric_feedback?: Json | null
          created_at?: string
          end_time?: string | null
          id?: string
          interface_type: string
          neural_patterns?: Json | null
          session_effectiveness?: number | null
          start_time?: string
          therapy_adjustments?: Json | null
          user_id: string
        }
        Update: {
          biometric_feedback?: Json | null
          created_at?: string
          end_time?: string | null
          id?: string
          interface_type?: string
          neural_patterns?: Json | null
          session_effectiveness?: number | null
          start_time?: string
          therapy_adjustments?: Json | null
          user_id?: string
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
          push_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          session_reminders: boolean | null
          sms_notifications: boolean | null
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
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          session_reminders?: boolean | null
          sms_notifications?: boolean | null
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
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          session_reminders?: boolean | null
          sms_notifications?: boolean | null
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
      peer_connections: {
        Row: {
          connection_type: string
          created_at: string
          id: string
          requested_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          connection_type?: string
          created_at?: string
          id?: string
          requested_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          connection_type?: string
          created_at?: string
          id?: string
          requested_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_monitoring: {
        Row: {
          created_at: string
          endpoint: string | null
          error_message: string | null
          id: string
          response_time_ms: number
          service_name: string
          status_code: number | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          response_time_ms: number
          service_name: string
          status_code?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number
          service_name?: string
          status_code?: number | null
          timestamp?: string
          user_id?: string | null
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
      plan_progress_tracking: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          notes: string | null
          recorded_date: string
          therapy_plan_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value: number
          notes?: string | null
          recorded_date?: string
          therapy_plan_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          recorded_date?: string
          therapy_plan_id?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_analytics: {
        Row: {
          active_users: number | null
          average_session_duration: number | null
          churn_rate: number | null
          created_at: string
          crisis_interventions: number | null
          date: string
          feature_adoption: Json | null
          id: string
          new_signups: number | null
          revenue_metrics: Json | null
          subscription_conversions: number | null
          total_assessments: number | null
          total_sessions: number | null
          total_users: number | null
        }
        Insert: {
          active_users?: number | null
          average_session_duration?: number | null
          churn_rate?: number | null
          created_at?: string
          crisis_interventions?: number | null
          date?: string
          feature_adoption?: Json | null
          id?: string
          new_signups?: number | null
          revenue_metrics?: Json | null
          subscription_conversions?: number | null
          total_assessments?: number | null
          total_sessions?: number | null
          total_users?: number | null
        }
        Update: {
          active_users?: number | null
          average_session_duration?: number | null
          churn_rate?: number | null
          created_at?: string
          crisis_interventions?: number | null
          date?: string
          feature_adoption?: Json | null
          id?: string
          new_signups?: number | null
          revenue_metrics?: Json | null
          subscription_conversions?: number | null
          total_assessments?: number | null
          total_sessions?: number | null
          total_users?: number | null
        }
        Relationships: []
      }
      professional_oversight: {
        Row: {
          completed_at: string | null
          context_data: Json | null
          created_at: string
          id: string
          notes: string | null
          oversight_type: string
          priority_level: string
          professional_id: string | null
          reason: string
          recommendations: Json | null
          scheduled_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          context_data?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          oversight_type: string
          priority_level?: string
          professional_id?: string | null
          reason: string
          recommendations?: Json | null
          scheduled_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          context_data?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          oversight_type?: string
          priority_level?: string
          professional_id?: string | null
          reason?: string
          recommendations?: Json | null
          scheduled_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country_code: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          id: string
          name: string
          onboarding_complete: boolean | null
          phone: string | null
          plan: string | null
          preferred_currency: string | null
          preferred_language: string | null
          privacy_settings: Json | null
          subscription_plan: string | null
          subscription_status: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          id: string
          name: string
          onboarding_complete?: boolean | null
          phone?: string | null
          plan?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          privacy_settings?: Json | null
          subscription_plan?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          id?: string
          name?: string
          onboarding_complete?: boolean | null
          phone?: string | null
          plan?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          privacy_settings?: Json | null
          subscription_plan?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progress_overviews: {
        Row: {
          assignments_completed: number | null
          created_at: string
          goals_completed: number | null
          id: string
          insights: Json
          mood_trend: number | null
          overview_type: string
          period_end: string
          period_start: string
          recommendations: Json
          session_count: number | null
          summary_data: Json
          user_id: string
        }
        Insert: {
          assignments_completed?: number | null
          created_at?: string
          goals_completed?: number | null
          id?: string
          insights?: Json
          mood_trend?: number | null
          overview_type: string
          period_end: string
          period_start: string
          recommendations?: Json
          session_count?: number | null
          summary_data?: Json
          user_id: string
        }
        Update: {
          assignments_completed?: number | null
          created_at?: string
          goals_completed?: number | null
          id?: string
          insights?: Json
          mood_trend?: number | null
          overview_type?: string
          period_end?: string
          period_start?: string
          recommendations?: Json
          session_count?: number | null
          summary_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      quantum_therapy_sessions: {
        Row: {
          created_at: string
          entanglement_factors: Json | null
          id: string
          quantum_score: number
          session_data: Json | null
          superposition_states: Json | null
          therapist_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entanglement_factors?: Json | null
          id?: string
          quantum_score?: number
          session_data?: Json | null
          superposition_states?: Json | null
          therapist_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entanglement_factors?: Json | null
          id?: string
          quantum_score?: number
          session_data?: Json | null
          superposition_states?: Json | null
          therapist_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      real_time_metrics: {
        Row: {
          created_at: string
          id: string
          metric_metadata: Json | null
          metric_type: string
          metric_value: number
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_metadata?: Json | null
          metric_type: string
          metric_value: number
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_metadata?: Json | null
          metric_type?: string
          metric_value?: number
          timestamp?: string
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
      safety_plans: {
        Row: {
          coping_strategies: string[] | null
          created_at: string
          environment_safety: string[] | null
          id: string
          is_active: boolean | null
          last_reviewed: string | null
          plan_name: string
          professional_contacts: Json | null
          reasons_to_live: string[] | null
          social_contacts: Json | null
          updated_at: string
          user_id: string
          warning_signs: string[] | null
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string
          environment_safety?: string[] | null
          id?: string
          is_active?: boolean | null
          last_reviewed?: string | null
          plan_name?: string
          professional_contacts?: Json | null
          reasons_to_live?: string[] | null
          social_contacts?: Json | null
          updated_at?: string
          user_id: string
          warning_signs?: string[] | null
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string
          environment_safety?: string[] | null
          id?: string
          is_active?: boolean | null
          last_reviewed?: string | null
          plan_name?: string
          professional_contacts?: Json | null
          reasons_to_live?: string[] | null
          social_contacts?: Json | null
          updated_at?: string
          user_id?: string
          warning_signs?: string[] | null
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
      security_events: {
        Row: {
          created_at: string
          description: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      session_analytics_enhanced: {
        Row: {
          ai_insights: Json | null
          clinical_observations: Json | null
          created_at: string
          emotional_progression: Json | null
          engagement_score: number | null
          id: string
          intervention_suggestions: Json | null
          protocol_id: string | null
          real_time_metrics: Json | null
          session_id: string
          technique_effectiveness: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          clinical_observations?: Json | null
          created_at?: string
          emotional_progression?: Json | null
          engagement_score?: number | null
          id?: string
          intervention_suggestions?: Json | null
          protocol_id?: string | null
          real_time_metrics?: Json | null
          session_id: string
          technique_effectiveness?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          clinical_observations?: Json | null
          created_at?: string
          emotional_progression?: Json | null
          engagement_score?: number | null
          id?: string
          intervention_suggestions?: Json | null
          protocol_id?: string | null
          real_time_metrics?: Json | null
          session_id?: string
          technique_effectiveness?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      session_protocols: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          post_session_tasks: Json | null
          preparation_steps: Json | null
          session_structure: Json | null
          therapy_type: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          post_session_tasks?: Json | null
          preparation_steps?: Json | null
          session_structure?: Json | null
          therapy_type: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          post_session_tasks?: Json | null
          preparation_steps?: Json | null
          session_structure?: Json | null
          therapy_type?: string
        }
        Relationships: []
      }
      shared_milestones: {
        Row: {
          celebration_count: number | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          milestone_type: string
          support_count: number | null
          title: string
          user_id: string
        }
        Insert: {
          celebration_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          milestone_type: string
          support_count?: number | null
          title: string
          user_id: string
        }
        Update: {
          celebration_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          milestone_type?: string
          support_count?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
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
      support_groups: {
        Row: {
          category: string
          created_at: string
          current_members: number | null
          description: string | null
          group_type: string
          id: string
          is_active: boolean
          max_members: number | null
          moderator_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_members?: number | null
          description?: string | null
          group_type?: string
          id?: string
          is_active?: boolean
          max_members?: number | null
          moderator_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_members?: number | null
          description?: string | null
          group_type?: string
          id?: string
          is_active?: boolean
          max_members?: number | null
          moderator_id?: string | null
          name?: string
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
      technique_effectiveness: {
        Row: {
          context: Json | null
          created_at: string
          effectiveness_score: number
          id: string
          technique: string
          tracked_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          effectiveness_score: number
          id?: string
          technique: string
          tracked_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          effectiveness_score?: number
          id?: string
          technique?: string
          tracked_at?: string
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
      therapy_assignments: {
        Row: {
          assignment_type: string
          completed: boolean
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          description: string
          due_date: string
          id: string
          therapy_plan_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_type?: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          therapy_plan_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_type?: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          therapy_plan_id?: string
          title?: string
          updated_at?: string
          user_id?: string
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
      therapy_plans: {
        Row: {
          created_at: string
          current_phase: string
          description: string
          goals: Json
          id: string
          is_active: boolean
          progress_percentage: number
          therapist_id: string
          title: string
          total_phases: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_phase?: string
          description: string
          goals?: Json
          id?: string
          is_active?: boolean
          progress_percentage?: number
          therapist_id: string
          title: string
          total_phases?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_phase?: string
          description?: string
          goals?: Json
          id?: string
          is_active?: boolean
          progress_percentage?: number
          therapist_id?: string
          title?: string
          total_phases?: number
          updated_at?: string
          user_id?: string
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
      treatment_outcomes: {
        Row: {
          baseline_score: number | null
          clinical_significance: boolean | null
          created_at: string
          current_score: number | null
          goals_met: Json | null
          id: string
          improvement_percentage: number | null
          measured_at: string
          measurement_period: string
          measurement_type: string
          next_targets: Json | null
          user_id: string
        }
        Insert: {
          baseline_score?: number | null
          clinical_significance?: boolean | null
          created_at?: string
          current_score?: number | null
          goals_met?: Json | null
          id?: string
          improvement_percentage?: number | null
          measured_at?: string
          measurement_period: string
          measurement_type: string
          next_targets?: Json | null
          user_id: string
        }
        Update: {
          baseline_score?: number | null
          clinical_significance?: boolean | null
          created_at?: string
          current_score?: number | null
          goals_met?: Json | null
          id?: string
          improvement_percentage?: number | null
          measured_at?: string
          measurement_period?: string
          measurement_type?: string
          next_targets?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      two_factor_auth: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean | null
          last_used: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          searchable_content: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          searchable_content?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          searchable_content?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_behavior_analytics: {
        Row: {
          assessments_taken: number | null
          average_mood: number | null
          created_at: string
          date: string
          engagement_score: number | null
          feature_usage: Json | null
          goals_completed: number | null
          goals_created: number | null
          id: string
          mood_entries: number | null
          retention_score: number | null
          sessions_count: number | null
          total_session_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessments_taken?: number | null
          average_mood?: number | null
          created_at?: string
          date?: string
          engagement_score?: number | null
          feature_usage?: Json | null
          goals_completed?: number | null
          goals_created?: number | null
          id?: string
          mood_entries?: number | null
          retention_score?: number | null
          sessions_count?: number | null
          total_session_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessments_taken?: number | null
          average_mood?: number | null
          created_at?: string
          date?: string
          engagement_score?: number | null
          feature_usage?: Json | null
          goals_completed?: number | null
          goals_created?: number | null
          id?: string
          mood_entries?: number | null
          retention_score?: number | null
          sessions_count?: number | null
          total_session_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_cultural_profiles: {
        Row: {
          communication_style: string
          created_at: string
          cultural_background: string | null
          cultural_sensitivities: string[]
          family_structure: string
          id: string
          primary_language: string
          religious_considerations: boolean
          religious_details: string | null
          therapy_approach_preferences: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string
          created_at?: string
          cultural_background?: string | null
          cultural_sensitivities?: string[]
          family_structure?: string
          id?: string
          primary_language?: string
          religious_considerations?: boolean
          religious_details?: string | null
          therapy_approach_preferences?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string
          created_at?: string
          cultural_background?: string | null
          cultural_sensitivities?: string[]
          family_structure?: string
          id?: string
          primary_language?: string
          religious_considerations?: boolean
          religious_details?: string | null
          therapy_approach_preferences?: string[]
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
      user_integrations: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          is_enabled: boolean | null
          oauth_tokens: Json | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          is_enabled?: boolean | null
          oauth_tokens?: Json | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          is_enabled?: boolean | null
          oauth_tokens?: Json | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
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
      user_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          last_activity: string
          session_token: string
          terminated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token: string
          terminated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string
          session_token?: string
          terminated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          average_mood: number | null
          current_streak: number | null
          id: string
          last_session_date: string | null
          longest_streak: number | null
          total_minutes: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_mood?: number | null
          current_streak?: number | null
          id?: string
          last_session_date?: string | null
          longest_streak?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_mood?: number | null
          current_streak?: number | null
          id?: string
          last_session_date?: string | null
          longest_streak?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
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
      voice_clone_profiles: {
        Row: {
          cloned_voice_id: string | null
          created_at: string
          id: string
          quality_score: number
          sample_count: number
          training_status: string
          updated_at: string
          user_id: string
          voice_name: string
        }
        Insert: {
          cloned_voice_id?: string | null
          created_at?: string
          id?: string
          quality_score?: number
          sample_count?: number
          training_status?: string
          updated_at?: string
          user_id: string
          voice_name: string
        }
        Update: {
          cloned_voice_id?: string | null
          created_at?: string
          id?: string
          quality_score?: number
          sample_count?: number
          training_status?: string
          updated_at?: string
          user_id?: string
          voice_name?: string
        }
        Relationships: []
      }
      voice_samples: {
        Row: {
          created_at: string
          duration: number
          file_path: string
          id: string
          profile_id: string
          quality_score: number
          transcript: string
        }
        Insert: {
          created_at?: string
          duration?: number
          file_path: string
          id?: string
          profile_id: string
          quality_score?: number
          transcript: string
        }
        Update: {
          created_at?: string
          duration?: number
          file_path?: string
          id?: string
          profile_id?: string
          quality_score?: number
          transcript?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          event_types: string[]
          id: string
          is_active: boolean | null
          retry_count: number | null
          secret: string | null
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_types: string[]
          id?: string
          is_active?: boolean | null
          retry_count?: number | null
          secret?: string | null
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_types?: string[]
          id?: string
          is_active?: boolean | null
          retry_count?: number | null
          secret?: string | null
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_config: {
        Row: {
          ai_personality_id: string | null
          auto_responses_enabled: boolean | null
          business_hours_enabled: boolean | null
          business_hours_end: string | null
          business_hours_start: string | null
          business_timezone: string | null
          created_at: string
          crisis_escalation_enabled: boolean | null
          id: string
          message_encryption_enabled: boolean | null
          response_delay_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_personality_id?: string | null
          auto_responses_enabled?: boolean | null
          business_hours_enabled?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          business_timezone?: string | null
          created_at?: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          message_encryption_enabled?: boolean | null
          response_delay_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_personality_id?: string | null
          auto_responses_enabled?: boolean | null
          business_hours_enabled?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          business_timezone?: string | null
          created_at?: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          message_encryption_enabled?: boolean | null
          response_delay_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_global_config: {
        Row: {
          access_token_encrypted: string | null
          business_account_id: string | null
          created_at: string
          created_by: string
          crisis_escalation_enabled: boolean | null
          id: string
          is_active: boolean
          message_monitoring_enabled: boolean | null
          phone_number_id: string | null
          rate_limit_per_hour: number | null
          updated_at: string
          webhook_url: string | null
          webhook_verify_token: string | null
        }
        Insert: {
          access_token_encrypted?: string | null
          business_account_id?: string | null
          created_at?: string
          created_by: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          is_active?: boolean
          message_monitoring_enabled?: boolean | null
          phone_number_id?: string | null
          rate_limit_per_hour?: number | null
          updated_at?: string
          webhook_url?: string | null
          webhook_verify_token?: string | null
        }
        Update: {
          access_token_encrypted?: string | null
          business_account_id?: string | null
          created_at?: string
          created_by?: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          is_active?: boolean
          message_monitoring_enabled?: boolean | null
          phone_number_id?: string | null
          rate_limit_per_hour?: number | null
          updated_at?: string
          webhook_url?: string | null
          webhook_verify_token?: string | null
        }
        Relationships: []
      }
      whatsapp_integrations: {
        Row: {
          access_token_encrypted: string | null
          business_account_id: string | null
          created_at: string
          id: string
          is_active: boolean
          last_message_at: string | null
          phone_number: string
          phone_number_id: string | null
          privacy_settings: Json | null
          updated_at: string
          user_id: string
          verification_code: string | null
          verification_status: string
          verified_at: string | null
          webhook_token: string | null
          whatsapp_number: string | null
        }
        Insert: {
          access_token_encrypted?: string | null
          business_account_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string | null
          phone_number: string
          phone_number_id?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id: string
          verification_code?: string | null
          verification_status?: string
          verified_at?: string | null
          webhook_token?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          access_token_encrypted?: string | null
          business_account_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string | null
          phone_number?: string
          phone_number_id?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id?: string
          verification_code?: string | null
          verification_status?: string
          verified_at?: string | null
          webhook_token?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          ai_response_metadata: Json | null
          content: string
          delivery_status: string | null
          error_message: string | null
          id: string
          integration_id: string
          message_type: string
          sender_type: string
          therapy_session_id: string | null
          timestamp: string
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          ai_response_metadata?: Json | null
          content: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          integration_id: string
          message_type?: string
          sender_type: string
          therapy_session_id?: string | null
          timestamp?: string
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          ai_response_metadata?: Json | null
          content?: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string
          message_type?: string
          sender_type?: string
          therapy_session_id?: string | null
          timestamp?: string
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_response_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          name: string
          priority: number | null
          template_text: string
          updated_at: string
          usage_count: number | null
          variables: string[] | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number | null
          template_text: string
          updated_at?: string
          usage_count?: number | null
          variables?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number | null
          template_text?: string
          updated_at?: string
          usage_count?: number | null
          variables?: string[] | null
        }
        Relationships: []
      }
      whatsapp_system_prompts: {
        Row: {
          created_at: string
          created_by: string
          effectiveness_score: number | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          personality_type: string
          system_prompt: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          personality_type: string
          system_prompt: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          personality_type?: string
          system_prompt?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_usage_analytics: {
        Row: {
          active_users: number | null
          ai_responses: number | null
          average_response_time: number | null
          created_at: string
          crisis_interventions: number | null
          date: string
          error_count: number | null
          id: string
          total_messages: number | null
          user_messages: number | null
        }
        Insert: {
          active_users?: number | null
          ai_responses?: number | null
          average_response_time?: number | null
          created_at?: string
          crisis_interventions?: number | null
          date?: string
          error_count?: number | null
          id?: string
          total_messages?: number | null
          user_messages?: number | null
        }
        Update: {
          active_users?: number | null
          ai_responses?: number | null
          average_response_time?: number | null
          created_at?: string
          crisis_interventions?: number | null
          date?: string
          error_count?: number | null
          id?: string
          total_messages?: number | null
          user_messages?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_access_member_data: {
        Args: {
          requesting_user_id: string
          target_user_id: string
          data_type: string
        }
        Returns: boolean
      }
      can_user_perform_action: {
        Args: {
          user_id_param: string
          action_type: string
          current_usage?: number
        }
        Returns: boolean
      }
      cleanup_old_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      update_goal_streak: {
        Args: { goal_id_param: string }
        Returns: undefined
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
