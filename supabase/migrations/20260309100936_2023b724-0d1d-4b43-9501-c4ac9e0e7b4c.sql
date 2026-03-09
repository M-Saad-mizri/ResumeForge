
CREATE TABLE public.shared_cvs (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(6), 'hex'),
  cv_data JSONB NOT NULL,
  template TEXT NOT NULL,
  design_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days')
);

-- Allow anyone to insert (share) and read (load)
ALTER TABLE public.shared_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create shares" ON public.shared_cvs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read shares" ON public.shared_cvs FOR SELECT TO anon, authenticated USING (true);
