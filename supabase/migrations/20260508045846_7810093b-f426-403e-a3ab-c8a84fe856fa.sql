DROP POLICY IF EXISTS "Anyone can read shares" ON public.shared_cvs;
CREATE POLICY "Anyone can read non-expired shares"
ON public.shared_cvs
FOR SELECT
TO anon, authenticated
USING (expires_at > now());