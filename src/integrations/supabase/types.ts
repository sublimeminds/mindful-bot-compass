export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_sharing_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_taken: string | null
          alert_type: string
          confidence_score: number | null
          evidence: Json | null
          id: string
          is_resolved: boolean | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type: string
          confidence_score?: number | null
          evidence?: Json | null
          id?: string
          is_resolved?: boolean | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type?: string
          confidence_score?: number | null
          evidence?: Json | null
          id?: string
          is_resolved?: boolean | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      achievement_badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          rarity: string
          requirements: Json
          title: string
          unlock_criteria: Json
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          rarity?: string
          requirements?: Json
          title: string
          unlock_criteria?: Json
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          rarity?: string
          requirements?: Json
          title?: string
          unlock_criteria?: Json
          xp_reward?: number
        }
        Relationships: []
      }
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
      active_sessions: {
        Row: {
          crisis_indicators: Json | null
          id: string
          last_activity: string | null
          mood_tracking: Json | null
          session_data: Json | null
          session_type: string
          start_time: string | null
          status: string | null
          therapist_id: string
          user_id: string
        }
        Insert: {
          crisis_indicators?: Json | null
          id?: string
          last_activity?: string | null
          mood_tracking?: Json | null
          session_data?: Json | null
          session_type: string
          start_time?: string | null
          status?: string | null
          therapist_id: string
          user_id: string
        }
        Update: {
          crisis_indicators?: Json | null
          id?: string
          last_activity?: string | null
          mood_tracking?: Json | null
          session_data?: Json | null
          session_type?: string
          start_time?: string | null
          status?: string | null
          therapist_id?: string
          user_id?: string
        }
        Relationships: []
      }
      adaptive_learning_profiles: {
        Row: {
          created_at: string | null
          cultural_adaptations: Json | null
          effectiveness_metrics: Json | null
          id: string
          last_updated: string | null
          learning_patterns: Json | null
          model_performance: Json | null
          next_session_recommendations: Json | null
          preference_adjustments: Json | null
          therapy_outcomes: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cultural_adaptations?: Json | null
          effectiveness_metrics?: Json | null
          id?: string
          last_updated?: string | null
          learning_patterns?: Json | null
          model_performance?: Json | null
          next_session_recommendations?: Json | null
          preference_adjustments?: Json | null
          therapy_outcomes?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cultural_adaptations?: Json | null
          effectiveness_metrics?: Json | null
          id?: string
          last_updated?: string | null
          learning_patterns?: Json | null
          model_performance?: Json | null
          next_session_recommendations?: Json | null
          preference_adjustments?: Json | null
          therapy_outcomes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      adaptive_therapy_plans: {
        Row: {
          adaptations: Json
          created_at: string
          effectiveness_score: number
          goals: string[]
          id: string
          next_session_recommendations: Json
          primary_approach: string
          secondary_approach: string | null
          techniques: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          adaptations?: Json
          created_at?: string
          effectiveness_score?: number
          goals?: string[]
          id?: string
          next_session_recommendations?: Json
          primary_approach: string
          secondary_approach?: string | null
          techniques?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          adaptations?: Json
          created_at?: string
          effectiveness_score?: number
          goals?: string[]
          id?: string
          next_session_recommendations?: Json
          primary_approach?: string
          secondary_approach?: string | null
          techniques?: string[]
          updated_at?: string
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
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "admin_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_configuration: {
        Row: {
          config_key: string
          config_value: Json
          description: string | null
          id: string
          is_sensitive: boolean
          updated_at: string
          updated_by: string
        }
        Insert: {
          config_key: string
          config_value: Json
          description?: string | null
          id?: string
          is_sensitive?: boolean
          updated_at?: string
          updated_by: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          description?: string | null
          id?: string
          is_sensitive?: boolean
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_configuration_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
        ]
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
      admin_role_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          permission: Database["public"]["Enums"]["admin_permission"]
          role: Database["public"]["Enums"]["super_admin_role"]
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          permission: Database["public"]["Enums"]["admin_permission"]
          role: Database["public"]["Enums"]["super_admin_role"]
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          permission?: Database["public"]["Enums"]["admin_permission"]
          role?: Database["public"]["Enums"]["super_admin_role"]
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity: string | null
          revoked_at: string | null
          revoked_reason: string | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          device_fingerprint?: string | null
          expires_at: string
          id?: string
          ip_address: unknown
          is_active?: boolean
          last_activity?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_applications: {
        Row: {
          application_data: Json | null
          business_name: string | null
          created_at: string | null
          expected_monthly_referrals: number | null
          id: string
          marketing_channels: string[] | null
          marketing_experience: string | null
          marketing_plan: string | null
          previous_affiliate_experience: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_profiles: Json | null
          status: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          application_data?: Json | null
          business_name?: string | null
          created_at?: string | null
          expected_monthly_referrals?: number | null
          id?: string
          marketing_channels?: string[] | null
          marketing_experience?: string | null
          marketing_plan?: string | null
          previous_affiliate_experience?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_profiles?: Json | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          application_data?: Json | null
          business_name?: string | null
          created_at?: string | null
          expected_monthly_referrals?: number | null
          id?: string
          marketing_channels?: string[] | null
          marketing_experience?: string | null
          marketing_plan?: string | null
          previous_affiliate_experience?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_profiles?: Json | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      affiliate_commission_rules: {
        Row: {
          commission_rate: number | null
          commission_type: string
          created_at: string
          fixed_amount: number | null
          id: string
          is_active: boolean
          maximum_commission: number | null
          minimum_order_value: number | null
          product_id: string | null
          product_type: string
          recurring_commission: boolean
          recurring_months: number | null
          tier_id: string
          updated_at: string
        }
        Insert: {
          commission_rate?: number | null
          commission_type?: string
          created_at?: string
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          maximum_commission?: number | null
          minimum_order_value?: number | null
          product_id?: string | null
          product_type: string
          recurring_commission?: boolean
          recurring_months?: number | null
          tier_id: string
          updated_at?: string
        }
        Update: {
          commission_rate?: number | null
          commission_type?: string
          created_at?: string
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          maximum_commission?: number | null
          minimum_order_value?: number | null
          product_id?: string | null
          product_type?: string
          recurring_commission?: boolean
          recurring_months?: number | null
          tier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commission_rules_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "affiliate_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_hierarchy: {
        Row: {
          child_affiliate_id: string
          commission_rate: number
          created_at: string
          id: string
          is_active: boolean
          level_depth: number
          parent_affiliate_id: string
        }
        Insert: {
          child_affiliate_id: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          level_depth?: number
          parent_affiliate_id: string
        }
        Update: {
          child_affiliate_id?: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          level_depth?: number
          parent_affiliate_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_hierarchy_child_affiliate_id_fkey"
            columns: ["child_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_hierarchy_parent_affiliate_id_fkey"
            columns: ["parent_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_marketing_materials: {
        Row: {
          created_at: string | null
          description: string | null
          dimensions: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          material_type: string
          preview_url: string | null
          tier_required: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          material_type: string
          preview_url?: string | null
          tier_required?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          material_type?: string
          preview_url?: string | null
          tier_required?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_metrics: {
        Row: {
          affiliate_id: string
          avg_order_value: number
          clicks: number
          commissions_earned: number
          conversion_rate: number
          conversions: number
          created_at: string
          id: string
          metric_date: string
          returning_visitors: number
          revenue: number
          rolling_12m_referrals: number | null
          rolling_12m_revenue: number | null
          unique_visitors: number
        }
        Insert: {
          affiliate_id: string
          avg_order_value?: number
          clicks?: number
          commissions_earned?: number
          conversion_rate?: number
          conversions?: number
          created_at?: string
          id?: string
          metric_date: string
          returning_visitors?: number
          revenue?: number
          rolling_12m_referrals?: number | null
          rolling_12m_revenue?: number | null
          unique_visitors?: number
        }
        Update: {
          affiliate_id?: string
          avg_order_value?: number
          clicks?: number
          commissions_earned?: number
          conversion_rate?: number
          conversions?: number
          created_at?: string
          id?: string
          metric_date?: string
          returning_visitors?: number
          revenue?: number
          rolling_12m_referrals?: number | null
          rolling_12m_revenue?: number | null
          unique_visitors?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_metrics_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          commission_period_end: string
          commission_period_start: string
          created_at: string
          id: string
          notes: string | null
          payout_amount: number
          payout_details: Json | null
          payout_method: string
          payout_reference: string | null
          payout_status: string
          processed_at: string | null
          processed_by: string | null
          referral_ids: string[]
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          commission_period_end: string
          commission_period_start: string
          created_at?: string
          id?: string
          notes?: string | null
          payout_amount: number
          payout_details?: Json | null
          payout_method: string
          payout_reference?: string | null
          payout_status?: string
          processed_at?: string | null
          processed_by?: string | null
          referral_ids: string[]
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          commission_period_end?: string
          commission_period_start?: string
          created_at?: string
          id?: string
          notes?: string | null
          payout_amount?: number
          payout_details?: Json | null
          payout_method?: string
          payout_reference?: string | null
          payout_status?: string
          processed_at?: string | null
          processed_by?: string | null
          referral_ids?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          click_data: Json
          commission_amount: number | null
          commission_status: string | null
          conversion_data: Json | null
          conversion_value: number | null
          converted_at: string | null
          created_at: string
          device_fingerprint: string | null
          id: string
          ip_address: unknown | null
          landing_page: string | null
          order_id: string | null
          referral_code: string
          referred_user_id: string | null
          referrer_url: string | null
          session_id: string | null
          subscription_id: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          affiliate_id: string
          click_data?: Json
          commission_amount?: number | null
          commission_status?: string | null
          conversion_data?: Json | null
          conversion_value?: number | null
          converted_at?: string | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          landing_page?: string | null
          order_id?: string | null
          referral_code: string
          referred_user_id?: string | null
          referrer_url?: string | null
          session_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          affiliate_id?: string
          click_data?: Json
          commission_amount?: number | null
          commission_status?: string | null
          conversion_data?: Json | null
          conversion_value?: number | null
          converted_at?: string | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          landing_page?: string | null
          order_id?: string | null
          referral_code?: string
          referred_user_id?: string | null
          referrer_url?: string | null
          session_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_tiers: {
        Row: {
          base_commission_rate: number
          benefits: Json | null
          bonus_commission_rate: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          min_referrals: number
          min_revenue: number
          monthly_min_referrals: number | null
          monthly_min_revenue: number | null
          name: string
          priority_level: number
          updated_at: string
        }
        Insert: {
          base_commission_rate?: number
          benefits?: Json | null
          bonus_commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_referrals?: number
          min_revenue?: number
          monthly_min_referrals?: number | null
          monthly_min_revenue?: number | null
          name: string
          priority_level?: number
          updated_at?: string
        }
        Update: {
          base_commission_rate?: number
          benefits?: Json | null
          bonus_commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_referrals?: number
          min_revenue?: number
          monthly_min_referrals?: number | null
          monthly_min_revenue?: number | null
          name?: string
          priority_level?: number
          updated_at?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          affiliate_code: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          notes: string | null
          payment_email: string | null
          payment_method: string | null
          status: string
          tax_id: string | null
          tier_id: string
          total_commissions_earned: number
          total_commissions_paid: number
          total_referrals: number
          total_revenue: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          affiliate_code: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_email?: string | null
          payment_method?: string | null
          status?: string
          tax_id?: string | null
          tier_id: string
          total_commissions_earned?: number
          total_commissions_paid?: number
          total_referrals?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_email?: string | null
          payment_method?: string | null
          status?: string
          tax_id?: string | null
          tier_id?: string
          total_commissions_earned?: number
          total_commissions_paid?: number
          total_referrals?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "affiliate_tiers"
            referencedColumns: ["id"]
          },
        ]
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
      ai_configurations: {
        Row: {
          avatar_settings: Json | null
          configuration: Json | null
          cost_settings: Json | null
          created_at: string
          cultural_settings: Json | null
          emergency_protocols: Json | null
          id: string
          is_active: boolean | null
          model_name: string
          model_provider: string
          name: string
          updated_at: string
          voice_settings: Json | null
        }
        Insert: {
          avatar_settings?: Json | null
          configuration?: Json | null
          cost_settings?: Json | null
          created_at?: string
          cultural_settings?: Json | null
          emergency_protocols?: Json | null
          id?: string
          is_active?: boolean | null
          model_name: string
          model_provider: string
          name: string
          updated_at?: string
          voice_settings?: Json | null
        }
        Update: {
          avatar_settings?: Json | null
          configuration?: Json | null
          cost_settings?: Json | null
          created_at?: string
          cultural_settings?: Json | null
          emergency_protocols?: Json | null
          id?: string
          is_active?: boolean | null
          model_name?: string
          model_provider?: string
          name?: string
          updated_at?: string
          voice_settings?: Json | null
        }
        Relationships: []
      }
      ai_feature_toggles: {
        Row: {
          conditions: Json | null
          created_at: string
          enabled: boolean
          feature_name: string
          id: string
          rollout_percentage: number | null
          updated_at: string
          user_type: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          feature_name: string
          id?: string
          rollout_percentage?: number | null
          updated_at?: string
          user_type: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          feature_name?: string
          id?: string
          rollout_percentage?: number | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
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
      ai_model_performance: {
        Row: {
          cost_per_request: number | null
          created_at: string
          cultural_context: string | null
          id: string
          model_name: string
          quality_score: number | null
          response_time_ms: number | null
          success_rate: number | null
          task_type: string
          updated_at: string
          user_satisfaction_score: number | null
        }
        Insert: {
          cost_per_request?: number | null
          created_at?: string
          cultural_context?: string | null
          id?: string
          model_name: string
          quality_score?: number | null
          response_time_ms?: number | null
          success_rate?: number | null
          task_type: string
          updated_at?: string
          user_satisfaction_score?: number | null
        }
        Update: {
          cost_per_request?: number | null
          created_at?: string
          cultural_context?: string | null
          id?: string
          model_name?: string
          quality_score?: number | null
          response_time_ms?: number | null
          success_rate?: number | null
          task_type?: string
          updated_at?: string
          user_satisfaction_score?: number | null
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
      ai_routing_decisions: {
        Row: {
          created_at: string | null
          cultural_adaptations: Json | null
          effectiveness_score: number | null
          id: string
          priority_level: number
          reasoning: string | null
          response_time_ms: number | null
          selected_model: string
          session_id: string | null
          therapy_approach: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cultural_adaptations?: Json | null
          effectiveness_score?: number | null
          id?: string
          priority_level?: number
          reasoning?: string | null
          response_time_ms?: number | null
          selected_model: string
          session_id?: string | null
          therapy_approach: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cultural_adaptations?: Json | null
          effectiveness_score?: number | null
          id?: string
          priority_level?: number
          reasoning?: string | null
          response_time_ms?: number | null
          selected_model?: string
          session_id?: string | null
          therapy_approach?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_routing_rules: {
        Row: {
          conditions: Json | null
          created_at: string
          enabled: boolean
          feature_type: string
          id: string
          model_config: Json
          priority: number
          updated_at: string
          user_type: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          feature_type: string
          id?: string
          model_config?: Json
          priority?: number
          updated_at?: string
          user_type: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          feature_type?: string
          id?: string
          model_config?: Json
          priority?: number
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      ai_session_decisions: {
        Row: {
          actual_outcome: Json | null
          context_analysis: Json | null
          created_at: string | null
          cultural_adaptations: Json | null
          decision_effectiveness: number | null
          decision_point: string
          decision_rationale: string | null
          id: string
          model_used: string
          predicted_outcome: Json | null
          response_generation_strategy: string | null
          session_id: string
          technique_selected: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_outcome?: Json | null
          context_analysis?: Json | null
          created_at?: string | null
          cultural_adaptations?: Json | null
          decision_effectiveness?: number | null
          decision_point: string
          decision_rationale?: string | null
          id?: string
          model_used: string
          predicted_outcome?: Json | null
          response_generation_strategy?: string | null
          session_id: string
          technique_selected?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_outcome?: Json | null
          context_analysis?: Json | null
          created_at?: string | null
          cultural_adaptations?: Json | null
          decision_effectiveness?: number | null
          decision_point?: string
          decision_rationale?: string | null
          id?: string
          model_used?: string
          predicted_outcome?: Json | null
          response_generation_strategy?: string | null
          session_id?: string
          technique_selected?: string | null
          updated_at?: string | null
          user_id?: string
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
      ai_translations: {
        Row: {
          ai_model: string | null
          context_type: string
          created_at: string
          cultural_context: string | null
          id: string
          session_id: string | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_context: Json | null
          translated_text: string
          translation_quality: number | null
          updated_at: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          context_type?: string
          created_at?: string
          cultural_context?: string | null
          id?: string
          session_id?: string | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_context?: Json | null
          translated_text: string
          translation_quality?: number | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          context_type?: string
          created_at?: string
          cultural_context?: string | null
          id?: string
          session_id?: string | null
          source_language?: string
          source_text?: string
          target_language?: string
          therapeutic_context?: Json | null
          translated_text?: string
          translation_quality?: number | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_usage_tracking: {
        Row: {
          cost_per_token: number
          created_at: string
          id: string
          input_tokens: number
          metadata: Json | null
          model_id: string
          output_tokens: number
          provider: string
          response_time_ms: number | null
          session_id: string | null
          subscription_tier: string
          success: boolean | null
          task_type: string
          timestamp: string
          total_cost: number
          total_tokens: number
          user_id: string
        }
        Insert: {
          cost_per_token: number
          created_at?: string
          id?: string
          input_tokens?: number
          metadata?: Json | null
          model_id: string
          output_tokens?: number
          provider: string
          response_time_ms?: number | null
          session_id?: string | null
          subscription_tier: string
          success?: boolean | null
          task_type: string
          timestamp?: string
          total_cost: number
          total_tokens?: number
          user_id: string
        }
        Update: {
          cost_per_token?: number
          created_at?: string
          id?: string
          input_tokens?: number
          metadata?: Json | null
          model_id?: string
          output_tokens?: number
          provider?: string
          response_time_ms?: number | null
          session_id?: string | null
          subscription_tier?: string
          success?: boolean | null
          task_type?: string
          timestamp?: string
          total_cost?: number
          total_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      ai_user_overrides: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          override_type: string
          override_value: Json
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          override_type: string
          override_value: Json
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          override_type?: string
          override_value?: Json
          reason?: string
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
      assessment_matches: {
        Row: {
          assessment_id: string
          compatibility_score: number
          created_at: string | null
          id: string
          matching_factors: Json | null
          therapist_id: string
          user_id: string
        }
        Insert: {
          assessment_id: string
          compatibility_score?: number
          created_at?: string | null
          id?: string
          matching_factors?: Json | null
          therapist_id: string
          user_id: string
        }
        Update: {
          assessment_id?: string
          compatibility_score?: number
          created_at?: string | null
          id?: string
          matching_factors?: Json | null
          therapist_id?: string
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
      avatar_assets: {
        Row: {
          asset_type: string
          created_at: string
          emotion_type: string | null
          file_metadata: Json | null
          file_url: string
          id: string
          is_primary: boolean | null
          therapist_id: string
        }
        Insert: {
          asset_type: string
          created_at?: string
          emotion_type?: string | null
          file_metadata?: Json | null
          file_url: string
          id?: string
          is_primary?: boolean | null
          therapist_id: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          emotion_type?: string | null
          file_metadata?: Json | null
          file_url?: string
          id?: string
          is_primary?: boolean | null
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatar_assets_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      avatar_customization_items: {
        Row: {
          category: string
          config_data: Json
          created_at: string
          id: string
          is_premium: boolean
          item_type: string
          name: string
          preview_url: string | null
          rarity: string
          unlock_requirements: Json | null
          xp_cost: number
        }
        Insert: {
          category: string
          config_data?: Json
          created_at?: string
          id?: string
          is_premium?: boolean
          item_type: string
          name: string
          preview_url?: string | null
          rarity?: string
          unlock_requirements?: Json | null
          xp_cost?: number
        }
        Update: {
          category?: string
          config_data?: Json
          created_at?: string
          id?: string
          is_premium?: boolean
          item_type?: string
          name?: string
          preview_url?: string | null
          rarity?: string
          unlock_requirements?: Json | null
          xp_cost?: number
        }
        Relationships: []
      }
      avatar_mood_entries: {
        Row: {
          context_data: Json | null
          detected_by: string
          id: string
          mood_intensity: number
          mood_value: string
          recorded_at: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          detected_by?: string
          id?: string
          mood_intensity?: number
          mood_value: string
          recorded_at?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          detected_by?: string
          id?: string
          mood_intensity?: number
          mood_value?: string
          recorded_at?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      billing_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          line1: string
          line2: string | null
          postal_code: string
          state: string | null
          tax_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line1: string
          line2?: string | null
          postal_code: string
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line1?: string
          line2?: string | null
          postal_code?: string
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
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
      campaign_enrollments: {
        Row: {
          campaign_id: string | null
          completed_at: string | null
          completion_status: string | null
          current_step: number | null
          enrolled_at: string | null
          enrollment_data: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          completed_at?: string | null
          completion_status?: string | null
          current_step?: number | null
          enrolled_at?: string | null
          enrollment_data?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          completed_at?: string | null
          completion_status?: string | null
          current_step?: number | null
          enrolled_at?: string | null
          enrollment_data?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_enrollments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "notification_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_recipients: {
        Row: {
          bounce_reason: string | null
          campaign_id: string
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          email: string
          id: string
          opened_at: string | null
          sent_at: string | null
          status: string | null
          unsubscribed_at: string | null
          user_id: string
        }
        Insert: {
          bounce_reason?: string | null
          campaign_id: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          unsubscribed_at?: string | null
          user_id: string
        }
        Update: {
          bounce_reason?: string | null
          campaign_id?: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email?: string
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          unsubscribed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "newsletter_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          best_streak: number | null
          challenge_id: string
          completion_date: string | null
          completion_percentage: number | null
          current_streak: number | null
          days_completed: number | null
          id: string
          is_completed: boolean | null
          joined_date: string
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          challenge_id: string
          completion_date?: string | null
          completion_percentage?: number | null
          current_streak?: number | null
          days_completed?: number | null
          id?: string
          is_completed?: boolean | null
          joined_date?: string
          user_id: string
        }
        Update: {
          best_streak?: number | null
          challenge_id?: string
          completion_date?: string | null
          completion_percentage?: number | null
          current_streak?: number | null
          days_completed?: number | null
          id?: string
          is_completed?: boolean | null
          joined_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "wellness_challenges"
            referencedColumns: ["id"]
          },
        ]
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
      community_events: {
        Row: {
          category: string
          created_at: string
          description: string
          end_time: string
          event_type: string
          id: string
          is_active: boolean
          is_virtual: boolean
          location: string | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string
          participant_count: number | null
          start_time: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          end_time: string
          event_type: string
          id?: string
          is_active?: boolean
          is_virtual?: boolean
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id: string
          participant_count?: number | null
          start_time: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          end_time?: string
          event_type?: string
          id?: string
          is_active?: boolean
          is_virtual?: boolean
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string
          participant_count?: number | null
          start_time?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_milestones: {
        Row: {
          achievement_date: string
          celebration_count: number | null
          created_at: string
          description: string
          id: string
          is_shared: boolean
          milestone_data: Json | null
          milestone_type: string
          points_earned: number | null
          support_count: number | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_date: string
          celebration_count?: number | null
          created_at?: string
          description: string
          id?: string
          is_shared?: boolean
          milestone_data?: Json | null
          milestone_type: string
          points_earned?: number | null
          support_count?: number | null
          title: string
          user_id: string
        }
        Update: {
          achievement_date?: string
          celebration_count?: number | null
          created_at?: string
          description?: string
          id?: string
          is_shared?: boolean
          milestone_data?: Json | null
          milestone_type?: string
          points_earned?: number | null
          support_count?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          category: string
          comment_count: number | null
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          is_pinned: boolean
          like_count: number | null
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          is_pinned?: boolean
          like_count?: number | null
          post_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          is_pinned?: boolean
          like_count?: number | null
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      compliance_metrics: {
        Row: {
          compliance_standard: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          compliance_standard: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          compliance_standard?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
        }
        Relationships: []
      }
      component_registry: {
        Row: {
          category: string | null
          changelog: string | null
          criticality: string | null
          dependencies: string[] | null
          features: string[] | null
          id: string
          last_updated: string | null
          name: string
          status: string | null
          version: string
        }
        Insert: {
          category?: string | null
          changelog?: string | null
          criticality?: string | null
          dependencies?: string[] | null
          features?: string[] | null
          id: string
          last_updated?: string | null
          name: string
          status?: string | null
          version: string
        }
        Update: {
          category?: string | null
          changelog?: string | null
          criticality?: string | null
          dependencies?: string[] | null
          features?: string[] | null
          id?: string
          last_updated?: string | null
          name?: string
          status?: string | null
          version?: string
        }
        Relationships: []
      }
      content_library: {
        Row: {
          category: string
          content_type: string
          content_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          published_at: string | null
          tags: string[] | null
          target_audience: string[] | null
          therapeutic_approach: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content_type: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          therapeutic_approach?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content_type?: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          therapeutic_approach?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_translations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content_key: string
          content_type: string
          context_type: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          original_text: string
          quality_score: number | null
          source_language: string
          target_language: string
          translated_text: string
          translation_method: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content_key: string
          content_type: string
          context_type?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          original_text: string
          quality_score?: number | null
          source_language?: string
          target_language: string
          translated_text: string
          translation_method?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content_key?: string
          content_type?: string
          context_type?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          original_text?: string
          quality_score?: number | null
          source_language?: string
          target_language?: string
          translated_text?: string
          translation_method?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contextual_awareness: {
        Row: {
          awareness_type: string
          confidence_score: number | null
          context_data: Json
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          awareness_type: string
          confidence_score?: number | null
          context_data?: Json
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          awareness_type?: string
          confidence_score?: number | null
          context_data?: Json
          created_at?: string | null
          id?: string
          session_id?: string | null
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
      conversation_threads: {
        Row: {
          conversation_data: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          last_platform: string | null
          platforms: string[] | null
          thread_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_platform?: string | null
          platforms?: string[] | null
          thread_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_platform?: string | null
          platforms?: string[] | null
          thread_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cost_forecasts: {
        Row: {
          confidence_score: number
          created_at: string
          forecast_date: string
          forecast_period: string
          id: string
          model_breakdown: Json | null
          predicted_cost: number
          predicted_usage: number
          subscription_tier: string
          user_id: string | null
        }
        Insert: {
          confidence_score: number
          created_at?: string
          forecast_date: string
          forecast_period: string
          id?: string
          model_breakdown?: Json | null
          predicted_cost: number
          predicted_usage: number
          subscription_tier: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number
          created_at?: string
          forecast_date?: string
          forecast_period?: string
          id?: string
          model_breakdown?: Json | null
          predicted_cost?: number
          predicted_usage?: number
          subscription_tier?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cost_optimization_recommendations: {
        Row: {
          acted_upon_at: string | null
          confidence_score: number
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          potential_savings: number | null
          priority: number | null
          recommendation_type: string
          title: string
          user_id: string | null
        }
        Insert: {
          acted_upon_at?: string | null
          confidence_score: number
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          potential_savings?: number | null
          priority?: number | null
          recommendation_type: string
          title: string
          user_id?: string | null
        }
        Update: {
          acted_upon_at?: string | null
          confidence_score?: number
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          potential_savings?: number | null
          priority?: number | null
          recommendation_type?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          calling_code: string
          country_code: string
          created_at: string
          currency_code: string
          currency_symbol: string
          id: string
          is_active: boolean
          language_code: string
          name: string
          region: string
          timezone: string
        }
        Insert: {
          calling_code: string
          country_code: string
          created_at?: string
          currency_code: string
          currency_symbol: string
          id?: string
          is_active?: boolean
          language_code: string
          name: string
          region: string
          timezone: string
        }
        Update: {
          calling_code?: string
          country_code?: string
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          language_code?: string
          name?: string
          region?: string
          timezone?: string
        }
        Relationships: []
      }
      crisis_alerts: {
        Row: {
          ai_confidence: number
          alert_type: string
          created_at: string | null
          escalated_to: string | null
          id: string
          resolution_status: string | null
          resolved_at: string | null
          session_id: string | null
          severity_level: string
          trigger_data: Json | null
          user_id: string
        }
        Insert: {
          ai_confidence?: number
          alert_type: string
          created_at?: string | null
          escalated_to?: string | null
          id?: string
          resolution_status?: string | null
          resolved_at?: string | null
          session_id?: string | null
          severity_level?: string
          trigger_data?: Json | null
          user_id: string
        }
        Update: {
          ai_confidence?: number
          alert_type?: string
          created_at?: string | null
          escalated_to?: string | null
          id?: string
          resolution_status?: string | null
          resolved_at?: string | null
          session_id?: string | null
          severity_level?: string
          trigger_data?: Json | null
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
          risk_score: number | null
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
          risk_score?: number | null
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
          risk_score?: number | null
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
      crisis_notification_escalation: {
        Row: {
          created_at: string
          emergency_contacts_notified: boolean | null
          escalation_data: Json | null
          escalation_level: number
          id: string
          professional_notified: boolean | null
          resolved_at: string | null
          trigger_notification_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_contacts_notified?: boolean | null
          escalation_data?: Json | null
          escalation_level?: number
          id?: string
          professional_notified?: boolean | null
          resolved_at?: string | null
          trigger_notification_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_contacts_notified?: boolean | null
          escalation_data?: Json | null
          escalation_level?: number
          id?: string
          professional_notified?: boolean | null
          resolved_at?: string | null
          trigger_notification_id?: string | null
          user_id?: string
        }
        Relationships: []
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
      cultural_adaptations: {
        Row: {
          adaptation_rules: Json
          communication_style: Json | null
          created_at: string
          cultural_context: string
          emotional_expressions: Json | null
          id: string
          is_active: boolean | null
          language_code: string
          therapeutic_modifications: Json | null
          updated_at: string
        }
        Insert: {
          adaptation_rules: Json
          communication_style?: Json | null
          created_at?: string
          cultural_context: string
          emotional_expressions?: Json | null
          id?: string
          is_active?: boolean | null
          language_code: string
          therapeutic_modifications?: Json | null
          updated_at?: string
        }
        Update: {
          adaptation_rules?: Json
          communication_style?: Json | null
          created_at?: string
          cultural_context?: string
          emotional_expressions?: Json | null
          id?: string
          is_active?: boolean | null
          language_code?: string
          therapeutic_modifications?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      cultural_ai_translations: {
        Row: {
          approved_at: string | null
          content_library_id: string
          created_at: string
          cultural_adaptations: Json | null
          id: string
          language_code: string
          quality_score: number | null
          regional_variations: Json | null
          reviewed_by: string | null
          translated_content: Json
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          content_library_id: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          language_code?: string
          quality_score?: number | null
          regional_variations?: Json | null
          reviewed_by?: string | null
          translated_content: Json
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          content_library_id?: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          language_code?: string
          quality_score?: number | null
          regional_variations?: Json | null
          reviewed_by?: string | null
          translated_content?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cultural_ai_translations_content_library_id_fkey"
            columns: ["content_library_id"]
            isOneToOne: false
            referencedRelation: "cultural_content_library"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_bias_detection: {
        Row: {
          bias_indicators: string[] | null
          bias_score: number
          content_text: string
          content_type: string
          corrective_actions: string[] | null
          cultural_context: Json | null
          detected_at: string
          flagged_phrases: string[] | null
          id: string
          reviewed_by: string | null
          status: string
        }
        Insert: {
          bias_indicators?: string[] | null
          bias_score: number
          content_text: string
          content_type: string
          corrective_actions?: string[] | null
          cultural_context?: Json | null
          detected_at?: string
          flagged_phrases?: string[] | null
          id?: string
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          bias_indicators?: string[] | null
          bias_score?: number
          content_text?: string
          content_type?: string
          corrective_actions?: string[] | null
          cultural_context?: Json | null
          detected_at?: string
          flagged_phrases?: string[] | null
          id?: string
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      cultural_celebrations: {
        Row: {
          celebration_date: string
          community_activities: Json | null
          created_at: string
          cultural_origin: string
          description: string | null
          id: string
          is_recurring: boolean | null
          name: string
          recurrence_pattern: string | null
          therapeutic_themes: string[] | null
        }
        Insert: {
          celebration_date: string
          community_activities?: Json | null
          created_at?: string
          cultural_origin: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name: string
          recurrence_pattern?: string | null
          therapeutic_themes?: string[] | null
        }
        Update: {
          celebration_date?: string
          community_activities?: Json | null
          created_at?: string
          cultural_origin?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name?: string
          recurrence_pattern?: string | null
          therapeutic_themes?: string[] | null
        }
        Relationships: []
      }
      cultural_content_library: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          created_by: string | null
          cultural_backgrounds: string[]
          difficulty_level: string
          effectiveness_score: number | null
          id: string
          is_active: boolean | null
          languages: string[]
          target_audience: string[]
          therapy_approaches: string[]
          title: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string
          created_by?: string | null
          cultural_backgrounds?: string[]
          difficulty_level?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[]
          target_audience?: string[]
          therapy_approaches?: string[]
          title: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          created_by?: string | null
          cultural_backgrounds?: string[]
          difficulty_level?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[]
          target_audience?: string[]
          therapy_approaches?: string[]
          title?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      cultural_effectiveness_tracking: {
        Row: {
          adaptation_success: number
          content_id: string | null
          cultural_relevance: number
          cultural_sensitivity_score: number
          feedback_text: string | null
          id: string
          improvement_suggestions: string[] | null
          session_id: string | null
          tracked_at: string
          user_id: string
          user_satisfaction: number
        }
        Insert: {
          adaptation_success: number
          content_id?: string | null
          cultural_relevance: number
          cultural_sensitivity_score: number
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string[] | null
          session_id?: string | null
          tracked_at?: string
          user_id: string
          user_satisfaction: number
        }
        Update: {
          adaptation_success?: number
          content_id?: string | null
          cultural_relevance?: number
          cultural_sensitivity_score?: number
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string[] | null
          session_id?: string | null
          tracked_at?: string
          user_id?: string
          user_satisfaction?: number
        }
        Relationships: []
      }
      cultural_group_memberships: {
        Row: {
          cultural_compatibility_score: number | null
          group_id: string
          id: string
          is_active: boolean | null
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          cultural_compatibility_score?: number | null
          group_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          cultural_compatibility_score?: number | null
          group_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cultural_group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cultural_support_groups"
            referencedColumns: ["id"]
          },
        ]
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
      cultural_peer_matches: {
        Row: {
          accepted_at: string | null
          created_at: string
          ended_at: string | null
          id: string
          match_criteria: Json
          match_score: number
          match_type: string
          matched_user_id: string
          status: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          match_criteria: Json
          match_score: number
          match_type?: string
          matched_user_id: string
          status?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          match_criteria?: Json
          match_score?: number
          match_type?: string
          matched_user_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      cultural_support_groups: {
        Row: {
          created_at: string
          cultural_backgrounds: string[]
          current_members: number | null
          description: string | null
          facilitator_id: string | null
          group_type: string
          id: string
          is_active: boolean | null
          languages: string[]
          max_members: number | null
          meeting_schedule: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultural_backgrounds: string[]
          current_members?: number | null
          description?: string | null
          facilitator_id?: string | null
          group_type?: string
          id?: string
          is_active?: boolean | null
          languages: string[]
          max_members?: number | null
          meeting_schedule?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultural_backgrounds?: string[]
          current_members?: number | null
          description?: string | null
          facilitator_id?: string | null
          group_type?: string
          id?: string
          is_active?: boolean | null
          languages?: string[]
          max_members?: number | null
          meeting_schedule?: Json | null
          name?: string
          updated_at?: string
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
      data_deletion_requests: {
        Row: {
          completed_at: string | null
          deletion_type: string
          id: string
          reason: string | null
          requested_at: string
          retention_period_days: number | null
          scheduled_for: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          deletion_type?: string
          id?: string
          reason?: string | null
          requested_at?: string
          retention_period_days?: number | null
          scheduled_for?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          deletion_type?: string
          id?: string
          reason?: string | null
          requested_at?: string
          retention_period_days?: number | null
          scheduled_for?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          completed_at: string | null
          expires_at: string | null
          export_url: string | null
          file_size_bytes: number | null
          format: string
          id: string
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          expires_at?: string | null
          export_url?: string | null
          file_size_bytes?: number | null
          format?: string
          id?: string
          request_type?: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          expires_at?: string | null
          export_url?: string | null
          file_size_bytes?: number | null
          format?: string
          id?: string
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      digital_consents: {
        Row: {
          consent_data: Json | null
          consent_type: string
          consent_version: string
          consented_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          user_agent: string | null
          user_id: string
          withdrawal_requested_at: string | null
        }
        Insert: {
          consent_data?: Json | null
          consent_type: string
          consent_version?: string
          consented_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          user_agent?: string | null
          user_id: string
          withdrawal_requested_at?: string | null
        }
        Update: {
          consent_data?: Json | null
          consent_type?: string
          consent_version?: string
          consented_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          user_agent?: string | null
          user_id?: string
          withdrawal_requested_at?: string | null
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
      dynamic_content_translations: {
        Row: {
          approval_status: string | null
          content_id: string
          content_type: string
          created_at: string
          expires_at: string | null
          human_reviewer_id: string | null
          id: string
          localization_data: Json | null
          original_content: string
          source_language: string
          target_language: string
          translated_content: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          content_id: string
          content_type: string
          created_at?: string
          expires_at?: string | null
          human_reviewer_id?: string | null
          id?: string
          localization_data?: Json | null
          original_content: string
          source_language: string
          target_language: string
          translated_content: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          expires_at?: string | null
          human_reviewer_id?: string | null
          id?: string
          localization_data?: Json | null
          original_content?: string
          source_language?: string
          target_language?: string
          translated_content?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_ab_tests: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          name: string
          results: Json | null
          started_at: string | null
          success_metric: string
          template_key_a: string
          template_key_b: string
          test_status: string | null
          traffic_split: number | null
          winner: string | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          name: string
          results?: Json | null
          started_at?: string | null
          success_metric: string
          template_key_a: string
          template_key_b: string
          test_status?: string | null
          traffic_split?: number | null
          winner?: string | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          results?: Json | null
          started_at?: string | null
          success_metric?: string
          template_key_a?: string
          template_key_b?: string
          test_status?: string | null
          traffic_split?: number | null
          winner?: string | null
        }
        Relationships: []
      }
      email_analytics: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          email: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          template_key: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          email: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          template_key?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          email?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          template_key?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_pin_auth: {
        Row: {
          attempts: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          ip_address: unknown | null
          max_attempts: number | null
          pin_code: string
          user_agent: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          max_attempts?: number | null
          pin_code: string
          user_agent?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          max_attempts?: number | null
          pin_code?: string
          user_agent?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          language_code: string
          subject: string
          template_key: string
          text_content: string | null
          updated_at: string | null
          variables: Json | null
          version: number | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          language_code?: string
          subject: string
          template_key: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          language_code?: string
          subject?: string
          template_key?: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Relationships: []
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
      enhanced_crisis_support: {
        Row: {
          created_at: string | null
          emergency_services_contacted: boolean | null
          follow_up_scheduled: boolean | null
          id: string
          intervention_actions: Json | null
          professional_contacted: boolean | null
          resolution_status: string | null
          risk_factors: Json | null
          risk_level: string
          session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emergency_services_contacted?: boolean | null
          follow_up_scheduled?: boolean | null
          id?: string
          intervention_actions?: Json | null
          professional_contacted?: boolean | null
          resolution_status?: string | null
          risk_factors?: Json | null
          risk_level: string
          session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emergency_services_contacted?: boolean | null
          follow_up_scheduled?: boolean | null
          id?: string
          intervention_actions?: Json | null
          professional_contacted?: boolean | null
          resolution_status?: string | null
          risk_factors?: Json | null
          risk_level?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      enhanced_notification_preferences: {
        Row: {
          created_at: string | null
          educational_content: boolean | null
          email_notifications: boolean | null
          frequency_limit: number | null
          id: string
          language_preference: string | null
          marketing_emails: boolean | null
          newsletter_subscribed: boolean | null
          payment_notifications: boolean | null
          preferred_send_time: string | null
          product_updates: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          subscription_warnings: boolean | null
          timezone: string | null
          unsubscribe_categories: string[] | null
          updated_at: string | null
          upsell_offers: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          educational_content?: boolean | null
          email_notifications?: boolean | null
          frequency_limit?: number | null
          id?: string
          language_preference?: string | null
          marketing_emails?: boolean | null
          newsletter_subscribed?: boolean | null
          payment_notifications?: boolean | null
          preferred_send_time?: string | null
          product_updates?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          subscription_warnings?: boolean | null
          timezone?: string | null
          unsubscribe_categories?: string[] | null
          updated_at?: string | null
          upsell_offers?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          educational_content?: boolean | null
          email_notifications?: boolean | null
          frequency_limit?: number | null
          id?: string
          language_preference?: string | null
          marketing_emails?: boolean | null
          newsletter_subscribed?: boolean | null
          payment_notifications?: boolean | null
          preferred_send_time?: string | null
          product_updates?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          subscription_warnings?: boolean | null
          timezone?: string | null
          unsubscribe_categories?: string[] | null
          updated_at?: string | null
          upsell_offers?: boolean | null
          user_id?: string
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
      european_cultural_contexts: {
        Row: {
          communication_style: string
          country_code: string
          country_name: string
          created_at: string
          crisis_support_info: Json
          cultural_profile: Json
          family_structure_importance: string
          id: string
          language_code: string
          mental_health_stigma_level: string
          privacy_expectations: string
          therapy_preferences: Json
          updated_at: string
        }
        Insert: {
          communication_style?: string
          country_code: string
          country_name: string
          created_at?: string
          crisis_support_info?: Json
          cultural_profile?: Json
          family_structure_importance?: string
          id?: string
          language_code: string
          mental_health_stigma_level?: string
          privacy_expectations?: string
          therapy_preferences?: Json
          updated_at?: string
        }
        Update: {
          communication_style?: string
          country_code?: string
          country_name?: string
          created_at?: string
          crisis_support_info?: Json
          cultural_profile?: Json
          family_structure_importance?: string
          id?: string
          language_code?: string
          mental_health_stigma_level?: string
          privacy_expectations?: string
          therapy_preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      european_translation_memory: {
        Row: {
          context_type: string
          created_at: string
          cultural_adaptations: Json | null
          id: string
          last_used_at: string | null
          quality_score: number | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_category: string | null
          translated_text: string
          translation_provider: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          context_type?: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          last_used_at?: string | null
          quality_score?: number | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_category?: string | null
          translated_text: string
          translation_provider?: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          context_type?: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          last_used_at?: string | null
          quality_score?: number | null
          source_language?: string
          source_text?: string
          target_language?: string
          therapeutic_category?: string | null
          translated_text?: string
          translation_provider?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          attendance_status: string | null
          event_id: string
          feedback_comment: string | null
          feedback_rating: number | null
          id: string
          registration_date: string
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          event_id: string
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          registration_date?: string
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          event_id?: string
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          registration_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
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
      failed_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          next_retry_at: string | null
          resolved_at: string | null
          retry_count: number | null
          stripe_invoice_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          next_retry_at?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          next_retry_at?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "failed_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
      family_integration_profiles: {
        Row: {
          created_at: string
          cultural_decision_making: string | null
          cultural_family_roles: Json | null
          emergency_family_contact: string | null
          family_involvement_level: string
          family_members: Json | null
          family_therapy_consent: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultural_decision_making?: string | null
          cultural_family_roles?: Json | null
          emergency_family_contact?: string | null
          family_involvement_level?: string
          family_members?: Json | null
          family_therapy_consent?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultural_decision_making?: string | null
          cultural_family_roles?: Json | null
          emergency_family_contact?: string | null
          family_involvement_level?: string
          family_members?: Json | null
          family_therapy_consent?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      footer_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: string
          created_at: string | null
          id: string
          is_active: boolean | null
          language_code: string | null
          updated_at: string | null
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language_code?: string | null
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          created_at: string | null
          href: string
          icon: string | null
          id: string
          is_active: boolean | null
          opens_in_new_tab: boolean | null
          position: number
          section_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          opens_in_new_tab?: boolean | null
          position?: number
          section_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          opens_in_new_tab?: boolean | null
          position?: number
          section_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "footer_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_sections: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      global_cultural_contexts: {
        Row: {
          communication_style: string
          country_code: string
          country_name: string
          created_at: string
          crisis_support_info: Json
          cultural_profile: Json
          family_structure_importance: string
          id: string
          is_active: boolean
          language_code: string
          mental_health_stigma_level: string
          privacy_expectations: string
          region: string
          religious_cultural_factors: Json
          therapy_preferences: Json
          updated_at: string
        }
        Insert: {
          communication_style?: string
          country_code: string
          country_name: string
          created_at?: string
          crisis_support_info?: Json
          cultural_profile?: Json
          family_structure_importance?: string
          id?: string
          is_active?: boolean
          language_code: string
          mental_health_stigma_level?: string
          privacy_expectations?: string
          region: string
          religious_cultural_factors?: Json
          therapy_preferences?: Json
          updated_at?: string
        }
        Update: {
          communication_style?: string
          country_code?: string
          country_name?: string
          created_at?: string
          crisis_support_info?: Json
          cultural_profile?: Json
          family_structure_importance?: string
          id?: string
          is_active?: boolean
          language_code?: string
          mental_health_stigma_level?: string
          privacy_expectations?: string
          region?: string
          religious_cultural_factors?: Json
          therapy_preferences?: Json
          updated_at?: string
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
      global_translation_memory: {
        Row: {
          context_type: string
          created_at: string
          cultural_adaptations: Json | null
          id: string
          quality_score: number | null
          session_id: string | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_category: string | null
          translated_text: string
          updated_at: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          context_type?: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          quality_score?: number | null
          session_id?: string | null
          source_language: string
          source_text: string
          target_language: string
          therapeutic_category?: string | null
          translated_text: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          context_type?: string
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          quality_score?: number | null
          session_id?: string | null
          source_language?: string
          source_text?: string
          target_language?: string
          therapeutic_category?: string | null
          translated_text?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
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
      integration_webhooks: {
        Row: {
          created_at: string
          event_types: string[] | null
          id: string
          integration_id: string
          is_active: boolean | null
          last_triggered: string | null
          webhook_secret: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string
          event_types?: string[] | null
          id?: string
          integration_id: string
          is_active?: boolean | null
          last_triggered?: string | null
          webhook_secret?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string
          event_types?: string[] | null
          id?: string
          integration_id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          webhook_secret?: string | null
          webhook_url?: string
        }
        Relationships: []
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
      intelligent_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          priority?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_subtotal: number
          amount_tax: number | null
          amount_total: number
          billing_address: Json | null
          created_at: string
          currency: string
          id: string
          invoice_date: string
          invoice_number: string
          line_items: Json
          paid_at: string | null
          payment_due_date: string | null
          pdf_url: string | null
          sent_at: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          tax_country: string | null
          tax_rate: number | null
          tax_type: string | null
          updated_at: string
          user_id: string | null
          voided_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_tax?: number | null
          amount_total: number
          billing_address?: Json | null
          created_at?: string
          currency?: string
          id?: string
          invoice_date?: string
          invoice_number: string
          line_items?: Json
          paid_at?: string | null
          payment_due_date?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          tax_country?: string | null
          tax_rate?: number | null
          tax_type?: string | null
          updated_at?: string
          user_id?: string | null
          voided_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_tax?: number | null
          amount_total?: number
          billing_address?: Json | null
          created_at?: string
          currency?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          line_items?: Json
          paid_at?: string | null
          payment_due_date?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          tax_country?: string | null
          tax_rate?: number | null
          tax_type?: string | null
          updated_at?: string
          user_id?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_items: {
        Row: {
          category: string
          content: string
          created_at: string
          difficulty_level: string
          id: string
          is_premium: boolean
          tags: string[] | null
          title: string
          unlock_requirements: Json | null
          xp_value: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          difficulty_level?: string
          id?: string
          is_premium?: boolean
          tags?: string[] | null
          title: string
          unlock_requirements?: Json | null
          xp_value?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          difficulty_level?: string
          id?: string
          is_premium?: boolean
          tags?: string[] | null
          title?: string
          unlock_requirements?: Json | null
          xp_value?: number
        }
        Relationships: []
      }
      live_analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          processed: boolean | null
          processing_result: Json | null
          requires_intervention: boolean | null
          session_id: string | null
          severity_level: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed?: boolean | null
          processing_result?: Json | null
          requires_intervention?: boolean | null
          session_id?: string | null
          severity_level?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processing_result?: Json | null
          requires_intervention?: boolean | null
          session_id?: string | null
          severity_level?: string | null
          timestamp?: string | null
          user_id?: string
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
      mfa_recovery_attempts: {
        Row: {
          attempt_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          attempt_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          attempt_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mfa_trusted_devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_name: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_used_at: string | null
          trust_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_name: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_used_at?: string | null
          trust_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_name?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_used_at?: string | null
          trust_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      model_performance_tracking: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string
          date: string
          failed_requests: number | null
          id: string
          model_id: string
          provider: string
          quality_score: number | null
          successful_requests: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          user_satisfaction_score: number | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          created_at?: string
          date: string
          failed_requests?: number | null
          id?: string
          model_id: string
          provider: string
          quality_score?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          user_satisfaction_score?: number | null
        }
        Update: {
          avg_response_time_ms?: number | null
          created_at?: string
          date?: string
          failed_requests?: number | null
          id?: string
          model_id?: string
          provider?: string
          quality_score?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          user_satisfaction_score?: number | null
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
      mood_pulse_checks: {
        Row: {
          check_type: string
          context_notes: string | null
          created_at: string | null
          emotional_state: Json | null
          id: string
          mood_score: number | null
          responded_at: string | null
          user_id: string
        }
        Insert: {
          check_type: string
          context_notes?: string | null
          created_at?: string | null
          emotional_state?: Json | null
          id?: string
          mood_score?: number | null
          responded_at?: string | null
          user_id: string
        }
        Update: {
          check_type?: string
          context_notes?: string | null
          created_at?: string | null
          emotional_state?: Json | null
          id?: string
          mood_score?: number | null
          responded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      navigation_menu_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          label: string
          menu_id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          label: string
          menu_id: string
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          label?: string
          menu_id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_categories_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "navigation_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_menu_items: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string | null
          description: string
          gradient: string
          href: string
          icon: string
          id: string
          is_active: boolean
          menu_id: string
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description: string
          gradient: string
          href: string
          icon: string
          id?: string
          is_active?: boolean
          menu_id: string
          position?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string
          gradient?: string
          href?: string
          icon?: string
          id?: string
          is_active?: boolean
          menu_id?: string
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "navigation_menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "navigation_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_menus: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          is_active: boolean
          label: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon: string
          id?: string
          is_active?: boolean
          label: string
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          position?: number
          updated_at?: string | null
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
      newsletter_campaigns: {
        Row: {
          a_b_test_config: Json | null
          analytics_data: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          segmentation_rules: Json | null
          send_at: string | null
          status: string | null
          subject: string
          target_audience: Json | null
          template_key: string
          updated_at: string | null
        }
        Insert: {
          a_b_test_config?: Json | null
          analytics_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          segmentation_rules?: Json | null
          send_at?: string | null
          status?: string | null
          subject: string
          target_audience?: Json | null
          template_key: string
          updated_at?: string | null
        }
        Update: {
          a_b_test_config?: Json | null
          analytics_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          segmentation_rules?: Json | null
          send_at?: string | null
          status?: string | null
          subject?: string
          target_audience?: Json | null
          template_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_ab_assignments: {
        Row: {
          assigned_at: string | null
          conversion_data: Json | null
          converted: boolean | null
          id: string
          test_id: string | null
          user_id: string | null
          variant: string
        }
        Insert: {
          assigned_at?: string | null
          conversion_data?: Json | null
          converted?: boolean | null
          id?: string
          test_id?: string | null
          user_id?: string | null
          variant: string
        }
        Update: {
          assigned_at?: string | null
          conversion_data?: Json | null
          converted?: boolean | null
          id?: string
          test_id?: string | null
          user_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_ab_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "notification_ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_ab_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_sample_size: number | null
          ended_at: string | null
          id: string
          notification_type: string
          results: Json | null
          started_at: string | null
          status: string | null
          success_metric: string
          target_sample_size: number | null
          test_name: string
          traffic_split: number | null
          variant_a: Json
          variant_b: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_sample_size?: number | null
          ended_at?: string | null
          id?: string
          notification_type: string
          results?: Json | null
          started_at?: string | null
          status?: string | null
          success_metric: string
          target_sample_size?: number | null
          test_name: string
          traffic_split?: number | null
          variant_a: Json
          variant_b: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_sample_size?: number | null
          ended_at?: string | null
          id?: string
          notification_type?: string
          results?: Json | null
          started_at?: string | null
          status?: string | null
          success_metric?: string
          target_sample_size?: number | null
          test_name?: string
          traffic_split?: number | null
          variant_a?: Json
          variant_b?: Json
        }
        Relationships: []
      }
      notification_analytics: {
        Row: {
          created_at: string
          delivery_method: string
          event_type: string
          id: string
          metadata: Json | null
          notification_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_method: string
          event_type: string
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_method?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_automation_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          effectiveness_threshold: number | null
          frequency_limits: Json | null
          id: string
          is_active: boolean | null
          notification_config: Json
          rule_name: string
          target_criteria: Json
          trigger_conditions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          effectiveness_threshold?: number | null
          frequency_limits?: Json | null
          id?: string
          is_active?: boolean | null
          notification_config: Json
          rule_name: string
          target_criteria: Json
          trigger_conditions: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          effectiveness_threshold?: number | null
          frequency_limits?: Json | null
          id?: string
          is_active?: boolean | null
          notification_config?: Json
          rule_name?: string
          target_criteria?: Json
          trigger_conditions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_campaigns: {
        Row: {
          campaign_type: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metrics: Json | null
          name: string
          notification_sequence: Json
          personalization_rules: Json | null
          scheduling: Json
          started_at: string | null
          status: string | null
          target_audience: Json
          updated_at: string | null
        }
        Insert: {
          campaign_type: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name: string
          notification_sequence: Json
          personalization_rules?: Json | null
          scheduling: Json
          started_at?: string | null
          status?: string | null
          target_audience: Json
          updated_at?: string | null
        }
        Update: {
          campaign_type?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          notification_sequence?: Json
          personalization_rules?: Json | null
          scheduling?: Json
          started_at?: string | null
          status?: string | null
          target_audience?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_context: {
        Row: {
          context_data: Json
          context_type: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          context_data?: Json
          context_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          context_data?: Json
          context_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
      notification_deliveries: {
        Row: {
          clicked_at: string | null
          created_at: string
          delivered_at: string | null
          delivery_method: string
          error_message: string | null
          external_message_id: string | null
          id: string
          notification_id: string
          platform_integration_id: string | null
          status: string
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_method: string
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          notification_id: string
          platform_integration_id?: string | null
          status?: string
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_method?: string
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          notification_id?: string
          platform_integration_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_intelligence: {
        Row: {
          confidence_score: number | null
          created_at: string
          delivery_preferences: Json | null
          engagement_patterns: Json | null
          id: string
          last_calculated_at: string | null
          optimal_send_times: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          delivery_preferences?: Json | null
          engagement_patterns?: Json | null
          id?: string
          last_calculated_at?: string | null
          optimal_send_times?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          delivery_preferences?: Json | null
          engagement_patterns?: Json | null
          id?: string
          last_calculated_at?: string | null
          optimal_send_times?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_orchestration_logs: {
        Row: {
          channel_sequence: Json
          created_at: string | null
          delivery_attempts: Json | null
          final_status: string
          id: string
          notification_id: string | null
          optimization_data: Json | null
          orchestration_strategy: string
          total_delivery_time_ms: number | null
        }
        Insert: {
          channel_sequence: Json
          created_at?: string | null
          delivery_attempts?: Json | null
          final_status: string
          id?: string
          notification_id?: string | null
          optimization_data?: Json | null
          orchestration_strategy: string
          total_delivery_time_ms?: number | null
        }
        Update: {
          channel_sequence?: Json
          created_at?: string | null
          delivery_attempts?: Json | null
          final_status?: string
          id?: string
          notification_id?: string | null
          optimization_data?: Json | null
          orchestration_strategy?: string
          total_delivery_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_orchestration_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_performance_analytics: {
        Row: {
          cohort_data: Json | null
          conversion_data: Json | null
          delivery_performance: Json | null
          engagement_metrics: Json | null
          id: string
          notification_id: string | null
          recorded_at: string | null
          sentiment_analysis: Json | null
          user_segment: Json | null
        }
        Insert: {
          cohort_data?: Json | null
          conversion_data?: Json | null
          delivery_performance?: Json | null
          engagement_metrics?: Json | null
          id?: string
          notification_id?: string | null
          recorded_at?: string | null
          sentiment_analysis?: Json | null
          user_segment?: Json | null
        }
        Update: {
          cohort_data?: Json | null
          conversion_data?: Json | null
          delivery_performance?: Json | null
          engagement_metrics?: Json | null
          id?: string
          notification_id?: string | null
          recorded_at?: string | null
          sentiment_analysis?: Json | null
          user_segment?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_performance_analytics_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
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
      notification_queue: {
        Row: {
          created_at: string
          data: Json | null
          delivery_methods: string[]
          id: string
          message: string
          priority: string
          processed_at: string | null
          retry_count: number
          scheduled_for: string
          status: string
          template_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          delivery_methods?: string[]
          id?: string
          message: string
          priority?: string
          processed_at?: string | null
          retry_count?: number
          scheduled_for?: string
          status?: string
          template_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          delivery_methods?: string[]
          id?: string
          message?: string
          priority?: string
          processed_at?: string | null
          retry_count?: number
          scheduled_for?: string
          status?: string
          template_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_routing_rules: {
        Row: {
          channels: string[]
          conditions: Json | null
          created_at: string
          id: string
          is_active: boolean
          notification_type: string
          priority: string
          updated_at: string
        }
        Insert: {
          channels?: string[]
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          notification_type: string
          priority: string
          updated_at?: string
        }
        Update: {
          channels?: string[]
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          notification_type?: string
          priority?: string
          updated_at?: string
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
      notification_types: {
        Row: {
          category: string
          created_at: string
          delivery_methods: string[] | null
          id: string
          is_active: boolean | null
          name: string
          priority_weight: number | null
          template_variables: string[] | null
        }
        Insert: {
          category: string
          created_at?: string
          delivery_methods?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          priority_weight?: number | null
          template_variables?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          delivery_methods?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority_weight?: number | null
          template_variables?: string[] | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_buttons: Json | null
          created_at: string
          data: Json | null
          deep_link_url: string | null
          delivery_channels: string[] | null
          expires_at: string | null
          id: string
          interaction_data: Json | null
          is_read: boolean
          is_sticky: boolean | null
          last_updated: string | null
          message: string
          notification_key: string | null
          personalization_score: number | null
          priority: string
          rich_content: Json | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_buttons?: Json | null
          created_at?: string
          data?: Json | null
          deep_link_url?: string | null
          delivery_channels?: string[] | null
          expires_at?: string | null
          id?: string
          interaction_data?: Json | null
          is_read?: boolean
          is_sticky?: boolean | null
          last_updated?: string | null
          message: string
          notification_key?: string | null
          personalization_score?: number | null
          priority?: string
          rich_content?: Json | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_buttons?: Json | null
          created_at?: string
          data?: Json | null
          deep_link_url?: string | null
          delivery_channels?: string[] | null
          expires_at?: string | null
          id?: string
          interaction_data?: Json | null
          is_read?: boolean
          is_sticky?: boolean | null
          last_updated?: string | null
          message?: string
          notification_key?: string | null
          personalization_score?: number | null
          priority?: string
          rich_content?: Json | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_problem_categories: {
        Row: {
          category_name: string
          created_at: string
          id: string
          is_active: boolean | null
          related_therapists: string[] | null
          subcategories: string[]
        }
        Insert: {
          category_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          related_therapists?: string[] | null
          subcategories: string[]
        }
        Update: {
          category_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          related_therapists?: string[] | null
          subcategories?: string[]
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          bank_account_last4: string | null
          bank_account_type: string | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_payment_method_id: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bank_account_last4?: string | null
          bank_account_type?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bank_account_last4?: string | null
          bank_account_type?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id?: string
          type?: string
          updated_at?: string
          user_id?: string | null
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
      personality_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_data: Json
          interaction_type: string
          is_active: boolean | null
          therapist_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_data?: Json
          interaction_type: string
          is_active?: boolean | null
          therapist_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_data?: Json
          interaction_type?: string
          is_active?: boolean | null
          therapist_id?: string
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
      platform_integrations: {
        Row: {
          access_tokens: Json | null
          created_at: string
          crisis_escalation_enabled: boolean | null
          id: string
          integration_settings: Json | null
          is_active: boolean | null
          last_sync: string | null
          platform_type: string
          platform_user_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_tokens?: Json | null
          created_at?: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          integration_settings?: Json | null
          is_active?: boolean | null
          last_sync?: string | null
          platform_type: string
          platform_user_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_tokens?: Json | null
          created_at?: string
          crisis_escalation_enabled?: boolean | null
          id?: string
          integration_settings?: Json | null
          is_active?: boolean | null
          last_sync?: string | null
          platform_type?: string
          platform_user_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_interactions: {
        Row: {
          comment_text: string | null
          created_at: string
          id: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Insert: {
          comment_text?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          post_id: string
          user_id: string
        }
        Update: {
          comment_text?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_preferences: {
        Row: {
          analytics_consent: boolean | null
          communication_preferences: Json | null
          cookie_preferences: Json | null
          created_at: string
          data_retention_period: string | null
          id: string
          marketing_consent: boolean | null
          third_party_sharing: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_consent?: boolean | null
          communication_preferences?: Json | null
          cookie_preferences?: Json | null
          created_at?: string
          data_retention_period?: string | null
          id?: string
          marketing_consent?: boolean | null
          third_party_sharing?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_consent?: boolean | null
          communication_preferences?: Json | null
          cookie_preferences?: Json | null
          created_at?: string
          data_retention_period?: string | null
          id?: string
          marketing_consent?: boolean | null
          third_party_sharing?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proactive_care_triggers: {
        Row: {
          care_action: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          message_template: string
          trigger_condition: Json | null
          trigger_date: string | null
          trigger_type: string
          user_id: string
        }
        Insert: {
          care_action: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          message_template: string
          trigger_condition?: Json | null
          trigger_date?: string | null
          trigger_type: string
          user_id: string
        }
        Update: {
          care_action?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          message_template?: string
          trigger_condition?: Json | null
          trigger_date?: string | null
          trigger_type?: string
          user_id?: string
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
          detected_country_code: string | null
          detection_confidence: number | null
          email: string
          id: string
          name: string
          onboarding_complete: boolean | null
          phone: string | null
          plan: string | null
          preferred_country_code: string | null
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
          detected_country_code?: string | null
          detection_confidence?: number | null
          email: string
          id: string
          name: string
          onboarding_complete?: boolean | null
          phone?: string | null
          plan?: string | null
          preferred_country_code?: string | null
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
          detected_country_code?: string | null
          detection_confidence?: number | null
          email?: string
          id?: string
          name?: string
          onboarding_complete?: boolean | null
          phone?: string | null
          plan?: string | null
          preferred_country_code?: string | null
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
      progress_milestones: {
        Row: {
          achieved_at: string | null
          celebration_shown: boolean | null
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          milestone_type: string
          points_earned: number | null
          target_value: number | null
          title: string
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          celebration_shown?: boolean | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          milestone_type: string
          points_earned?: number | null
          target_value?: number | null
          title: string
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          celebration_shown?: boolean | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          milestone_type?: string
          points_earned?: number | null
          target_value?: number | null
          title?: string
          user_id?: string
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
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh_key: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh_key: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh_key?: string
          updated_at?: string
          user_agent?: string | null
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
      real_time_session_analytics: {
        Row: {
          analysis_timestamp: string | null
          approach_recommendations: Json | null
          breakthrough_moments: Json | null
          created_at: string | null
          crisis_indicators: Json | null
          emotion_scores: Json | null
          engagement_metrics: Json | null
          id: string
          intervention_needed: boolean | null
          session_id: string
          session_quality_score: number | null
          technique_effectiveness: Json | null
          user_id: string
        }
        Insert: {
          analysis_timestamp?: string | null
          approach_recommendations?: Json | null
          breakthrough_moments?: Json | null
          created_at?: string | null
          crisis_indicators?: Json | null
          emotion_scores?: Json | null
          engagement_metrics?: Json | null
          id?: string
          intervention_needed?: boolean | null
          session_id: string
          session_quality_score?: number | null
          technique_effectiveness?: Json | null
          user_id: string
        }
        Update: {
          analysis_timestamp?: string | null
          approach_recommendations?: Json | null
          breakthrough_moments?: Json | null
          created_at?: string | null
          crisis_indicators?: Json | null
          emotion_scores?: Json | null
          engagement_metrics?: Json | null
          id?: string
          intervention_needed?: boolean | null
          session_id?: string
          session_quality_score?: number | null
          technique_effectiveness?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      realtime_translation_sessions: {
        Row: {
          avg_response_time_ms: number | null
          cultural_context: Json | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          quality_score: number | null
          session_id: string
          source_language: string
          started_at: string
          target_language: string
          translation_count: number | null
          user_id: string | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          cultural_context?: Json | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          quality_score?: number | null
          session_id: string
          source_language: string
          started_at?: string
          target_language: string
          translation_count?: number | null
          user_id?: string | null
        }
        Update: {
          avg_response_time_ms?: number | null
          cultural_context?: Json | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          quality_score?: number | null
          session_id?: string
          source_language?: string
          started_at?: string
          target_language?: string
          translation_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      regional_pricing: {
        Row: {
          base_price: number
          country_code: string
          created_at: string
          currency_code: string
          id: string
          is_active: boolean
          price_tier: string
          regional_multiplier: number
          updated_at: string
        }
        Insert: {
          base_price: number
          country_code: string
          created_at?: string
          currency_code: string
          id?: string
          is_active?: boolean
          price_tier: string
          regional_multiplier?: number
          updated_at?: string
        }
        Update: {
          base_price?: number
          country_code?: string
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          price_tier?: string
          regional_multiplier?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regional_pricing_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["country_code"]
          },
        ]
      }
      regional_pricing_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          evidence: Json
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          evidence: Json
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          evidence?: Json
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id?: string
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
      scheduled_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_recurring: boolean
          notes: string | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          reminder_sent: boolean
          scheduled_for: string
          session_type: string
          status: string
          therapist_id: string
          therapy_plan_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_recurring?: boolean
          notes?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_sent?: boolean
          scheduled_for: string
          session_type?: string
          status?: string
          therapist_id: string
          therapy_plan_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_recurring?: boolean
          notes?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_sent?: boolean
          scheduled_for?: string
          session_type?: string
          status?: string
          therapist_id?: string
          therapy_plan_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_sessions_therapy_plan_id_fkey"
            columns: ["therapy_plan_id"]
            isOneToOne: false
            referencedRelation: "therapy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          description: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          description: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          compliance_category: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          risk_level: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          compliance_category?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          compliance_category?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_configs: {
        Row: {
          config_key: string
          config_type: string
          config_value: Json
          created_at: string | null
          created_by: string | null
          id: string
          is_global: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config_key: string
          config_type: string
          config_value: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_global?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config_key?: string
          config_type?: string
          config_value?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_global?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      security_incidents: {
        Row: {
          affected_users_count: number | null
          description: string
          detected_at: string
          detection_method: string | null
          id: string
          incident_type: string
          metadata: Json | null
          resolved_at: string | null
          response_actions: Json | null
          severity: string
          status: string
        }
        Insert: {
          affected_users_count?: number | null
          description: string
          detected_at?: string
          detection_method?: string | null
          id?: string
          incident_type: string
          metadata?: Json | null
          resolved_at?: string | null
          response_actions?: Json | null
          severity?: string
          status?: string
        }
        Update: {
          affected_users_count?: number | null
          description?: string
          detected_at?: string
          detection_method?: string | null
          id?: string
          incident_type?: string
          metadata?: Json | null
          resolved_at?: string | null
          response_actions?: Json | null
          severity?: string
          status?: string
        }
        Relationships: []
      }
      seo_translations: {
        Row: {
          canonical_url: string | null
          created_at: string
          created_by: string | null
          hreflang_data: Json | null
          id: string
          is_active: boolean
          language_code: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_key: string
          schema_data: Json | null
          twitter_description: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          hreflang_data?: Json | null
          id?: string
          is_active?: boolean
          language_code: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key: string
          schema_data?: Json | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          hreflang_data?: Json | null
          id?: string
          is_active?: boolean
          language_code?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key?: string
          schema_data?: Json | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
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
      session_assessments: {
        Row: {
          additional_feedback: string | null
          ai_insights: string | null
          assessment_score: number | null
          assessment_type: string
          breakthrough_moments: string | null
          challenges_discussed: string[] | null
          completed_at: string
          confidence_level: number | null
          created_at: string
          current_mood: number | null
          current_symptoms: string[] | null
          emotional_state: string | null
          energy_level: number | null
          homework_assigned: string[] | null
          id: string
          life_events: string | null
          main_concerns: string[] | null
          medication_changes: boolean | null
          next_session_goals: string[] | null
          overall_satisfaction: number | null
          responses: Json
          session_goals: string[] | null
          session_helpfulness: number | null
          session_id: string | null
          sleep_quality: number | null
          stress_level: number | null
          techniques_learned: string[] | null
          therapist_connection: number | null
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          additional_feedback?: string | null
          ai_insights?: string | null
          assessment_score?: number | null
          assessment_type: string
          breakthrough_moments?: string | null
          challenges_discussed?: string[] | null
          completed_at?: string
          confidence_level?: number | null
          created_at?: string
          current_mood?: number | null
          current_symptoms?: string[] | null
          emotional_state?: string | null
          energy_level?: number | null
          homework_assigned?: string[] | null
          id?: string
          life_events?: string | null
          main_concerns?: string[] | null
          medication_changes?: boolean | null
          next_session_goals?: string[] | null
          overall_satisfaction?: number | null
          responses?: Json
          session_goals?: string[] | null
          session_helpfulness?: number | null
          session_id?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          techniques_learned?: string[] | null
          therapist_connection?: number | null
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          additional_feedback?: string | null
          ai_insights?: string | null
          assessment_score?: number | null
          assessment_type?: string
          breakthrough_moments?: string | null
          challenges_discussed?: string[] | null
          completed_at?: string
          confidence_level?: number | null
          created_at?: string
          current_mood?: number | null
          current_symptoms?: string[] | null
          emotional_state?: string | null
          energy_level?: number | null
          homework_assigned?: string[] | null
          id?: string
          life_events?: string | null
          main_concerns?: string[] | null
          medication_changes?: boolean | null
          next_session_goals?: string[] | null
          overall_satisfaction?: number | null
          responses?: Json
          session_goals?: string[] | null
          session_helpfulness?: number | null
          session_id?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          techniques_learned?: string[] | null
          therapist_connection?: number | null
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      session_avatar_interactions: {
        Row: {
          emotion_data: Json | null
          id: string
          interaction_timestamp: string
          interaction_type: string
          session_id: string
          therapist_avatar_state: Json | null
          user_avatar_state: Json | null
          user_id: string
        }
        Insert: {
          emotion_data?: Json | null
          id?: string
          interaction_timestamp?: string
          interaction_type: string
          session_id: string
          therapist_avatar_state?: Json | null
          user_avatar_state?: Json | null
          user_id: string
        }
        Update: {
          emotion_data?: Json | null
          id?: string
          interaction_timestamp?: string
          interaction_type?: string
          session_id?: string
          therapist_avatar_state?: Json | null
          user_avatar_state?: Json | null
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
      session_continuity: {
        Row: {
          created_at: string | null
          emotional_state_carry_over: Json | null
          follow_up_needed: boolean | null
          id: string
          previous_session_id: string | null
          session_id: string
          transition_context: Json | null
          unresolved_topics: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotional_state_carry_over?: Json | null
          follow_up_needed?: boolean | null
          id?: string
          previous_session_id?: string | null
          session_id: string
          transition_context?: Json | null
          unresolved_topics?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotional_state_carry_over?: Json | null
          follow_up_needed?: boolean | null
          id?: string
          previous_session_id?: string | null
          session_id?: string
          transition_context?: Json | null
          unresolved_topics?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      session_crisis_monitoring: {
        Row: {
          created_at: string | null
          crisis_indicators: Json | null
          crisis_level: string | null
          escalation_actions: Json | null
          escalation_triggered: boolean | null
          id: string
          intervention_protocols: Json | null
          monitoring_frequency: number | null
          risk_assessment_score: number | null
          safety_plan_activated: boolean | null
          safety_plan_details: Json | null
          session_id: string
          updated_at: string | null
          user_id: string
          validation_layers: Json | null
        }
        Insert: {
          created_at?: string | null
          crisis_indicators?: Json | null
          crisis_level?: string | null
          escalation_actions?: Json | null
          escalation_triggered?: boolean | null
          id?: string
          intervention_protocols?: Json | null
          monitoring_frequency?: number | null
          risk_assessment_score?: number | null
          safety_plan_activated?: boolean | null
          safety_plan_details?: Json | null
          session_id: string
          updated_at?: string | null
          user_id: string
          validation_layers?: Json | null
        }
        Update: {
          created_at?: string | null
          crisis_indicators?: Json | null
          crisis_level?: string | null
          escalation_actions?: Json | null
          escalation_triggered?: boolean | null
          id?: string
          intervention_protocols?: Json | null
          monitoring_frequency?: number | null
          risk_assessment_score?: number | null
          safety_plan_activated?: boolean | null
          safety_plan_details?: Json | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
          validation_layers?: Json | null
        }
        Relationships: []
      }
      session_cultural_adaptations: {
        Row: {
          adaptation_effectiveness: number | null
          communication_style_adaptations: Json | null
          created_at: string | null
          cultural_profile: Json | null
          family_system_considerations: Json | null
          id: string
          language_cultural_considerations: Json | null
          religious_spiritual_integration: Json | null
          session_id: string
          technique_cultural_modifications: Json | null
          trauma_informed_adaptations: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adaptation_effectiveness?: number | null
          communication_style_adaptations?: Json | null
          created_at?: string | null
          cultural_profile?: Json | null
          family_system_considerations?: Json | null
          id?: string
          language_cultural_considerations?: Json | null
          religious_spiritual_integration?: Json | null
          session_id: string
          technique_cultural_modifications?: Json | null
          trauma_informed_adaptations?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adaptation_effectiveness?: number | null
          communication_style_adaptations?: Json | null
          created_at?: string | null
          cultural_profile?: Json | null
          family_system_considerations?: Json | null
          id?: string
          language_cultural_considerations?: Json | null
          religious_spiritual_integration?: Json | null
          session_id?: string
          technique_cultural_modifications?: Json | null
          trauma_informed_adaptations?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_feedback: {
        Row: {
          comfort_rating: number
          communication_rating: number
          created_at: string
          effectiveness_rating: number
          feedback_text: string | null
          id: string
          improvement_suggestions: string | null
          mood_after: number | null
          mood_before: number | null
          overall_rating: number
          session_date: string
          session_helpful: boolean | null
          session_id: string
          therapist_id: string | null
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          comfort_rating: number
          communication_rating: number
          created_at?: string
          effectiveness_rating: number
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string | null
          mood_after?: number | null
          mood_before?: number | null
          overall_rating: number
          session_date: string
          session_helpful?: boolean | null
          session_id: string
          therapist_id?: string | null
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          comfort_rating?: number
          communication_rating?: number
          created_at?: string
          effectiveness_rating?: number
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string | null
          mood_after?: number | null
          mood_before?: number | null
          overall_rating?: number
          session_date?: string
          session_helpful?: boolean | null
          session_id?: string
          therapist_id?: string | null
          user_id?: string
          would_recommend?: boolean | null
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
      session_key_moments: {
        Row: {
          content_summary: string
          created_at: string
          emotional_context: Json
          id: string
          importance_score: number
          moment_type: string
          session_id: string
          tags: Json
          timestamp_end: number
          timestamp_start: number
          user_id: string
        }
        Insert: {
          content_summary: string
          created_at?: string
          emotional_context?: Json
          id?: string
          importance_score?: number
          moment_type: string
          session_id: string
          tags?: Json
          timestamp_end: number
          timestamp_start: number
          user_id: string
        }
        Update: {
          content_summary?: string
          created_at?: string
          emotional_context?: Json
          id?: string
          importance_score?: number
          moment_type?: string
          session_id?: string
          tags?: Json
          timestamp_end?: number
          timestamp_start?: number
          user_id?: string
        }
        Relationships: []
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
      session_orchestration: {
        Row: {
          actual_phase_duration: number | null
          breakthrough_moments: Json | null
          conversation_flow_score: number | null
          created_at: string | null
          current_phase: string
          emotional_state_tracking: Json | null
          expected_phase_duration: number
          id: string
          intervention_effectiveness: number | null
          intervention_history: Json | null
          phase_start_time: string
          session_extensions: Json | null
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_phase_duration?: number | null
          breakthrough_moments?: Json | null
          conversation_flow_score?: number | null
          created_at?: string | null
          current_phase: string
          emotional_state_tracking?: Json | null
          expected_phase_duration?: number
          id?: string
          intervention_effectiveness?: number | null
          intervention_history?: Json | null
          phase_start_time?: string
          session_extensions?: Json | null
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_phase_duration?: number | null
          breakthrough_moments?: Json | null
          conversation_flow_score?: number | null
          created_at?: string | null
          current_phase?: string
          emotional_state_tracking?: Json | null
          expected_phase_duration?: number
          id?: string
          intervention_effectiveness?: number | null
          intervention_history?: Json | null
          phase_start_time?: string
          session_extensions?: Json | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_preparations: {
        Row: {
          ai_config: Json
          created_at: string
          id: string
          preparation_data: Json
          risk_assessment: Json
          session_id: string
          user_id: string
        }
        Insert: {
          ai_config?: Json
          created_at?: string
          id?: string
          preparation_data?: Json
          risk_assessment?: Json
          session_id: string
          user_id: string
        }
        Update: {
          ai_config?: Json
          created_at?: string
          id?: string
          preparation_data?: Json
          risk_assessment?: Json
          session_id?: string
          user_id?: string
        }
        Relationships: []
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
      session_quality_metrics: {
        Row: {
          breakthrough_probability: number | null
          created_at: string | null
          emotional_regulation_progress: number | null
          engagement_level: number | null
          id: string
          intervention_success_rates: Json | null
          intervention_triggers: Json | null
          progress_toward_goals: Json | null
          quality_alerts: Json | null
          session_id: string
          session_satisfaction_predicted: number | null
          technique_effectiveness_scores: Json | null
          therapeutic_alliance_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          breakthrough_probability?: number | null
          created_at?: string | null
          emotional_regulation_progress?: number | null
          engagement_level?: number | null
          id?: string
          intervention_success_rates?: Json | null
          intervention_triggers?: Json | null
          progress_toward_goals?: Json | null
          quality_alerts?: Json | null
          session_id: string
          session_satisfaction_predicted?: number | null
          technique_effectiveness_scores?: Json | null
          therapeutic_alliance_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          breakthrough_probability?: number | null
          created_at?: string | null
          emotional_regulation_progress?: number | null
          engagement_level?: number | null
          id?: string
          intervention_success_rates?: Json | null
          intervention_triggers?: Json | null
          progress_toward_goals?: Json | null
          quality_alerts?: Json | null
          session_id?: string
          session_satisfaction_predicted?: number | null
          technique_effectiveness_scores?: Json | null
          therapeutic_alliance_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_summaries: {
        Row: {
          action_items: Json
          created_at: string
          effectiveness_score: number
          executive_summary: string
          goals_addressed: Json
          id: string
          key_takeaways: Json
          mood_correlation: Json
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_items?: Json
          created_at?: string
          effectiveness_score?: number
          executive_summary: string
          goals_addressed?: Json
          id?: string
          key_takeaways?: Json
          mood_correlation?: Json
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_items?: Json
          created_at?: string
          effectiveness_score?: number
          executive_summary?: string
          goals_addressed?: Json
          id?: string
          key_takeaways?: Json
          mood_correlation?: Json
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_technique_tracking: {
        Row: {
          ai_confidence: number | null
          approach_type: string
          created_at: string | null
          effectiveness_metrics: Json | null
          id: string
          implementation_timestamp: string | null
          session_id: string
          technique_name: string
          user_feedback: string | null
          user_id: string
          user_response_score: number | null
        }
        Insert: {
          ai_confidence?: number | null
          approach_type: string
          created_at?: string | null
          effectiveness_metrics?: Json | null
          id?: string
          implementation_timestamp?: string | null
          session_id: string
          technique_name: string
          user_feedback?: string | null
          user_id: string
          user_response_score?: number | null
        }
        Update: {
          ai_confidence?: number | null
          approach_type?: string
          created_at?: string | null
          effectiveness_metrics?: Json | null
          id?: string
          implementation_timestamp?: string | null
          session_id?: string
          technique_name?: string
          user_feedback?: string | null
          user_id?: string
          user_response_score?: number | null
        }
        Relationships: []
      }
      session_transcripts: {
        Row: {
          confidence_scores: Json
          created_at: string
          id: string
          processing_status: string
          session_id: string
          speaker_identification: Json
          transcript_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_scores?: Json
          created_at?: string
          id?: string
          processing_status?: string
          session_id: string
          speaker_identification?: Json
          transcript_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_scores?: Json
          created_at?: string
          id?: string
          processing_status?: string
          session_id?: string
          speaker_identification?: Json
          transcript_data?: Json
          updated_at?: string
          user_id?: string
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
      smart_notification_preferences: {
        Row: {
          ai_optimization_enabled: boolean | null
          created_at: string
          crisis_override: boolean | null
          frequency_limit: number | null
          id: string
          notification_type: string
          preferred_channels: string[] | null
          preferred_times: Json | null
          quiet_hours: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_optimization_enabled?: boolean | null
          created_at?: string
          crisis_override?: boolean | null
          frequency_limit?: number | null
          id?: string
          notification_type: string
          preferred_channels?: string[] | null
          preferred_times?: Json | null
          quiet_hours?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_optimization_enabled?: boolean | null
          created_at?: string
          crisis_override?: boolean | null
          frequency_limit?: number | null
          id?: string
          notification_type?: string
          preferred_channels?: string[] | null
          preferred_times?: Json | null
          quiet_hours?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_changes: {
        Row: {
          change_type: string
          created_at: string
          effective_date: string
          from_plan_id: string | null
          id: string
          proration_amount: number | null
          reason: string | null
          subscription_id: string | null
          to_plan_id: string | null
          user_id: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          effective_date: string
          from_plan_id?: string | null
          id?: string
          proration_amount?: number | null
          reason?: string | null
          subscription_id?: string | null
          to_plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          effective_date?: string
          from_plan_id?: string | null
          id?: string
          proration_amount?: number | null
          reason?: string | null
          subscription_id?: string | null
          to_plan_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_changes_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_lifecycle_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          subscription_id: string | null
          triggered_notifications: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          subscription_id?: string | null
          triggered_notifications?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          subscription_id?: string | null
          triggered_notifications?: Json | null
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
          session_limits: Json | null
          therapy_plan_limit: number | null
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
          session_limits?: Json | null
          therapy_plan_limit?: number | null
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
          session_limits?: Json | null
          therapy_plan_limit?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      super_admins: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          ip_whitelist: string[] | null
          is_active: boolean
          last_login_at: string | null
          locked_until: string | null
          login_attempts: number | null
          password_hash: string
          requires_mfa: boolean
          role: Database["public"]["Enums"]["super_admin_role"]
          session_timeout_minutes: number | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean
          last_login_at?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          password_hash: string
          requires_mfa?: boolean
          role?: Database["public"]["Enums"]["super_admin_role"]
          session_timeout_minutes?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean
          last_login_at?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          password_hash?: string
          requires_mfa?: boolean
          role?: Database["public"]["Enums"]["super_admin_role"]
          session_timeout_minutes?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "super_admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
        ]
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
      system_health_logs: {
        Row: {
          checked_at: string | null
          critical_issues: string[] | null
          id: string
          overall_health: number
          recommendations: string[] | null
          warnings: string[] | null
        }
        Insert: {
          checked_at?: string | null
          critical_issues?: string[] | null
          id?: string
          overall_health: number
          recommendations?: string[] | null
          warnings?: string[] | null
        }
        Update: {
          checked_at?: string | null
          critical_issues?: string[] | null
          id?: string
          overall_health?: number
          recommendations?: string[] | null
          warnings?: string[] | null
        }
        Relationships: []
      }
      system_intelligence_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tax_rates: {
        Row: {
          country_code: string
          created_at: string
          description: string | null
          effective_from: string
          effective_until: string | null
          id: string
          is_active: boolean | null
          rate: number
          state_code: string | null
          tax_type: string
        }
        Insert: {
          country_code: string
          created_at?: string
          description?: string | null
          effective_from: string
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          rate: number
          state_code?: string | null
          tax_type: string
        }
        Update: {
          country_code?: string
          created_at?: string
          description?: string | null
          effective_from?: string
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          rate?: number
          state_code?: string | null
          tax_type?: string
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
      therapeutic_terminology: {
        Row: {
          category: string
          created_at: string
          cultural_context: Json | null
          definition_de: string | null
          definition_en: string | null
          english_term: string
          german_term: string
          id: string
          is_active: boolean
          updated_at: string
          usage_examples: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          cultural_context?: Json | null
          definition_de?: string | null
          definition_en?: string | null
          english_term: string
          german_term: string
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_examples?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          cultural_context?: Json | null
          definition_de?: string | null
          definition_en?: string | null
          english_term?: string
          german_term?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          usage_examples?: Json | null
        }
        Relationships: []
      }
      therapist_assessments: {
        Row: {
          assessment_version: number
          compatibility_scores: Json | null
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
          compatibility_scores?: Json | null
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
          compatibility_scores?: Json | null
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
      therapist_character_profiles: {
        Row: {
          created_at: string
          crisis_response_style: Json | null
          cultural_stories: Json | null
          emotional_intelligence_profile: Json | null
          id: string
          personal_backstory: Json | null
          personal_interests: string[] | null
          professional_background: Json | null
          session_style_preferences: Json | null
          signature_phrases: string[] | null
          speech_patterns: Json | null
          therapist_id: string
          therapy_philosophy: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crisis_response_style?: Json | null
          cultural_stories?: Json | null
          emotional_intelligence_profile?: Json | null
          id?: string
          personal_backstory?: Json | null
          personal_interests?: string[] | null
          professional_background?: Json | null
          session_style_preferences?: Json | null
          signature_phrases?: string[] | null
          speech_patterns?: Json | null
          therapist_id: string
          therapy_philosophy?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crisis_response_style?: Json | null
          cultural_stories?: Json | null
          emotional_intelligence_profile?: Json | null
          id?: string
          personal_backstory?: Json | null
          personal_interests?: string[] | null
          professional_background?: Json | null
          session_style_preferences?: Json | null
          signature_phrases?: string[] | null
          speech_patterns?: Json | null
          therapist_id?: string
          therapy_philosophy?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      therapist_client_relationships: {
        Row: {
          communication_preferences: Json | null
          created_at: string
          id: string
          last_interaction: string | null
          rapport_level: number | null
          relationship_stage: string
          shared_memories: Json | null
          therapeutic_progress: Json | null
          therapist_id: string
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_preferences?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string | null
          rapport_level?: number | null
          relationship_stage?: string
          shared_memories?: Json | null
          therapeutic_progress?: Json | null
          therapist_id: string
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_preferences?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string | null
          rapport_level?: number | null
          relationship_stage?: string
          shared_memories?: Json | null
          therapeutic_progress?: Json | null
          therapist_id?: string
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      therapist_context_switches: {
        Row: {
          context_data: Json | null
          created_at: string
          from_therapist_id: string | null
          id: string
          session_id: string | null
          switch_reason: string | null
          to_therapist_id: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          from_therapist_id?: string | null
          id?: string
          session_id?: string | null
          switch_reason?: string | null
          to_therapist_id: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          from_therapist_id?: string | null
          id?: string
          session_id?: string | null
          switch_reason?: string | null
          to_therapist_id?: string
          user_id?: string
        }
        Relationships: []
      }
      therapist_expressions: {
        Row: {
          context_type: string
          created_at: string
          effectiveness_score: number | null
          emotional_context: string
          expression_data: Json
          id: string
          therapist_id: string
          usage_frequency: number | null
        }
        Insert: {
          context_type: string
          created_at?: string
          effectiveness_score?: number | null
          emotional_context: string
          expression_data: Json
          id?: string
          therapist_id: string
          usage_frequency?: number | null
        }
        Update: {
          context_type?: string
          created_at?: string
          effectiveness_score?: number | null
          emotional_context?: string
          expression_data?: Json
          id?: string
          therapist_id?: string
          usage_frequency?: number | null
        }
        Relationships: []
      }
      therapist_favorites: {
        Row: {
          created_at: string
          id: string
          priority_ranking: number | null
          specialty_preference: string | null
          therapist_id: string
          therapist_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority_ranking?: number | null
          specialty_preference?: string | null
          therapist_id: string
          therapist_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          priority_ranking?: number | null
          specialty_preference?: string | null
          therapist_id?: string
          therapist_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapist_note_styles: {
        Row: {
          created_at: string
          documentation_format: Json | null
          focus_areas: string[] | null
          homework_assignment_style: Json | null
          id: string
          note_taking_style: string
          observation_style: string | null
          progress_tracking_method: string | null
          therapist_id: string
        }
        Insert: {
          created_at?: string
          documentation_format?: Json | null
          focus_areas?: string[] | null
          homework_assignment_style?: Json | null
          id?: string
          note_taking_style?: string
          observation_style?: string | null
          progress_tracking_method?: string | null
          therapist_id: string
        }
        Update: {
          created_at?: string
          documentation_format?: Json | null
          focus_areas?: string[] | null
          homework_assignment_style?: Json | null
          id?: string
          note_taking_style?: string
          observation_style?: string | null
          progress_tracking_method?: string | null
          therapist_id?: string
        }
        Relationships: []
      }
      therapist_personalities: {
        Row: {
          approach: string
          avatar_characteristics: Json | null
          avatar_emotions: Json | null
          avatar_image_url: string | null
          avatar_style: string | null
          certifications: string[] | null
          color_scheme: string
          communication_style: string
          created_at: string
          description: string
          education: string[] | null
          effectiveness_areas: Json | null
          emotional_responses: Json | null
          experience_level: string
          icon: string
          id: string
          is_active: boolean
          name: string
          personality_traits: Json | null
          session_availability: Json | null
          specialties: string[]
          success_rate: number | null
          therapeutic_techniques: string[] | null
          therapist_tier: string | null
          title: string
          total_sessions: number | null
          user_rating: number | null
          voice_characteristics: Json | null
          years_experience: number | null
        }
        Insert: {
          approach: string
          avatar_characteristics?: Json | null
          avatar_emotions?: Json | null
          avatar_image_url?: string | null
          avatar_style?: string | null
          certifications?: string[] | null
          color_scheme?: string
          communication_style: string
          created_at?: string
          description: string
          education?: string[] | null
          effectiveness_areas?: Json | null
          emotional_responses?: Json | null
          experience_level?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          personality_traits?: Json | null
          session_availability?: Json | null
          specialties?: string[]
          success_rate?: number | null
          therapeutic_techniques?: string[] | null
          therapist_tier?: string | null
          title: string
          total_sessions?: number | null
          user_rating?: number | null
          voice_characteristics?: Json | null
          years_experience?: number | null
        }
        Update: {
          approach?: string
          avatar_characteristics?: Json | null
          avatar_emotions?: Json | null
          avatar_image_url?: string | null
          avatar_style?: string | null
          certifications?: string[] | null
          color_scheme?: string
          communication_style?: string
          created_at?: string
          description?: string
          education?: string[] | null
          effectiveness_areas?: Json | null
          emotional_responses?: Json | null
          experience_level?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          personality_traits?: Json | null
          session_availability?: Json | null
          specialties?: string[]
          success_rate?: number | null
          therapeutic_techniques?: string[] | null
          therapist_tier?: string | null
          title?: string
          total_sessions?: number | null
          user_rating?: number | null
          voice_characteristics?: Json | null
          years_experience?: number | null
        }
        Relationships: []
      }
      therapist_reviews: {
        Row: {
          communication_rating: number
          created_at: string
          effectiveness_rating: number
          empathy_rating: number
          expertise_rating: number
          helpful_count: number | null
          id: string
          improvement_percentage: number | null
          is_anonymous: boolean
          is_verified: boolean
          overall_rating: number
          review_text: string | null
          review_title: string | null
          specific_areas_helped: string[] | null
          therapist_id: string
          therapy_duration_weeks: number | null
          updated_at: string
          user_id: string
          would_recommend: boolean
        }
        Insert: {
          communication_rating: number
          created_at?: string
          effectiveness_rating: number
          empathy_rating: number
          expertise_rating: number
          helpful_count?: number | null
          id?: string
          improvement_percentage?: number | null
          is_anonymous?: boolean
          is_verified?: boolean
          overall_rating: number
          review_text?: string | null
          review_title?: string | null
          specific_areas_helped?: string[] | null
          therapist_id: string
          therapy_duration_weeks?: number | null
          updated_at?: string
          user_id: string
          would_recommend: boolean
        }
        Update: {
          communication_rating?: number
          created_at?: string
          effectiveness_rating?: number
          empathy_rating?: number
          expertise_rating?: number
          helpful_count?: number | null
          id?: string
          improvement_percentage?: number | null
          is_anonymous?: boolean
          is_verified?: boolean
          overall_rating?: number
          review_text?: string | null
          review_title?: string | null
          specific_areas_helped?: string[] | null
          therapist_id?: string
          therapy_duration_weeks?: number | null
          updated_at?: string
          user_id?: string
          would_recommend?: boolean
        }
        Relationships: []
      }
      therapist_selections: {
        Row: {
          assessment_id: string | null
          collaboration_notes: string | null
          created_at: string | null
          effectiveness_metrics: Json | null
          handoff_protocol: Json | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          priority_level: number | null
          selected_at: string | null
          selection_reason: string | null
          specialty_focus: string | null
          therapist_id: string
          therapy_context: string | null
          treatment_phase: string | null
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          collaboration_notes?: string | null
          created_at?: string | null
          effectiveness_metrics?: Json | null
          handoff_protocol?: Json | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          priority_level?: number | null
          selected_at?: string | null
          selection_reason?: string | null
          specialty_focus?: string | null
          therapist_id: string
          therapy_context?: string | null
          treatment_phase?: string | null
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          collaboration_notes?: string | null
          created_at?: string | null
          effectiveness_metrics?: Json | null
          handoff_protocol?: Json | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          priority_level?: number | null
          selected_at?: string | null
          selection_reason?: string | null
          specialty_focus?: string | null
          therapist_id?: string
          therapy_context?: string | null
          treatment_phase?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapist_specialties: {
        Row: {
          certification_details: Json | null
          created_at: string
          id: string
          proficiency_level: string | null
          specialty: string
          success_rate: number | null
          therapist_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          certification_details?: Json | null
          created_at?: string
          id?: string
          proficiency_level?: string | null
          specialty: string
          success_rate?: number | null
          therapist_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          certification_details?: Json | null
          created_at?: string
          id?: string
          proficiency_level?: string | null
          specialty?: string
          success_rate?: number | null
          therapist_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      therapist_teams: {
        Row: {
          coordination_level: string | null
          created_at: string
          id: string
          primary_therapist_id: string | null
          shared_notes: string | null
          team_goals: Json | null
          team_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coordination_level?: string | null
          created_at?: string
          id?: string
          primary_therapist_id?: string | null
          shared_notes?: string | null
          team_goals?: Json | null
          team_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coordination_level?: string | null
          created_at?: string
          id?: string
          primary_therapist_id?: string | null
          shared_notes?: string | null
          team_goals?: Json | null
          team_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_approach_combinations: {
        Row: {
          combination_name: string
          contraindications: string[] | null
          created_at: string | null
          effectiveness_score: number | null
          id: string
          integration_strategy: string
          is_active: boolean | null
          primary_approach_id: string | null
          secondary_approach_id: string | null
          session_structure: Json | null
          target_conditions: string[] | null
          updated_at: string | null
        }
        Insert: {
          combination_name: string
          contraindications?: string[] | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          integration_strategy: string
          is_active?: boolean | null
          primary_approach_id?: string | null
          secondary_approach_id?: string | null
          session_structure?: Json | null
          target_conditions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          combination_name?: string
          contraindications?: string[] | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          integration_strategy?: string
          is_active?: boolean | null
          primary_approach_id?: string | null
          secondary_approach_id?: string | null
          session_structure?: Json | null
          target_conditions?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapy_approach_combinations_primary_approach_id_fkey"
            columns: ["primary_approach_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_approach_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_approach_combinations_secondary_approach_id_fkey"
            columns: ["secondary_approach_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_approach_configs"
            referencedColumns: ["id"]
          },
        ]
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
      therapy_context: {
        Row: {
          context_data: Json | null
          created_at: string
          cultural_profile: Json | null
          current_ai_model: string
          current_avatar_state: string | null
          current_voice_id: string | null
          emotional_state: Json | null
          id: string
          session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          cultural_profile?: Json | null
          current_ai_model: string
          current_avatar_state?: string | null
          current_voice_id?: string | null
          emotional_state?: Json | null
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          cultural_profile?: Json | null
          current_ai_model?: string
          current_avatar_state?: string | null
          current_voice_id?: string | null
          emotional_state?: Json | null
          id?: string
          session_id?: string | null
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
      therapy_plan_adaptations: {
        Row: {
          adaptation_type: string
          created_at: string
          created_by: string
          id: string
          implementation_status: string
          metadata: Json
          recommendations: Json
          severity_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adaptation_type: string
          created_at?: string
          created_by: string
          id?: string
          implementation_status?: string
          metadata?: Json
          recommendations?: Json
          severity_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adaptation_type?: string
          created_at?: string
          created_by?: string
          id?: string
          implementation_status?: string
          metadata?: Json
          recommendations?: Json
          severity_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_plan_execution: {
        Row: {
          adaptation_triggers: Json | null
          completed_goals: string[] | null
          continuity_tracking: Json | null
          created_at: string | null
          current_goals: string[] | null
          goal_progress: Json | null
          id: string
          personalized_homework: Json | null
          session_id: string
          technique_effectiveness: Json | null
          technique_sequence: Json | null
          therapy_plan_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adaptation_triggers?: Json | null
          completed_goals?: string[] | null
          continuity_tracking?: Json | null
          created_at?: string | null
          current_goals?: string[] | null
          goal_progress?: Json | null
          id?: string
          personalized_homework?: Json | null
          session_id: string
          technique_effectiveness?: Json | null
          technique_sequence?: Json | null
          therapy_plan_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adaptation_triggers?: Json | null
          completed_goals?: string[] | null
          continuity_tracking?: Json | null
          created_at?: string | null
          current_goals?: string[] | null
          goal_progress?: Json | null
          id?: string
          personalized_homework?: Json | null
          session_id?: string
          technique_effectiveness?: Json | null
          technique_sequence?: Json | null
          therapy_plan_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapy_plan_translations: {
        Row: {
          created_at: string
          cultural_adaptations: Json | null
          current_phase: string | null
          description: string | null
          focus_areas: string[] | null
          goals: Json | null
          id: string
          language_code: string
          milestones: Json | null
          therapy_plan_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultural_adaptations?: Json | null
          current_phase?: string | null
          description?: string | null
          focus_areas?: string[] | null
          goals?: Json | null
          id?: string
          language_code?: string
          milestones?: Json | null
          therapy_plan_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultural_adaptations?: Json | null
          current_phase?: string | null
          description?: string | null
          focus_areas?: string[] | null
          goals?: Json | null
          id?: string
          language_code?: string
          milestones?: Json | null
          therapy_plan_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapy_plan_translations_therapy_plan_id_fkey"
            columns: ["therapy_plan_id"]
            isOneToOne: false
            referencedRelation: "therapy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      therapy_plans: {
        Row: {
          created_at: string
          current_phase: string
          description: string
          estimated_duration_weeks: number | null
          focus_areas: string[] | null
          goals: Json
          id: string
          is_active: boolean
          milestones: Json | null
          progress_percentage: number
          sessions_per_week: number | null
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
          estimated_duration_weeks?: number | null
          focus_areas?: string[] | null
          goals?: Json
          id?: string
          is_active?: boolean
          milestones?: Json | null
          progress_percentage?: number
          sessions_per_week?: number | null
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
          estimated_duration_weeks?: number | null
          focus_areas?: string[] | null
          goals?: Json
          id?: string
          is_active?: boolean
          milestones?: Json | null
          progress_percentage?: number
          sessions_per_week?: number | null
          therapist_id?: string
          title?: string
          total_phases?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_session_continuity: {
        Row: {
          adapted_approach: string | null
          ai_recommendations: string[] | null
          carry_over_topics: string[] | null
          created_at: string
          current_session_id: string | null
          id: string
          previous_session_id: string | null
          priority_areas: string[] | null
          progress_indicators: Json | null
          session_plan: string | null
          therapist_notes: string | null
          unresolved_issues: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adapted_approach?: string | null
          ai_recommendations?: string[] | null
          carry_over_topics?: string[] | null
          created_at?: string
          current_session_id?: string | null
          id?: string
          previous_session_id?: string | null
          priority_areas?: string[] | null
          progress_indicators?: Json | null
          session_plan?: string | null
          therapist_notes?: string | null
          unresolved_issues?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adapted_approach?: string | null
          ai_recommendations?: string[] | null
          carry_over_topics?: string[] | null
          created_at?: string
          current_session_id?: string | null
          id?: string
          previous_session_id?: string | null
          priority_areas?: string[] | null
          progress_indicators?: Json | null
          session_plan?: string | null
          therapist_notes?: string | null
          unresolved_issues?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_session_notifications: {
        Row: {
          created_at: string
          engagement_data: Json | null
          id: string
          notification_type: string
          scheduled_for: string
          sent_at: string | null
          session_context: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_data?: Json | null
          id?: string
          notification_type: string
          scheduled_for: string
          sent_at?: string | null
          session_context?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_data?: Json | null
          id?: string
          notification_type?: string
          scheduled_for?: string
          sent_at?: string | null
          session_context?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapy_session_translations: {
        Row: {
          created_at: string
          cultural_considerations: Json | null
          homework_assignments: Json | null
          id: string
          language_code: string
          session_id: string
          session_notes: string | null
          techniques_used: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultural_considerations?: Json | null
          homework_assignments?: Json | null
          id?: string
          language_code?: string
          session_id: string
          session_notes?: string | null
          techniques_used?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultural_considerations?: Json | null
          homework_assignments?: Json | null
          id?: string
          language_code?: string
          session_id?: string
          session_notes?: string | null
          techniques_used?: Json | null
          updated_at?: string
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
      translation_analytics: {
        Row: {
          api_cost: number | null
          avg_quality_score: number | null
          context_type: string
          created_at: string
          cultural_adaptations_count: number | null
          date: string
          id: string
          language_pair: string
          response_time_avg: number | null
          translation_count: number | null
          user_satisfaction_avg: number | null
        }
        Insert: {
          api_cost?: number | null
          avg_quality_score?: number | null
          context_type: string
          created_at?: string
          cultural_adaptations_count?: number | null
          date: string
          id?: string
          language_pair: string
          response_time_avg?: number | null
          translation_count?: number | null
          user_satisfaction_avg?: number | null
        }
        Update: {
          api_cost?: number | null
          avg_quality_score?: number | null
          context_type?: string
          created_at?: string
          cultural_adaptations_count?: number | null
          date?: string
          id?: string
          language_pair?: string
          response_time_avg?: number | null
          translation_count?: number | null
          user_satisfaction_avg?: number | null
        }
        Relationships: []
      }
      translation_feedback: {
        Row: {
          comments: string | null
          created_at: string
          feedback_type: string
          id: string
          improvements_suggested: Json | null
          quality_rating: number | null
          translation_id: string | null
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          feedback_type: string
          id?: string
          improvements_suggested?: Json | null
          quality_rating?: number | null
          translation_id?: string | null
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          feedback_type?: string
          id?: string
          improvements_suggested?: Json | null
          quality_rating?: number | null
          translation_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_feedback_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "ai_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_jobs: {
        Row: {
          actual_cost: number | null
          completed_at: string | null
          completed_items: number
          created_at: string
          created_by: string | null
          error_details: Json | null
          estimated_cost: number | null
          failed_items: number
          id: string
          job_config: Json | null
          job_name: string
          job_type: string
          results_summary: Json | null
          source_language: string
          status: string
          target_languages: string[]
          total_items: number
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          completed_at?: string | null
          completed_items?: number
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          estimated_cost?: number | null
          failed_items?: number
          id?: string
          job_config?: Json | null
          job_name: string
          job_type: string
          results_summary?: Json | null
          source_language?: string
          status?: string
          target_languages: string[]
          total_items?: number
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          completed_at?: string | null
          completed_items?: number
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          estimated_cost?: number | null
          failed_items?: number
          id?: string
          job_config?: Json | null
          job_name?: string
          job_type?: string
          results_summary?: Json | null
          source_language?: string
          status?: string
          target_languages?: string[]
          total_items?: number
          updated_at?: string
        }
        Relationships: []
      }
      translation_quality_metrics: {
        Row: {
          created_at: string
          cultural_accuracy_score: number | null
          id: string
          language_pair: string
          provider: string
          quality_score: number
          response_time_ms: number
          therapeutic_accuracy_score: number | null
          translation_id: string | null
          user_feedback_score: number | null
        }
        Insert: {
          created_at?: string
          cultural_accuracy_score?: number | null
          id?: string
          language_pair: string
          provider: string
          quality_score: number
          response_time_ms: number
          therapeutic_accuracy_score?: number | null
          translation_id?: string | null
          user_feedback_score?: number | null
        }
        Update: {
          created_at?: string
          cultural_accuracy_score?: number | null
          id?: string
          language_pair?: string
          provider?: string
          quality_score?: number
          response_time_ms?: number
          therapeutic_accuracy_score?: number | null
          translation_id?: string | null
          user_feedback_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_quality_metrics_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "european_translation_memory"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_review_queue: {
        Row: {
          assigned_to: string | null
          content_translation_id: string | null
          created_at: string
          created_by: string | null
          cultural_notes: string | null
          id: string
          priority_level: number | null
          quality_metrics: Json | null
          review_type: string
          reviewed_at: string | null
          reviewer_notes: string | null
          seo_translation_id: string | null
          status: string
          updated_at: string
          url_translation_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          content_translation_id?: string | null
          created_at?: string
          created_by?: string | null
          cultural_notes?: string | null
          id?: string
          priority_level?: number | null
          quality_metrics?: Json | null
          review_type: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seo_translation_id?: string | null
          status?: string
          updated_at?: string
          url_translation_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          content_translation_id?: string | null
          created_at?: string
          created_by?: string | null
          cultural_notes?: string | null
          id?: string
          priority_level?: number | null
          quality_metrics?: Json | null
          review_type?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seo_translation_id?: string | null
          status?: string
          updated_at?: string
          url_translation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_review_queue_content_translation_id_fkey"
            columns: ["content_translation_id"]
            isOneToOne: false
            referencedRelation: "content_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_review_queue_seo_translation_id_fkey"
            columns: ["seo_translation_id"]
            isOneToOne: false
            referencedRelation: "seo_translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_review_queue_url_translation_id_fkey"
            columns: ["url_translation_id"]
            isOneToOne: false
            referencedRelation: "url_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_sessions: {
        Row: {
          context_data: Json | null
          cultural_adaptations_applied: Json | null
          ended_at: string | null
          id: string
          message_count: number | null
          session_type: string
          source_language: string
          started_at: string
          target_language: string
          translation_quality_avg: number | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          cultural_adaptations_applied?: Json | null
          ended_at?: string | null
          id?: string
          message_count?: number | null
          session_type: string
          source_language: string
          started_at?: string
          target_language: string
          translation_quality_avg?: number | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          cultural_adaptations_applied?: Json | null
          ended_at?: string | null
          id?: string
          message_count?: number | null
          session_type?: string
          source_language?: string
          started_at?: string
          target_language?: string
          translation_quality_avg?: number | null
          user_id?: string
        }
        Relationships: []
      }
      translation_versions: {
        Row: {
          content: string
          context_data: Json | null
          created_at: string
          created_by: string | null
          human_reviewed: boolean | null
          id: string
          is_active: boolean | null
          language_code: string
          quality_score: number | null
          translation_key: string
          updated_at: string
          version_number: number
        }
        Insert: {
          content: string
          context_data?: Json | null
          created_at?: string
          created_by?: string | null
          human_reviewed?: boolean | null
          id?: string
          is_active?: boolean | null
          language_code: string
          quality_score?: number | null
          translation_key: string
          updated_at?: string
          version_number?: number
        }
        Update: {
          content?: string
          context_data?: Json | null
          created_at?: string
          created_by?: string | null
          human_reviewed?: boolean | null
          id?: string
          is_active?: boolean | null
          language_code?: string
          quality_score?: number | null
          translation_key?: string
          updated_at?: string
          version_number?: number
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
          backup_codes_generated_at: string | null
          backup_codes_remaining: number | null
          created_at: string
          device_trust_tokens: Json | null
          emergency_recovery_code: string | null
          id: string
          is_enabled: boolean | null
          last_used: string | null
          last_used_at: string | null
          phone_number: string | null
          rate_limit_attempts: number | null
          rate_limit_reset_at: string | null
          recovery_codes_used: number | null
          recovery_email: string | null
          secret: string
          security_notifications_enabled: boolean | null
          setup_completed_at: string | null
          trusted_devices: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          backup_codes_generated_at?: string | null
          backup_codes_remaining?: number | null
          created_at?: string
          device_trust_tokens?: Json | null
          emergency_recovery_code?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          last_used_at?: string | null
          phone_number?: string | null
          rate_limit_attempts?: number | null
          rate_limit_reset_at?: string | null
          recovery_codes_used?: number | null
          recovery_email?: string | null
          secret: string
          security_notifications_enabled?: boolean | null
          setup_completed_at?: string | null
          trusted_devices?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          backup_codes_generated_at?: string | null
          backup_codes_remaining?: number | null
          created_at?: string
          device_trust_tokens?: Json | null
          emergency_recovery_code?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used?: string | null
          last_used_at?: string | null
          phone_number?: string | null
          rate_limit_attempts?: number | null
          rate_limit_reset_at?: string | null
          recovery_codes_used?: number | null
          recovery_email?: string | null
          secret?: string
          security_notifications_enabled?: boolean | null
          setup_completed_at?: string | null
          trusted_devices?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      two_factor_setup_attempts: {
        Row: {
          attempts_count: number | null
          created_at: string
          expires_at: string
          id: string
          is_verified: boolean | null
          method_type: string
          phone_number: string | null
          user_id: string
          verification_code: string | null
        }
        Insert: {
          attempts_count?: number | null
          created_at?: string
          expires_at: string
          id?: string
          is_verified?: boolean | null
          method_type: string
          phone_number?: string | null
          user_id: string
          verification_code?: string | null
        }
        Update: {
          attempts_count?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          is_verified?: boolean | null
          method_type?: string
          phone_number?: string | null
          user_id?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      upselling_campaigns: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          email_template_key: string | null
          id: string
          is_active: boolean | null
          name: string
          success_metrics: Json | null
          target_plan: string
          trigger_conditions: Json
          trigger_type: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          email_template_key?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          success_metrics?: Json | null
          target_plan: string
          trigger_conditions: Json
          trigger_type: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          email_template_key?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          success_metrics?: Json | null
          target_plan?: string
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      upselling_interactions: {
        Row: {
          campaign_id: string
          conversion_value: number | null
          created_at: string | null
          id: string
          interaction_context: Json | null
          interaction_type: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          conversion_value?: number | null
          created_at?: string | null
          id?: string
          interaction_context?: Json | null
          interaction_type: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          conversion_value?: number | null
          created_at?: string | null
          id?: string
          interaction_context?: Json | null
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upselling_interactions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "upselling_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      url_translations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          language_code: string
          original_path: string
          page_key: string
          translated_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          language_code: string
          original_path: string
          page_key: string
          translated_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          language_code?: string
          original_path?: string
          page_key?: string
          translated_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          notification_channels: string[] | null
          threshold_type: string
          threshold_value: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          notification_channels?: string[] | null
          threshold_type: string
          threshold_value: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          notification_channels?: string[] | null
          threshold_type?: string
          threshold_value?: number
          updated_at?: string
          user_id?: string | null
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
      user_avatar_inventory: {
        Row: {
          id: string
          is_equipped: boolean
          item_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_equipped?: boolean
          item_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_equipped?: boolean
          item_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_avatar_profiles: {
        Row: {
          animation_preferences: Json
          appearance_config: Json
          avatar_name: string
          created_at: string
          current_mood: string
          customization_level: number
          id: string
          mood_expressions: Json
          mood_history: Json | null
          unlocked_features: string[] | null
          updated_at: string
          user_id: string
          voice_settings: Json
        }
        Insert: {
          animation_preferences?: Json
          appearance_config?: Json
          avatar_name?: string
          created_at?: string
          current_mood?: string
          customization_level?: number
          id?: string
          mood_expressions?: Json
          mood_history?: Json | null
          unlocked_features?: string[] | null
          updated_at?: string
          user_id: string
          voice_settings?: Json
        }
        Update: {
          animation_preferences?: Json
          appearance_config?: Json
          avatar_name?: string
          created_at?: string
          current_mood?: string
          customization_level?: number
          id?: string
          mood_expressions?: Json
          mood_history?: Json | null
          unlocked_features?: string[] | null
          updated_at?: string
          user_id?: string
          voice_settings?: Json
        }
        Relationships: []
      }
      user_badge_achievements: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          progress_data: Json | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id?: string
          xp_earned?: number
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
      user_behavioral_analytics: {
        Row: {
          country_claimed: string | null
          country_detected: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          language_preference: string | null
          risk_score: number | null
          session_id: string | null
          suspicious_patterns: Json | null
          timezone_offset: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          country_claimed?: string | null
          country_detected?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          language_preference?: string | null
          risk_score?: number | null
          session_id?: string | null
          suspicious_patterns?: Json | null
          timezone_offset?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          country_claimed?: string | null
          country_detected?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          language_preference?: string | null
          risk_score?: number | null
          session_id?: string | null
          suspicious_patterns?: Json | null
          timezone_offset?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_consent: {
        Row: {
          consent_type: string
          created_at: string
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: unknown | null
          updated_at: string
          user_agent: string | null
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          consent_type: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          consent_type?: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      user_country_preferences: {
        Row: {
          browser_language: string | null
          created_at: string
          detected_country_code: string | null
          detection_confidence: number | null
          detection_method: string | null
          id: string
          ip_address: unknown | null
          is_manual_override: boolean | null
          preferred_country_code: string | null
          timezone: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          browser_language?: string | null
          created_at?: string
          detected_country_code?: string | null
          detection_confidence?: number | null
          detection_method?: string | null
          id?: string
          ip_address?: unknown | null
          is_manual_override?: boolean | null
          preferred_country_code?: string | null
          timezone?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          browser_language?: string | null
          created_at?: string
          detected_country_code?: string | null
          detection_confidence?: number | null
          detection_method?: string | null
          id?: string
          ip_address?: unknown | null
          is_manual_override?: boolean | null
          preferred_country_code?: string | null
          timezone?: string | null
          updated_at?: string
          user_agent?: string | null
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
      user_devices: {
        Row: {
          browser: string | null
          created_at: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          is_trusted: boolean | null
          last_used_at: string | null
          location_data: Json | null
          os: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location_data?: Json | null
          os?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location_data?: Json | null
          os?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_experience: {
        Row: {
          created_at: string
          current_level: number
          id: string
          level_rewards_claimed: Json | null
          monthly_xp: number
          total_xp: number
          updated_at: string
          user_id: string
          weekly_xp: number
          xp_sources: Json | null
          xp_to_next_level: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          level_rewards_claimed?: Json | null
          monthly_xp?: number
          total_xp?: number
          updated_at?: string
          user_id: string
          weekly_xp?: number
          xp_sources?: Json | null
          xp_to_next_level?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          level_rewards_claimed?: Json | null
          monthly_xp?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
          weekly_xp?: number
          xp_sources?: Json | null
          xp_to_next_level?: number
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
      user_knowledge_progress: {
        Row: {
          id: string
          knowledge_item_id: string
          last_reviewed_at: string | null
          mastery_level: number
          review_count: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          knowledge_item_id: string
          last_reviewed_at?: string | null
          mastery_level?: number
          review_count?: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          knowledge_item_id?: string
          last_reviewed_at?: string | null
          mastery_level?: number
          review_count?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_language_preferences: {
        Row: {
          auto_translate: boolean | null
          communication_style: string | null
          created_at: string
          cultural_sensitivity_level: string | null
          dialect_preference: string | null
          id: string
          preferred_languages: string[]
          preserve_emotional_context: boolean | null
          translate_therapy_content: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_translate?: boolean | null
          communication_style?: string | null
          created_at?: string
          cultural_sensitivity_level?: string | null
          dialect_preference?: string | null
          id?: string
          preferred_languages: string[]
          preserve_emotional_context?: boolean | null
          translate_therapy_content?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_translate?: boolean | null
          communication_style?: string | null
          created_at?: string
          cultural_sensitivity_level?: string | null
          dialect_preference?: string | null
          id?: string
          preferred_languages?: string[]
          preserve_emotional_context?: boolean | null
          translate_therapy_content?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_location_confidence: {
        Row: {
          behavioral_consistency_score: number | null
          confidence_score: number
          created_at: string
          current_country_code: string
          flags: Json | null
          id: string
          ip_consistency_score: number | null
          last_verified_at: string | null
          payment_consistency_score: number | null
          trust_level: string
          updated_at: string
          user_id: string
          verification_count: number | null
        }
        Insert: {
          behavioral_consistency_score?: number | null
          confidence_score?: number
          created_at?: string
          current_country_code: string
          flags?: Json | null
          id?: string
          ip_consistency_score?: number | null
          last_verified_at?: string | null
          payment_consistency_score?: number | null
          trust_level?: string
          updated_at?: string
          user_id: string
          verification_count?: number | null
        }
        Update: {
          behavioral_consistency_score?: number | null
          confidence_score?: number
          created_at?: string
          current_country_code?: string
          flags?: Json | null
          id?: string
          ip_consistency_score?: number | null
          last_verified_at?: string | null
          payment_consistency_score?: number | null
          trust_level?: string
          updated_at?: string
          user_id?: string
          verification_count?: number | null
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          crisis_override: boolean | null
          do_not_disturb: Json | null
          frequency_limits: Json | null
          id: string
          is_enabled: boolean | null
          notification_type: string
          personalization_level: string | null
          platform_preferences: Json | null
          timing_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          crisis_override?: boolean | null
          do_not_disturb?: Json | null
          frequency_limits?: Json | null
          id?: string
          is_enabled?: boolean | null
          notification_type: string
          personalization_level?: string | null
          platform_preferences?: Json | null
          timing_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          crisis_override?: boolean | null
          do_not_disturb?: Json | null
          frequency_limits?: Json | null
          id?: string
          is_enabled?: boolean | null
          notification_type?: string
          personalization_level?: string | null
          platform_preferences?: Json | null
          timing_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
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
      user_risk_assessments: {
        Row: {
          assessed_by: string | null
          assessment_type: string
          created_at: string
          crisis_score: number | null
          id: string
          next_assessment_due: string | null
          protective_factors: Json | null
          recommendations: Json | null
          reviewed_by: string | null
          risk_factors: Json | null
          risk_level: string
          suicide_risk_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessed_by?: string | null
          assessment_type?: string
          created_at?: string
          crisis_score?: number | null
          id?: string
          next_assessment_due?: string | null
          protective_factors?: Json | null
          recommendations?: Json | null
          reviewed_by?: string | null
          risk_factors?: Json | null
          risk_level?: string
          suicide_risk_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessed_by?: string | null
          assessment_type?: string
          created_at?: string
          crisis_score?: number | null
          id?: string
          next_assessment_due?: string | null
          protective_factors?: Json | null
          recommendations?: Json | null
          reviewed_by?: string | null
          risk_factors?: Json | null
          risk_level?: string
          suicide_risk_level?: string | null
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
      user_therapy_preferences: {
        Row: {
          approach_effectiveness: Json | null
          communication_style: string | null
          created_at: string | null
          crisis_protocols: Json | null
          cultural_adaptations: Json | null
          id: string
          preferred_approaches: string[] | null
          session_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approach_effectiveness?: Json | null
          communication_style?: string | null
          created_at?: string | null
          crisis_protocols?: Json | null
          cultural_adaptations?: Json | null
          id?: string
          preferred_approaches?: string[] | null
          session_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approach_effectiveness?: Json | null
          communication_style?: string | null
          created_at?: string | null
          crisis_protocols?: Json | null
          cultural_adaptations?: Json | null
          id?: string
          preferred_approaches?: string[] | null
          session_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_trust_milestones: {
        Row: {
          achieved_at: string
          discount_unlocked: number | null
          id: string
          milestone_type: string
          notes: string | null
          requirements_met: Json
          user_id: string
        }
        Insert: {
          achieved_at?: string
          discount_unlocked?: number | null
          id?: string
          milestone_type: string
          notes?: string | null
          requirements_met: Json
          user_id: string
        }
        Update: {
          achieved_at?: string
          discount_unlocked?: number | null
          id?: string
          milestone_type?: string
          notes?: string | null
          requirements_met?: Json
          user_id?: string
        }
        Relationships: []
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
      user_verification_history: {
        Row: {
          confidence_score: number | null
          created_at: string
          data_point: string
          detection_method: string
          id: string
          metadata: Json | null
          user_id: string
          value: string
          verification_type: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          data_point: string
          detection_method: string
          id?: string
          metadata?: Json | null
          user_id: string
          value: string
          verification_type: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          data_point?: string
          detection_method?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          value?: string
          verification_type?: string
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
      wellness_challenges: {
        Row: {
          category: string
          challenge_type: string
          created_at: string
          created_by: string | null
          description: string
          end_date: string
          id: string
          is_active: boolean
          reward_points: number | null
          start_date: string
          target_participants: number | null
          title: string
        }
        Insert: {
          category: string
          challenge_type: string
          created_at?: string
          created_by?: string | null
          description: string
          end_date: string
          id?: string
          is_active?: boolean
          reward_points?: number | null
          start_date: string
          target_participants?: number | null
          title: string
        }
        Update: {
          category?: string
          challenge_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean
          reward_points?: number | null
          start_date?: string
          target_participants?: number | null
          title?: string
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
      session_real_time_status: {
        Row: {
          adaptation_effectiveness: number | null
          conversation_flow_score: number | null
          crisis_level: string | null
          current_phase: string | null
          engagement_level: number | null
          goal_progress: Json | null
          last_update: string | null
          risk_assessment_score: number | null
          session_id: string | null
          therapeutic_alliance_score: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      aggregate_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_commission: {
        Args: {
          affiliate_id_param: string
          product_type_param: string
          product_id_param?: string
          order_value_param?: number
        }
        Returns: number
      }
      calculate_daily_usage_cost: {
        Args: { user_id_param: string; date_param: string }
        Returns: {
          total_requests: number
          total_tokens: number
          total_cost: number
          avg_response_time: number
          model_breakdown: Json
        }[]
      }
      calculate_optimal_session_timing: {
        Args: {
          p_session_id: string
          p_current_phase: string
          p_engagement_level?: number
          p_breakthrough_probability?: number
        }
        Returns: Json
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
      check_milestone_achievements: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      cleanup_old_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_trusted_device: {
        Args: {
          user_id_param: string
          device_name_param: string
          device_fingerprint_param: string
          user_agent_param?: string
          ip_address_param?: unknown
        }
        Returns: string
      }
      decrement_event_participants: {
        Args: { event_id: string }
        Returns: undefined
      }
      decrement_post_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      detect_account_sharing: {
        Args: { user_id_param: string }
        Returns: Json
      }
      detect_crisis_indicators: {
        Args: {
          session_messages: string[]
          mood_data: Json
          user_history: Json
        }
        Returns: Json
      }
      detect_usage_anomalies: {
        Args: { user_id_param: string; days_lookback?: number }
        Returns: {
          anomaly_type: string
          anomaly_score: number
          description: string
          date: string
        }[]
      }
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      generate_device_trust_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_emergency_recovery_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_enhanced_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_cached_translation: {
        Args: {
          p_source_text: string
          p_source_lang: string
          p_target_lang: string
          p_context_type?: string
        }
        Returns: string
      }
      get_therapist_review_metrics: {
        Args: { therapist_id: string }
        Returns: {
          average_rating: number
          user_satisfaction: number
          recommendation_rate: number
          total_reviews: number
          effectiveness_areas: string[]
        }[]
      }
      get_therapist_session_metrics: {
        Args: { therapist_id: string }
        Returns: {
          success_rate: number
          mood_improvement_avg: number
          total_sessions: number
        }[]
      }
      get_user_active_therapists: {
        Args: { user_id_param: string; specialty_filter?: string }
        Returns: {
          therapist_id: string
          specialty_focus: string
          therapy_context: string
          treatment_phase: string
          is_primary: boolean
          selection_reason: string
        }[]
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
      increment_event_participants: {
        Args: { event_id: string }
        Returns: undefined
      }
      increment_milestone_celebrations: {
        Args: { milestone_id: string }
        Returns: undefined
      }
      increment_post_comments: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_post_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_review_helpful_count: {
        Args: { review_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: {
          _admin_id: string
          _permission?: Database["public"]["Enums"]["admin_permission"]
        }
        Returns: boolean
      }
      recommend_therapist_combinations: {
        Args: { user_id_param: string; needed_specialties: string[] }
        Returns: Json
      }
      regenerate_backup_codes: {
        Args: { user_id_param: string }
        Returns: Json
      }
      request_data_deletion: {
        Args: {
          user_id_param: string
          deletion_type?: string
          reason_text?: string
        }
        Returns: string
      }
      request_data_export: {
        Args: { user_id_param: string; export_type?: string }
        Returns: string
      }
      select_optimal_technique: {
        Args: {
          p_user_id: string
          p_session_id: string
          p_current_phase: string
          p_emotional_state?: Json
          p_cultural_context?: Json
        }
        Returns: Json
      }
      store_translation: {
        Args: {
          p_source_text: string
          p_translated_text: string
          p_source_lang: string
          p_target_lang: string
          p_context_type?: string
          p_quality?: number
          p_cultural_context?: string
          p_therapeutic_context?: Json
          p_user_id?: string
          p_session_id?: string
        }
        Returns: string
      }
      update_consent: {
        Args: {
          user_id_param: string
          consent_type_param: string
          granted_param: boolean
          user_ip?: unknown
          user_agent_param?: string
        }
        Returns: undefined
      }
      update_goal_streak: {
        Args: { goal_id_param: string }
        Returns: undefined
      }
      upsert_user_cultural_profile: {
        Args: {
          p_user_id: string
          p_cultural_background?: string
          p_primary_language?: string
          p_family_structure?: string
          p_communication_style?: string
          p_religious_considerations?: boolean
          p_religious_details?: string
          p_therapy_approach_preferences?: string[]
          p_cultural_sensitivities?: string[]
        }
        Returns: string
      }
      validate_admin_session: {
        Args: { _session_token: string }
        Returns: string
      }
      verify_backup_code: {
        Args: { user_id_param: string; code_param: string }
        Returns: boolean
      }
      verify_totp_code: {
        Args: { user_id_param: string; code_param: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_permission:
        | "user_management"
        | "system_config"
        | "ai_management"
        | "content_management"
        | "translation_management"
        | "crisis_management"
        | "platform_analytics"
        | "security_management"
        | "audit_logs"
        | "admin_management"
      app_role:
        | "super_admin"
        | "content_admin"
        | "support_admin"
        | "analytics_admin"
        | "user"
      super_admin_role:
        | "super_admin"
        | "content_admin"
        | "support_admin"
        | "analytics_admin"
        | "security_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_permission: [
        "user_management",
        "system_config",
        "ai_management",
        "content_management",
        "translation_management",
        "crisis_management",
        "platform_analytics",
        "security_management",
        "audit_logs",
        "admin_management",
      ],
      app_role: [
        "super_admin",
        "content_admin",
        "support_admin",
        "analytics_admin",
        "user",
      ],
      super_admin_role: [
        "super_admin",
        "content_admin",
        "support_admin",
        "analytics_admin",
        "security_admin",
      ],
    },
  },
} as const
