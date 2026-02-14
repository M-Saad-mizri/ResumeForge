import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Save, Plus, ChevronLeft, Eye, Edit3 } from 'lucide-react';
import { useCV } from '@/contexts/CVContext';
import CVForm from '@/components/cv/CVForm';
import TemplateSelector from '@/components/cv/TemplateSelector';
import LivePreview from '@/components/cv/LivePreview';
import ProfileManager from '@/components/cv/ProfileManager';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Builder = () => {
  const { saveProfile, activeProfile } = useCV();
  const printRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeProfile?.name || 'My CV',
  });

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

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 md:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>

          <Button
            size="sm"
            className="gap-1.5 btn-gold border-0"
            onClick={() => handlePrint()}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
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
    </div>
  );
};

export default Builder;
