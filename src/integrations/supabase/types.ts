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
      blocker_resolutions: {
        Row: {
          blocker_id: string
          blocker_type: string
          boss_name: string | null
          created_at: string | null
          id: string
          player_id: string
          resolved_at: string | null
          session_id: string
          spores_rewarded: number | null
          xp_rewarded: number | null
        }
        Insert: {
          blocker_id: string
          blocker_type: string
          boss_name?: string | null
          created_at?: string | null
          id?: string
          player_id: string
          resolved_at?: string | null
          session_id: string
          spores_rewarded?: number | null
          xp_rewarded?: number | null
        }
        Update: {
          blocker_id?: string
          blocker_type?: string
          boss_name?: string | null
          created_at?: string | null
          id?: string
          player_id?: string
          resolved_at?: string | null
          session_id?: string
          spores_rewarded?: number | null
          xp_rewarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blocker_resolutions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocker_resolutions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      card_evaluations: {
        Row: {
          card_id: string
          created_at: string | null
          factor_1_explanation: string | null
          factor_1_name: string
          factor_1_score: number
          factor_2_explanation: string | null
          factor_2_name: string
          factor_2_score: number
          factor_3_explanation: string | null
          factor_3_name: string
          factor_3_score: number
          factor_4_explanation: string | null
          factor_4_name: string
          factor_4_score: number
          factor_5_explanation: string | null
          factor_5_name: string
          factor_5_score: number
          id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          factor_1_explanation?: string | null
          factor_1_name: string
          factor_1_score: number
          factor_2_explanation?: string | null
          factor_2_name: string
          factor_2_score: number
          factor_3_explanation?: string | null
          factor_3_name: string
          factor_3_score: number
          factor_4_explanation?: string | null
          factor_4_name: string
          factor_4_score: number
          factor_5_explanation?: string | null
          factor_5_name: string
          factor_5_score: number
          id?: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          factor_1_explanation?: string | null
          factor_1_name?: string
          factor_1_score?: number
          factor_2_explanation?: string | null
          factor_2_name?: string
          factor_2_score?: number
          factor_3_explanation?: string | null
          factor_3_name?: string
          factor_3_score?: number
          factor_4_explanation?: string | null
          factor_4_name?: string
          factor_4_score?: number
          factor_5_explanation?: string | null
          factor_5_name?: string
          factor_5_score?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_evaluations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "dynamic_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_generation_events: {
        Row: {
          card_id: string
          conversation_context: Json | null
          created_at: string | null
          id: string
          player_id: string
          session_id: string | null
          trigger_type: string
        }
        Insert: {
          card_id: string
          conversation_context?: Json | null
          created_at?: string | null
          id?: string
          player_id: string
          session_id?: string | null
          trigger_type: string
        }
        Update: {
          card_id?: string
          conversation_context?: Json | null
          created_at?: string | null
          id?: string
          player_id?: string
          session_id?: string | null
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_generation_events_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "dynamic_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_generation_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
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
      collaboration_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          player_id: string
          session_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          player_id: string
          session_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          player_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_activity_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_activity_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          challenge_text: string
          challenge_type: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_count: number | null
          id: string
          phase: string
          player_id: string
          spores_reward: number | null
          stage_number: number
          target_count: number | null
          xp_reward: number | null
        }
        Insert: {
          challenge_date?: string
          challenge_text: string
          challenge_type: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          phase: string
          player_id: string
          spores_reward?: number | null
          stage_number: number
          target_count?: number | null
          xp_reward?: number | null
        }
        Update: {
          challenge_date?: string
          challenge_text?: string
          challenge_type?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          phase?: string
          player_id?: string
          spores_reward?: number | null
          stage_number?: number
          target_count?: number | null
          xp_reward?: number | null
        }
        Relationships: []
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
      dynamic_cards: {
        Row: {
          average_score: number | null
          card_type: string
          content: string
          contributing_characters: string[] | null
          created_at: string | null
          created_by_character: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          last_used_at: string | null
          level: number
          player_id: string
          rarity: string
          session_id: string | null
          tags: string[] | null
          times_used: number | null
          title: string
          updated_at: string | null
          visual_theme: string | null
        }
        Insert: {
          average_score?: number | null
          card_type: string
          content: string
          contributing_characters?: string[] | null
          created_at?: string | null
          created_by_character?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          last_used_at?: string | null
          level: number
          player_id: string
          rarity: string
          session_id?: string | null
          tags?: string[] | null
          times_used?: number | null
          title: string
          updated_at?: string | null
          visual_theme?: string | null
        }
        Update: {
          average_score?: number | null
          card_type?: string
          content?: string
          contributing_characters?: string[] | null
          created_at?: string | null
          created_by_character?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          last_used_at?: string | null
          level?: number
          player_id?: string
          rarity?: string
          session_id?: string | null
          tags?: string[] | null
          times_used?: number | null
          title?: string
          updated_at?: string | null
          visual_theme?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_cards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
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
          project_color: string | null
          project_description: string | null
          project_icon: string | null
          project_name: string | null
          started_at: string | null
          updated_at: string | null
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
          project_color?: string | null
          project_description?: string | null
          project_icon?: string | null
          project_name?: string | null
          started_at?: string | null
          updated_at?: string | null
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
          project_color?: string | null
          project_description?: string | null
          project_icon?: string | null
          project_name?: string | null
          started_at?: string | null
          updated_at?: string | null
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
          boss_blockers_defeated: Json | null
          code_health: number | null
          completed_tasks: Json | null
          created_at: string | null
          current_phase: Database["public"]["Enums"]["game_phase"] | null
          current_stage_number: number | null
          current_stage_progress: number | null
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
          boss_blockers_defeated?: Json | null
          code_health?: number | null
          completed_tasks?: Json | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          current_stage_number?: number | null
          current_stage_progress?: number | null
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
          boss_blockers_defeated?: Json | null
          code_health?: number | null
          completed_tasks?: Json | null
          created_at?: string | null
          current_phase?: Database["public"]["Enums"]["game_phase"] | null
          current_stage_number?: number | null
          current_stage_progress?: number | null
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
      player_artifacts: {
        Row: {
          artifact_id: string
          created_at: string | null
          id: string
          player_id: string
          unlocked_at: string | null
        }
        Insert: {
          artifact_id: string
          created_at?: string | null
          id?: string
          player_id: string
          unlocked_at?: string | null
        }
        Update: {
          artifact_id?: string
          created_at?: string | null
          id?: string
          player_id?: string
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_artifacts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
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
      prompt_library: {
        Row: {
          category: string
          contributing_characters: string[] | null
          created_at: string | null
          created_by_character: string | null
          description: string | null
          effectiveness_rating: number | null
          id: string
          is_favorite: boolean | null
          is_template: boolean | null
          last_used_at: string | null
          parent_prompt_id: string | null
          phase: Database["public"]["Enums"]["game_phase"] | null
          player_id: string
          prompt_text: string
          prompt_variables: Json | null
          session_id: string | null
          tags: string[] | null
          times_used: number | null
          title: string
          updated_at: string | null
          version: number
        }
        Insert: {
          category: string
          contributing_characters?: string[] | null
          created_at?: string | null
          created_by_character?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_favorite?: boolean | null
          is_template?: boolean | null
          last_used_at?: string | null
          parent_prompt_id?: string | null
          phase?: Database["public"]["Enums"]["game_phase"] | null
          player_id: string
          prompt_text: string
          prompt_variables?: Json | null
          session_id?: string | null
          tags?: string[] | null
          times_used?: number | null
          title: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          category?: string
          contributing_characters?: string[] | null
          created_at?: string | null
          created_by_character?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_favorite?: boolean | null
          is_template?: boolean | null
          last_used_at?: string | null
          parent_prompt_id?: string | null
          phase?: Database["public"]["Enums"]["game_phase"] | null
          player_id?: string
          prompt_text?: string
          prompt_variables?: Json | null
          session_id?: string | null
          tags?: string[] | null
          times_used?: number | null
          title?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_library_parent_prompt_id_fkey"
            columns: ["parent_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_library_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_library_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_usage_history: {
        Row: {
          context: string | null
          feedback_notes: string | null
          id: string
          player_id: string
          prompt_id: string
          used_at: string | null
          was_helpful: boolean | null
        }
        Insert: {
          context?: string | null
          feedback_notes?: string | null
          id?: string
          player_id: string
          prompt_id: string
          used_at?: string | null
          was_helpful?: boolean | null
        }
        Update: {
          context?: string | null
          feedback_notes?: string | null
          id?: string
          player_id?: string
          prompt_id?: string
          used_at?: string | null
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_usage_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_usage_history_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_library"
            referencedColumns: ["id"]
          },
        ]
      }
      session_collaborators: {
        Row: {
          accepted_at: string | null
          access_level: Database["public"]["Enums"]["session_access_level"]
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          last_active_at: string | null
          player_id: string
          session_id: string
        }
        Insert: {
          accepted_at?: string | null
          access_level?: Database["public"]["Enums"]["session_access_level"]
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          last_active_at?: string | null
          player_id: string
          session_id: string
        }
        Update: {
          accepted_at?: string | null
          access_level?: Database["public"]["Enums"]["session_access_level"]
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          last_active_at?: string | null
          player_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_collaborators_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_collaborators_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_collaborators_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_invites: {
        Row: {
          access_level: Database["public"]["Enums"]["session_access_level"]
          created_at: string | null
          expires_at: string
          id: string
          invite_token: string
          invited_by: string
          invited_email: string
          invited_player_id: string | null
          responded_at: string | null
          session_id: string
          status: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["session_access_level"]
          created_at?: string | null
          expires_at?: string
          id?: string
          invite_token: string
          invited_by: string
          invited_email: string
          invited_player_id?: string | null
          responded_at?: string | null
          session_id: string
          status?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["session_access_level"]
          created_at?: string | null
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string
          invited_email?: string
          invited_player_id?: string | null
          responded_at?: string | null
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_invites_invited_player_id_fkey"
            columns: ["invited_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_invites_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_completions: {
        Row: {
          completed_at: string
          id: string
          phase: string
          player_id: string
          session_id: string
          stage_label: string
          stage_number: number
          tasks_completed: number | null
          time_spent_seconds: number | null
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string
          id?: string
          phase: string
          player_id: string
          session_id: string
          stage_label: string
          stage_number: number
          tasks_completed?: number | null
          time_spent_seconds?: number | null
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string
          id?: string
          phase?: string
          player_id?: string
          session_id?: string
          stage_label?: string
          stage_number?: number
          tasks_completed?: number | null
          time_spent_seconds?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      has_valid_invitation: {
        Args: { p_player_id: string; p_session_id: string }
        Returns: boolean
      }
      is_session_owner: { Args: { p_session_id: string }; Returns: boolean }
      is_session_owner_or_editor: {
        Args: { p_session_id: string }
        Returns: boolean
      }
      migrate_phase_data: { Args: never; Returns: undefined }
    }
    Enums: {
      game_phase:
        | "SPARK"
        | "EXPLORE"
        | "CRAFT"
        | "FORGE"
        | "POLISH"
        | "LAUNCH"
        | "VISION"
        | "RESEARCH"
        | "PROTOTYPE"
        | "BUILD"
        | "GROW"
      session_access_level: "owner" | "editor" | "viewer"
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
      game_phase: [
        "SPARK",
        "EXPLORE",
        "CRAFT",
        "FORGE",
        "POLISH",
        "LAUNCH",
        "VISION",
        "RESEARCH",
        "PROTOTYPE",
        "BUILD",
        "GROW",
      ],
      session_access_level: ["owner", "editor", "viewer"],
    },
  },
} as const
