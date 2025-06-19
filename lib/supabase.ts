import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          deadline: string
          priority: "high" | "medium" | "low"
          status: "pending" | "done"
          remind_h1: boolean
          remind_h0: boolean
          remind_h5h: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          deadline: string
          priority?: "high" | "medium" | "low"
          status?: "pending" | "done"
          remind_h1?: boolean
          remind_h0?: boolean
          remind_h5h?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          deadline?: string
          priority?: "high" | "medium" | "low"
          status?: "pending" | "done"
          remind_h1?: boolean
          remind_h0?: boolean
          remind_h5h?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
