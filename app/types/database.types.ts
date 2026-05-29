// Hand-written Supabase schema types mirroring supabase/migrations/.
// Mirrors `supabase gen types typescript` output; regenerate via the CLI
// once it's installed. Picked up automatically by @nuxtjs/supabase at
// app/types/database.types.ts (clears the "Database = unknown" warning).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          class: string
          race: string
          server: string
          level: number
          deity: string | null
          portrait_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          class: string
          race: string
          server: string
          level?: number
          deity?: string | null
          portrait_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          class?: string
          race?: string
          server?: string
          level?: number
          deity?: string | null
          portrait_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievement_unlocks: {
        Row: {
          id: string
          user_id: string
          character_id: string
          achievement_id: number
          unlocked_at: string
          source: 'manual' | 'log_parse' | 'import'
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          achievement_id: number
          unlocked_at?: string
          source?: 'manual' | 'log_parse' | 'import'
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          achievement_id?: number
          unlocked_at?: string
          source?: 'manual' | 'log_parse' | 'import'
        }
      }
      journey_events: {
        Row: {
          id: string
          user_id: string
          character_id: string
          event_type: string
          title: string
          description: string | null
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          event_type: string
          title: string
          description?: string | null
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          event_type?: string
          title?: string
          description?: string | null
          occurred_at?: string
          created_at?: string
        }
      }
      lore_notes: {
        Row: {
          id: string
          user_id: string
          character_id: string | null
          title: string
          body: string
          note_type: 'general' | 'theory' | 'quote' | 'observation'
          tags: string[]
          linked_type: 'zone' | 'npc' | 'faction' | 'expansion' | 'achievement' | null
          linked_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id?: string | null
          title: string
          body: string
          note_type?: 'general' | 'theory' | 'quote' | 'observation'
          tags?: string[]
          linked_type?: 'zone' | 'npc' | 'faction' | 'expansion' | 'achievement' | null
          linked_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string | null
          title?: string
          body?: string
          note_type?: 'general' | 'theory' | 'quote' | 'observation'
          tags?: string[]
          linked_type?: 'zone' | 'npc' | 'faction' | 'expansion' | 'achievement' | null
          linked_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_items: {
        Row: {
          id: string
          user_id: string
          character_id: string | null
          title: string
          media_type: 'screenshot' | 'audio' | 'video' | 'document'
          url: string
          caption: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id?: string | null
          title: string
          media_type: 'screenshot' | 'audio' | 'video' | 'document'
          url: string
          caption?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string | null
          title?: string
          media_type?: 'screenshot' | 'audio' | 'video' | 'document'
          url?: string
          caption?: string | null
          tags?: string[]
          created_at?: string
        }
      }
      log_events: {
        Row: {
          id: string
          user_id: string
          character_id: string
          raw_line: string
          event_type: string | null
          parsed_data: Json | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          raw_line: string
          event_type?: string | null
          parsed_data?: Json | null
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          raw_line?: string
          event_type?: string | null
          parsed_data?: Json | null
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Character = Database['public']['Tables']['characters']['Row']
export type CharacterInsert = Database['public']['Tables']['characters']['Insert']
export type CharacterUpdate = Database['public']['Tables']['characters']['Update']
