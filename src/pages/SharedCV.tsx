import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCV } from '@/contexts/CVContext';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CVData, TemplateType } from '@/types/cv';

const SharedCV = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCVData, setTemplate } = useCV();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSharedCV = async () => {
      if (!id) { setError('Invalid link'); setLoading(false); return; }

      const { data, error: dbError } = await supabase
        .from('shared_cvs')
        .select('*')
        .eq('id', id)
        .single();

      if (dbError || !data) {
        setError('This share link has expired or does not exist.');
        setLoading(false);
        return;
      }

      // Check expiry
      if (new Date(data.expires_at) < new Date()) {
        setError('This share link has expired.');
        setLoading(false);
        return;
      }

      setCVData(data.cv_data as unknown as CVData);
      setTemplate(data.template as TemplateType);
      toast.success('CV loaded! You can now edit and save it.');
      navigate('/builder', { replace: true });
    };

    loadSharedCV();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading shared CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
          <h1 className="text-xl font-bold text-foreground">Link Not Available</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/builder')} className="btn-gold border-0 gap-2">
            <FileText className="w-4 h-4" />
            Create Your Own CV
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SharedCV;
