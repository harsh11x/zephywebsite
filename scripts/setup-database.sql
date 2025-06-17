-- Zephyrn Securities Database Setup
-- Run this in your Supabase SQL Editor

-- Create encryption logs table
CREATE TABLE IF NOT EXISTS encryption_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  operation TEXT CHECK (operation IN ('encrypt', 'decrypt')) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for encrypted files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('encrypted-files', 'encrypted-files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE encryption_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own encryption logs" ON encryption_logs;
DROP POLICY IF EXISTS "Users can insert own encryption logs" ON encryption_logs;
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Create policies for encryption_logs table
CREATE POLICY "Users can view own encryption logs" ON encryption_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encryption logs" ON encryption_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage policies for encrypted files
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'encrypted-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'encrypted-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'encrypted-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_encryption_logs_user_id ON encryption_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_logs_created_at ON encryption_logs(created_at DESC);

-- Insert some sample data for demonstration
INSERT INTO encryption_logs (user_id, file_name, operation, file_size, created_at)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sample-' || generate_series || '.pdf',
  CASE WHEN random() > 0.5 THEN 'encrypt' ELSE 'decrypt' END,
  (random() * 10000000)::bigint,
  NOW() - (random() * interval '30 days')
FROM generate_series(1, 10)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' as message;
