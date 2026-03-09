import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCV } from '@/contexts/CVContext';
import { supabase } from '@/integrations/supabase/client';
import { Link2, Copy, Check, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onOpenChange }) => {
  const { cvData, template, designSettings } = useCV();
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_cvs')
        .insert({
          cv_data: cvData as any,
          template,
          design_settings: designSettings as any,
        })
        .select('id')
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/shared/${data.id}`;
      setShareUrl(url);
      toast.success('Share link created! Valid for 30 days.');
    } catch (err) {
      toast.error('Failed to create share link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setShareUrl('');
      setCopied(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share CV via Link
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link to your CV. Anyone with the link can view and import it. Links expire after 30 days.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!shareUrl ? (
            <Button onClick={handleShare} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating link...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Generate Share Link
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-xs" />
                <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Anyone with this link can view and import your CV
              </p>
              <Button onClick={handleShare} variant="outline" size="sm" className="w-full gap-2">
                <Link2 className="w-4 h-4" />
                Generate New Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
