export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          id: string
          player_id: string
          unlocked_at: string | null
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          id?: string
          player_id: string
          unlocked_at?: string | null
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          id?: string
          player_id?: string
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          game_events: Json | null
          id: string
          role: string
          segments: Json | null
          session_id: string
          suggested_actions: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          game_events?: Json | null
          id?: string
          role: string
          segments?: Json | null
          session_id: string
          suggested_actions?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          game_events?: Json | null
          id?: string
          role?: string
          segments?: Json | null
          session_id?: string
          suggested_actions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logins: {
        Row: {
          created_at: string | null
          id: string
          login_date: string
          player_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          login_date: string
          player_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          login_date?: string
          player_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_phase: Database["public"]["Enums"]["game_phase"] | null
          final_level: number | null
          final_xp: number | null
          id: string
          is_active: boolean | null
          last_login: string | null
          player_id: string
          started_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          final_level?: number | null
          final_xp?: number | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          player_id: string
          started_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          final_level?: number | null
          final_xp?: number | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          player_id?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_states: {
        Row: {
          blockers: Json | null
          code_health: number | null
          completed_tasks: Json | null
          created_at: string | null
          current_phase: Database["public"]["Enums"]["game_phase"] | null
          current_tasks: Json | null
          energy: number | null
          id: string
          last_energy_update: string | null
          level: number | null
          milestones: Json | null
          session_id: string
          spores: number | null
          streak: number | null
          team_mood: Json | null
          xp: number | null
        }
        Insert: {
          blockers?: Json | null
          code_health?: number | null
          completed_tasks?: Json | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          current_tasks?: Json | null
          energy?: number | null
          id?: string
          last_energy_update?: string | null
          level?: number | null
          milestones?: Json | null
          session_id: string
          spores?: number | null
          streak?: number | null
          team_mood?: Json | null
          xp?: number | null
        }
        Update: {
          blockers?: Json | null
          code_health?: number | null
          completed_tasks?: Json | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          current_tasks?: Json | null
          energy?: number | null
          id?: string
          last_energy_update?: string | null
          level?: number | null
          milestones?: Json | null
          session_id?: string
          spores?: number | null
          streak?: number | null
          team_mood?: Json | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_states_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      player_progress: {
        Row: {
          created_at: string | null
          has_completed_tutorial: boolean | null
          player_id: string
          tutorial_step: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          has_completed_tutorial?: boolean | null
          player_id: string
          tutorial_step?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          has_completed_tutorial?: boolean | null
          player_id?: string
          tutorial_step?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_test_user: boolean | null
          updated_at: string | null
          user_type: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_test_user?: boolean | null
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_test_user?: boolean | null
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string | null
          event_category: string | null
          event_data: Json | null
          event_type: string
          id: string
          is_test_event: boolean | null
          page_url: string | null
          player_id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          is_test_event?: boolean | null
          page_url?: string | null
          player_id: string
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          is_test_event?: boolean | null
          page_url?: string | null
          player_id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      game_phase:
        | "INCEPTION"
        | "RESEARCH"
        | "DESIGN"
        | "BUILD"
        | "TEST"
        | "SHIP"
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
      game_phase: ["INCEPTION", "RESEARCH", "DESIGN", "BUILD", "TEST", "SHIP"],
    },
  },
} as const
