import { createClient } from "@supabase/supabase-js"

// Create and export the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface EncryptionLog {
  id: string
  user_id: string
  file_name: string
  operation: "encrypt" | "decrypt"
  file_size: number
  created_at: string
}
