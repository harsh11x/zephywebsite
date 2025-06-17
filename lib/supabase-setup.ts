// Supabase Setup Guide and Configuration Helper

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

export function validateSupabaseConfig(): {
  isValid: boolean
  missing: string[]
  config: Partial<SupabaseConfig>
} {
  const config: Partial<SupabaseConfig> = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const missing: string[] = []

  if (!config.url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL")
  } else if (!config.url.startsWith("https://") || !config.url.includes(".supabase.co")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL (invalid format)")
  }

  if (!config.anonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  if (!config.serviceKey) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY (optional for admin features)")
  }

  return {
    isValid: missing.length === 0 || (missing.length === 1 && missing[0].includes("SERVICE_ROLE")),
    missing,
    config,
  }
}

export const SUPABASE_SETUP_GUIDE = {
  title: "Supabase Setup Guide",
  steps: [
    {
      step: 1,
      title: "Create a Supabase Project",
      description: "Go to https://supabase.com and create a new project",
      details: [
        "Sign up for a free Supabase account",
        "Click 'New Project'",
        "Choose your organization",
        "Enter project name and database password",
        "Select a region close to your users",
        "Wait for the project to be created (2-3 minutes)",
      ],
    },
    {
      step: 2,
      title: "Get Your Project Credentials",
      description: "Find your project URL and API keys",
      details: [
        "Go to Project Settings → API",
        "Copy the 'Project URL' (starts with https://)",
        "Copy the 'anon public' key",
        "Copy the 'service_role' key (for admin features)",
      ],
    },
    {
      step: 3,
      title: "Set Environment Variables",
      description: "Add the credentials to your .env.local file",
      envVars: [
        {
          name: "NEXT_PUBLIC_SUPABASE_URL",
          example: "https://your-project.supabase.co",
          required: true,
        },
        {
          name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          required: true,
        },
        {
          name: "SUPABASE_SERVICE_ROLE_KEY",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          required: false,
          note: "Required for admin features like creating test users",
        },
      ],
    },
    {
      step: 4,
      title: "Configure Authentication",
      description: "Set up authentication providers",
      details: [
        "Go to Authentication → Settings",
        "Configure Site URL: http://localhost:3000 (development)",
        "Add production URL when deploying",
        "Enable Google OAuth (optional):",
        "  - Go to Authentication → Providers",
        "  - Enable Google provider",
        "  - Add your Google OAuth credentials",
      ],
    },
    {
      step: 5,
      title: "Create Database Tables",
      description: "Set up required database schema",
      sql: `
-- Create encryption logs table
CREATE TABLE encryption_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  operation TEXT CHECK (operation IN ('encrypt', 'decrypt')) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for encrypted files
INSERT INTO storage.buckets (id, name, public) VALUES ('encrypted-files', 'encrypted-files', false);

-- Set up Row Level Security (RLS)
ALTER TABLE encryption_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY "Users can view own encryption logs" ON encryption_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert own encryption logs" ON encryption_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'encrypted-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'encrypted-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'encrypted-files' AND auth.uid()::text = (storage.foldername(name))[1]);
      `,
    },
  ],
}
