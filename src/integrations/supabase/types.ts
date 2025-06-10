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
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          onboarding_complete: boolean | null
          plan: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          onboarding_complete?: boolean | null
          plan?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_complete?: boolean | null
          plan?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
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
