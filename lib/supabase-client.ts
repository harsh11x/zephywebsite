import { createClient } from "@supabase/supabase-js"

// Create a client-side only supabase client with proper error handling
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured. Using mock client.")
    // Return a mock client for development
    return null
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error("Invalid Supabase URL format:", supabaseUrl)
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton client for non-auth operations with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://")
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Database types for TypeScript
export interface EncryptionLog {
  id: string
  user_id: string
  file_name: string
  operation: "encrypt" | "decrypt"
  file_size: number
  created_at: string
}
