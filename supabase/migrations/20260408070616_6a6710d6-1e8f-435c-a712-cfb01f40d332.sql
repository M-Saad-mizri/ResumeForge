-- Add user_id column to shared_cvs (nullable for existing rows)
ALTER TABLE public.shared_cvs ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the old permissive INSERT policy
DROP POLICY "Anyone can create shares" ON public.shared_cvs;

-- Create new INSERT policy requiring authentication and ownership
CREATE POLICY "Authenticated users can create shares" ON public.shared_cvs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy so users can remove their own shares
CREATE POLICY "Users can delete own shares" ON public.shared_cvs
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);