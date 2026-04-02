-- Create cv_profiles table for cross-device sync
CREATE TABLE public.cv_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My CV',
  cv_data jsonb NOT NULL DEFAULT '{}',
  template text NOT NULL DEFAULT 'modern',
  design_settings jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cv_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own profiles
CREATE POLICY "Users can select own profiles"
  ON public.cv_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiles"
  ON public.cv_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON public.cv_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON public.cv_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX cv_profiles_user_id_idx ON public.cv_profiles(user_id);
