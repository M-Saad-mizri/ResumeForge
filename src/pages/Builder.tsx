import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Save, ChevronLeft, Eye, Edit3, Image, Upload, Share2, Link2, MoreVertical, Sparkles, FileDown, Linkedin, Loader2, LogOut, LogIn } from 'lucide-react';
import { useCV } from '@/contexts/CVContext';
import { useAuth } from '@/contexts/AuthContext';
import CVForm from '@/components/cv/CVForm';
import TemplateSelector from '@/components/cv/TemplateSelector';
import DesignCustomizer from '@/components/cv/DesignCustomizer';
import ATSMatcher from '@/components/cv/ATSMatcher';
import LivePreview from '@/components/cv/LivePreview';
import ProfileManager from '@/components/cv/ProfileManager';
import ShareDialog from '@/components/cv/ShareDialog';
import SyncStatusBadge from '@/components/cv/SyncStatusBadge';
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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

  const handleExportATSText = () => {
    const lines: string[] = [];
    const p = cvData.personalInfo;

    lines.push(p.fullName || 'Your Name');
    if (p.title) lines.push(p.title);
    lines.push('');
    if (p.email) lines.push(`Email: ${p.email}`);
    if (p.phone) lines.push(`Phone: ${p.phone}`);
    if (p.location) lines.push(`Location: ${p.location}`);
    if (p.website) lines.push(`Website: ${p.website}`);

    if (p.summary.trim()) {
      lines.push('');
      lines.push('SUMMARY');
      lines.push(p.summary.trim());
    }

    if (cvData.experiences.length > 0) {
      lines.push('');
      lines.push('EXPERIENCE');
      cvData.experiences.forEach((exp) => {
        const dates = [exp.startDate || '', exp.current ? 'Present' : (exp.endDate || '')].filter(Boolean).join(' - ');
        lines.push(`${exp.position || 'Role'} | ${exp.company || 'Company'}${dates ? ` | ${dates}` : ''}`);
        if (exp.description.trim()) lines.push(`- ${exp.description.trim()}`);
      });
    }

    if (cvData.education.length > 0) {
      lines.push('');
      lines.push('EDUCATION');
      cvData.education.forEach((edu) => {
        const dates = [edu.startDate || '', edu.endDate || ''].filter(Boolean).join(' - ');
        lines.push(`${edu.degree || ''}${edu.field ? `, ${edu.field}` : ''} | ${edu.institution || ''}${dates ? ` | ${dates}` : ''}`.trim());
        if (edu.description.trim()) lines.push(`- ${edu.description.trim()}`);
      });
    }

    if (cvData.skills.length > 0) {
      lines.push('');
      lines.push('SKILLS');
      lines.push(cvData.skills.map(s => s.name).filter(Boolean).join(', '));
    }

    if (cvData.languages.length > 0) {
      lines.push('');
      lines.push('LANGUAGES');
      cvData.languages.forEach((lang) => lines.push(`${lang.name} (${lang.proficiency})`));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `${activeProfile?.name || 'My CV'}-ATS.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('ATS-friendly text exported!');
  };

  const handleExportMarkdown = () => {
    const p = cvData.personalInfo;
    const md: string[] = [];

    md.push(`# ${p.fullName || 'Your Name'}`);
    if (p.title) md.push(`**${p.title}**`);
    md.push('');

    const contact = [
      p.email ? `- Email: ${p.email}` : '',
      p.phone ? `- Phone: ${p.phone}` : '',
      p.location ? `- Location: ${p.location}` : '',
      p.website ? `- Website: ${p.website}` : '',
    ].filter(Boolean);
    md.push(...contact);

    if (p.summary.trim()) {
      md.push('');
      md.push('## Summary');
      md.push(p.summary.trim());
    }

    if (cvData.experiences.length > 0) {
      md.push('');
      md.push('## Experience');
      cvData.experiences.forEach((exp) => {
        const dates = [exp.startDate || '', exp.current ? 'Present' : (exp.endDate || '')].filter(Boolean).join(' - ');
        md.push(`### ${exp.position || 'Role'} - ${exp.company || 'Company'}`);
        if (dates) md.push(`*${dates}*`);
        if (exp.description.trim()) md.push(exp.description.trim());
        md.push('');
      });
    }

    if (cvData.education.length > 0) {
      md.push('## Education');
      cvData.education.forEach((edu) => {
        const dates = [edu.startDate || '', edu.endDate || ''].filter(Boolean).join(' - ');
        md.push(`### ${edu.degree || 'Degree'}${edu.field ? `, ${edu.field}` : ''}`);
        md.push(`${edu.institution || 'Institution'}${dates ? ` (${dates})` : ''}`);
        if (edu.description.trim()) md.push(edu.description.trim());
        md.push('');
      });
    }

    if (cvData.skills.length > 0) {
      md.push('## Skills');
      md.push(cvData.skills.map(s => s.name).filter(Boolean).join(', '));
      md.push('');
    }

    if (cvData.languages.length > 0) {
      md.push('## Languages');
      cvData.languages.forEach((lang) => md.push(`- ${lang.name} (${lang.proficiency})`));
      md.push('');
    }

    const blob = new Blob([md.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `${activeProfile?.name || 'My CV'}.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Markdown CV exported!');
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

  const handleLinkedinImport = async () => {
    if (!linkedinText.trim()) {
      toast.error('Please paste your LinkedIn profile text first.');
      return;
    }
    setLinkedinLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cv-ai', {
        body: { action: 'parse_rough_text', payload: { text: linkedinText } },
      });
      if (error) throw error;
      const result = data?.result;
      if (!result) throw new Error('No result from AI');

      // Extract JSON from possible markdown code blocks
      let jsonStr = result;
      const codeBlockMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();

      const parsed = JSON.parse(jsonStr) as CVData;
      setCVData(parsed);
      setLinkedinDialogOpen(false);
      setLinkedinText('');
      toast.success('LinkedIn profile imported! Review and edit your CV.');
    } catch (err) {
      console.error('LinkedIn import error:', err);
      toast.error('Failed to parse LinkedIn data. Try pasting more details.');
    } finally {
      setLinkedinLoading(false);
    }
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
          <SyncStatusBadge />

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
              {/* Import */}
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Import</p>
              <DropdownMenuItem onClick={() => setLinkedinDialogOpen(true)} className="gap-2 cursor-pointer">
                <Linkedin className="w-4 h-4" />
                Import from LinkedIn
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
              <DropdownMenuItem onClick={handleExportATSText} className="gap-2 cursor-pointer">
                <FileText className="w-4 h-4" />
                Export ATS Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2 cursor-pointer">
                <FileDown className="w-4 h-4" />
                Export Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrint()} className="gap-2 cursor-pointer sm:hidden">
                <Download className="w-4 h-4" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</p>
                  <DropdownMenuItem
                    onClick={async () => { await signOut(); navigate('/'); }}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4" />
                    Sign In for Cloud Sync
                  </Link>
                </DropdownMenuItem>
              )}
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
            <ATSMatcher />
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
              <label htmlFor="cv-import-file" className="text-sm font-medium text-foreground mb-2 block">Upload a file</label>
              <input
                id="cv-import-file"
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
              <label htmlFor="cv-import-json-text" className="text-sm font-medium text-foreground mb-2 block">Paste JSON text</label>
              <Textarea
                id="cv-import-json-text"
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

      {/* LinkedIn Import Dialog */}
      <Dialog open={linkedinDialogOpen} onOpenChange={(open) => { setLinkedinDialogOpen(open); if (!open) { setLinkedinText(''); setLinkedinLoading(false); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              Import from LinkedIn
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">How to copy your LinkedIn profile:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to your LinkedIn profile page</li>
                <li>Select all text on the page (Ctrl+A / Cmd+A)</li>
                <li>Copy it (Ctrl+C / Cmd+C)</li>
                <li>Paste it below — AI will extract the relevant info</li>
              </ol>
            </div>
            <Textarea
              placeholder="Paste your LinkedIn profile text here... (name, headline, experience, education, skills, etc.)"
              value={linkedinText}
              onChange={e => setLinkedinText(e.target.value)}
              rows={8}
              className="text-sm"
            />
            <Button
              onClick={handleLinkedinImport}
              className="w-full btn-gold border-0"
              disabled={!linkedinText.trim() || linkedinLoading}
            >
              {linkedinLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is parsing your profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Import with AI
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Builder;
