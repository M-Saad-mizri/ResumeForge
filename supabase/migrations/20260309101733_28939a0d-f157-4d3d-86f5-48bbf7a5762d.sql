
-- Drop restrictive policies
DROP POLICY IF EXISTS "Anyone can create shares" ON public.shared_cvs;
DROP POLICY IF EXISTS "Anyone can read shares" ON public.shared_cvs;

-- Create permissive policies (default)
CREATE POLICY "Anyone can create shares"
ON public.shared_cvs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read shares"
ON public.shared_cvs
FOR SELECT
TO anon, authenticated
USING (true);
