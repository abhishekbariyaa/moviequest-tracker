
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
      user_movies: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          title: string
          year: string
          type: string
          imdb_rating: string
          genre: string
          plot: string
          director: string
          actors: string
          poster: string
          franchise: string | null
          status: string
          date_added: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          title: string
          year: string
          type: string
          imdb_rating: string
          genre: string
          plot: string
          director: string
          actors: string
          poster: string
          franchise?: string | null
          status: string
          date_added: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          title?: string
          year?: string
          type?: string
          imdb_rating?: string
          genre?: string
          plot?: string
          director?: string
          actors?: string
          poster?: string
          franchise?: string | null
          status?: string
          date_added?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
