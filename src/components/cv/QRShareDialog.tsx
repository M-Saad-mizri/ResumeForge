import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { compressToEncodedURIComponent } from 'lz-string';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCV } from '@/contexts/CVContext';
import { QrCode, Smartphone } from 'lucide-react';

interface QRShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRShareDialog: React.FC<QRShareDialogProps> = ({ open, onOpenChange }) => {
  const { cvData, template } = useCV();

  const shareUrl = useMemo(() => {
    if (!open) return '';
    const payload = JSON.stringify({ cvData, template, version: 1 });
    const compressed = compressToEncodedURIComponent(payload);
    const base = window.location.origin + '/builder';
    return `${base}?cv=${compressed}`;
  }, [open, cvData, template]);

  const tooLarge = shareUrl.length > 4000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Share via QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code on another device to continue editing your CV.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {tooLarge ? (
            <div className="text-center space-y-2 p-6">
              <p className="text-sm text-muted-foreground">
                Your CV data is too large for a QR code. Please use the <strong>Export JSON</strong> option instead to transfer between devices.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG
                  value={shareUrl}
                  size={240}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>Scan with your phone or tablet camera</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRShareDialog;
