import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Download, Save, ChevronLeft, Eye, Edit3, Image, Upload, Share2, QrCode, MoreVertical } from 'lucide-react';
import { useCV } from '@/contexts/CVContext';
import CVForm from '@/components/cv/CVForm';
import TemplateSelector from '@/components/cv/TemplateSelector';
import LivePreview from '@/components/cv/LivePreview';
import ProfileManager from '@/components/cv/ProfileManager';
import QRShareDialog from '@/components/cv/QRShareDialog';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CVData, TemplateType } from '@/types/cv';

const Builder = () => {
  const { saveProfile, activeProfile, cvData, template, setCVData, setTemplate } = useCV();
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-import from QR code URL
  useEffect(() => {
    const cvParam = searchParams.get('cv');
    if (cvParam) {
      try {
        const decompressed = decompressFromEncodedURIComponent(cvParam);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.cvData && parsed.template) {
            setCVData(parsed.cvData as CVData);
            setTemplate(parsed.template as TemplateType);
            toast.success('CV loaded from QR code! You can now continue editing.');
          }
        }
      } catch {
        toast.error('Failed to load CV from link.');
      }
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeProfile?.name || 'My CV',
  });

  const handleExportImage = async () => {
    if (!printRef.current) return;
    try {
      toast.loading('Generating HD image...');
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${activeProfile?.name || 'My CV'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.dismiss();
      toast.success('HD image exported!');
    } catch {
      toast.dismiss();
      toast.error('Failed to export image');
    }
  };

  const handleExportJSON = () => {
    const exportData = { cvData, template, exportedAt: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${activeProfile?.name || 'My CV'}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('CV exported as JSON! Transfer this file to any device to continue editing.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.cvData || !parsed.template) {
          toast.error('Invalid CV file format');
          return;
        }
        setCVData(parsed.cvData as CVData);
        setTemplate(parsed.template as TemplateType);
        toast.success('CV imported successfully! You can now continue editing.');
      } catch {
        toast.error('Failed to read CV file. Make sure it\'s a valid JSON export.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const name = saveName.trim() || activeProfile?.name || 'My CV';
    saveProfile(name);
    setSaveDialogOpen(false);
    setSaveName('');
    toast.success('CV saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between no-print sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground hidden sm:inline">ResumeForge</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ProfileManager />

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save CV Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input
                  placeholder="Profile name (e.g., Tech Resume)"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
                <Button onClick={handleSave} className="w-full btn-gold border-0">
                  Save Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 md:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <MoreVertical className="w-4 h-4" />
                <span className="hidden sm:inline">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
                <Share2 className="w-4 h-4" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setQrDialogOpen(true)} className="gap-2 cursor-pointer">
                <QrCode className="w-4 h-4" />
                QR Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportImage} className="gap-2 cursor-pointer">
                <Image className="w-4 h-4" />
                Export HD Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrint()} className="gap-2 cursor-pointer sm:hidden">
                <Download className="w-4 h-4" />
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className="gap-1.5 btn-gold border-0 hidden sm:inline-flex"
            onClick={() => handlePrint()}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className={`w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border overflow-y-auto bg-card ${showPreview ? 'hidden md:block' : ''}`}>
          <div className="p-4 space-y-4">
            <TemplateSelector />
            <CVForm />
          </div>
        </div>

        {/* Right: Preview */}
        <div className={`flex-1 overflow-y-auto bg-muted/50 p-4 md:p-8 ${!showPreview ? 'hidden md:block' : ''}`}>
          <div className="flex justify-center">
            <LivePreview ref={printRef} />
          </div>
        </div>
      </div>

      <QRShareDialog open={qrDialogOpen} onOpenChange={setQrDialogOpen} />
    </div>
  );
};

export default Builder;
