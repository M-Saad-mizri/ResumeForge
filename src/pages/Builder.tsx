import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Download, Save, ChevronLeft, Eye, Edit3, Image, Upload, Share2, Link2, MoreVertical, Sparkles, FileDown, Linkedin, Loader2 } from 'lucide-react';
import { useCV } from '@/contexts/CVContext';
import CVForm from '@/components/cv/CVForm';
import TemplateSelector from '@/components/cv/TemplateSelector';
import DesignCustomizer from '@/components/cv/DesignCustomizer';
import LivePreview from '@/components/cv/LivePreview';
import ProfileManager from '@/components/cv/ProfileManager';
import ShareDialog from '@/components/cv/ShareDialog';
import AIAssistant from '@/components/cv/AIAssistant';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CVData, TemplateType, sampleCVData, defaultDesignSettings } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';

const Builder = () => {
  const { saveProfile, activeProfile, cvData, template, designSettings, setCVData, setTemplate } = useCV();
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [linkedinDialogOpen, setLinkedinDialogOpen] = useState(false);
  const [linkedinText, setLinkedinText] = useState('');
  const [linkedinLoading, setLinkedinLoading] = useState(false);
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
    const exportData = { cvData, template, designSettings, exportedAt: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${activeProfile?.name || 'My CV'}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('CV exported as JSON! Transfer this file to any device to continue editing.');
  };

  const parseAndImportJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.cvData || !parsed.template) {
        toast.error('Invalid CV file format');
        return;
      }
      setCVData(parsed.cvData as CVData);
      setTemplate(parsed.template as TemplateType);
      setImportDialogOpen(false);
      setImportJsonText('');
      toast.success('CV imported successfully! You can now continue editing.');
    } catch {
      toast.error('Failed to read CV file. Make sure it\'s valid JSON.');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      parseAndImportJSON(event.target?.result as string);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportFromText = () => {
    if (!importJsonText.trim()) {
      toast.error('Please paste JSON content first.');
      return;
    }
    parseAndImportJSON(importJsonText);
  };

  const handleDownloadSampleJSON = () => {
    const sampleExport = {
      cvData: sampleCVData,
      template: 'modern' as TemplateType,
      designSettings: defaultDesignSettings,
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    const blob = new Blob([JSON.stringify(sampleExport, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'ResumeForge-Sample.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Sample JSON downloaded! Edit it and import back to create your CV.');
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
          <Button
            variant={showAI ? "default" : "outline"}
            size="sm"
            className={`gap-1.5 ${showAI ? 'btn-gold border-0' : ''}`}
            onClick={() => setShowAI(!showAI)}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI</span>
          </Button>

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
            <DropdownMenuContent align="end" className="w-52 bg-popover z-50">
              {/* Data Transfer */}
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Data Transfer</p>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className="gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
                <Share2 className="w-4 h-4" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadSampleJSON} className="gap-2 cursor-pointer">
                <FileDown className="w-4 h-4" />
                Download Sample JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Sharing */}
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Sharing</p>
              <DropdownMenuItem onClick={() => setQrDialogOpen(true)} className="gap-2 cursor-pointer">
                <Link2 className="w-4 h-4" />
                Share via Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Export */}
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Export</p>
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
          {showAI && (
            <div className="border-b border-border">
              <AIAssistant onClose={() => setShowAI(false)} />
            </div>
          )}
          <div className="p-4 space-y-4">
            <TemplateSelector />
            <DesignCustomizer />
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

      <ShareDialog open={qrDialogOpen} onOpenChange={setQrDialogOpen} />

      <Dialog open={importDialogOpen} onOpenChange={(open) => { setImportDialogOpen(open); if (!open) setImportJsonText(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import JSON</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Upload a file</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportJSON}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Paste JSON text</label>
              <Textarea
                placeholder='{"cvData": {...}, "template": "modern", ...}'
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                rows={6}
                className="font-mono text-xs"
              />
            </div>
            <Button onClick={handleImportFromText} className="w-full btn-gold border-0" disabled={!importJsonText.trim()}>
              Import from Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Builder;
