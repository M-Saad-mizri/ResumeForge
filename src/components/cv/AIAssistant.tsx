import React, { useState } from 'react';
import { Sparkles, FileText, Briefcase, Star, MessageSquare, Loader2, Wand2, X, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCV } from '@/contexts/CVContext';
import { CVData, Experience } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AIAction = 'generate_summary' | 'generate_description' | 'suggest_skills' | 'review_cv' | 'parse_rough_text' | 'add_related_experience';

interface AIFeature {
  id: AIAction;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AI_FEATURES: AIFeature[] = [
  { id: 'parse_rough_text', icon: <Wand2 className="w-4 h-4" />, title: 'Create CV from Text', description: 'Paste rough info and AI structures it into a CV' },
  { id: 'generate_summary', icon: <FileText className="w-4 h-4" />, title: 'Generate Summary', description: 'AI writes a professional summary' },
  { id: 'generate_description', icon: <Briefcase className="w-4 h-4" />, title: 'Write Job Description', description: 'Generate bullet points for experience' },
  { id: 'add_related_experience', icon: <PlusCircle className="w-4 h-4" />, title: 'Add Related Experience', description: 'Reads your current CV and adds 2 related sample experiences' },
  { id: 'suggest_skills', icon: <Star className="w-4 h-4" />, title: 'Suggest Skills', description: 'Get relevant skill recommendations' },
  { id: 'review_cv', icon: <MessageSquare className="w-4 h-4" />, title: 'Review My CV', description: 'Get AI feedback and improvement tips' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const normalizeExperience = (experience: Partial<Experience>): Experience => ({
  id: generateId(),
  company: experience.company?.trim() || 'Company',
  position: experience.position?.trim() || 'Related Role',
  startDate: experience.startDate?.trim() || '',
  endDate: experience.endDate?.trim() || '',
  current: Boolean(experience.current),
  description: experience.description?.trim() || 'Delivered relevant work aligned with the target role.',
});

const AIAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { cvData, setCVData, updatePersonalInfo } = useCV();
  const [activeFeature, setActiveFeature] = useState<AIAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form states
  const [roughText, setRoughText] = useState('');
  const [summaryTitle, setSummaryTitle] = useState(cvData.personalInfo.title || '');
  const [summaryExp, setSummaryExp] = useState('');
  const [descPosition, setDescPosition] = useState('');
  const [descCompany, setDescCompany] = useState('');
  const [skillsTitle, setSkillsTitle] = useState(cvData.personalInfo.title || '');

  const callAI = async (action: AIAction, payload: Record<string, unknown>) => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('cv-ai', {
        body: { action, payload },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data.result as string;
    } catch (err: any) {
      toast.error(err.message || 'AI request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!summaryTitle.trim()) { toast.error('Enter a job title first'); return; }
    const res = await callAI('generate_summary', { title: summaryTitle, experience: summaryExp });
    if (res) setResult(res);
  };

  const applySummary = () => {
    if (result) {
      updatePersonalInfo('summary', result);
      toast.success('Summary applied!');
      setResult(null);
      setActiveFeature(null);
    }
  };

  const handleGenerateDescription = async () => {
    if (!descPosition.trim() || !descCompany.trim()) { toast.error('Enter position and company'); return; }
    const res = await callAI('generate_description', { position: descPosition, company: descCompany });
    if (res) setResult(res);
  };

  const handleSuggestSkills = async () => {
    if (!skillsTitle.trim()) { toast.error('Enter a job title'); return; }
    const res = await callAI('suggest_skills', { title: skillsTitle });
    if (res) {
      try {
        // Strip markdown code fences if present
        const cleaned = res.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const skills = JSON.parse(cleaned);
        if (Array.isArray(skills)) {
          const newSkills = skills.map((s: any) => ({ id: generateId(), name: s.name, level: Math.min(5, Math.max(1, s.level || 3)) }));
          setCVData({ ...cvData, skills: [...cvData.skills, ...newSkills] });
          toast.success(`${newSkills.length} skills added!`);
          setActiveFeature(null);
        }
      } catch {
        setResult(res);
      }
    }
  };

  const handleReviewCV = async () => {
    if (!cvData.personalInfo.fullName && cvData.experiences.length === 0) {
      toast.error('Add some content to your CV first');
      return;
    }
    const res = await callAI('review_cv', { cvData });
    if (res) setResult(res);
  };

  const handleParseText = async () => {
    if (!roughText.trim()) { toast.error('Paste some text first'); return; }
    const res = await callAI('parse_rough_text', { text: roughText });
    if (res) {
      try {
        const cleaned = res.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned) as CVData;
        // Assign proper IDs
        parsed.experiences = (parsed.experiences || []).map(e => ({ ...e, id: generateId() }));
        parsed.education = (parsed.education || []).map(e => ({ ...e, id: generateId() }));
        parsed.skills = (parsed.skills || []).map(s => ({ ...s, id: generateId() }));
        parsed.languages = (parsed.languages || []).map(l => ({ ...l, id: generateId() }));
        parsed.customSections = parsed.customSections || [];
        parsed.sectionOrder = parsed.sectionOrder || ['personal', 'experience', 'education', 'skills', 'languages'];
        setCVData(parsed);
        toast.success('CV created from your text!');
        setRoughText('');
        setActiveFeature(null);
      } catch {
        setResult('Failed to parse AI response. Here\'s the raw output:\n\n' + res);
      }
    }
  };

  const handleAddRelatedExperience = async () => {
    if (!cvData.personalInfo.title.trim() && cvData.skills.length === 0 && cvData.experiences.length === 0) {
      toast.error('Add a title, skills, or at least one experience first');
      return;
    }

    const res = await callAI('add_related_experience', { cvData });
    if (!res) return;

    try {
      const cleaned = res.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const experiences = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.experiences)
          ? parsed.experiences
          : [];

      if (experiences.length === 0) {
        throw new Error('No experiences were generated');
      }

      const newExperiences = experiences.slice(0, 2).map(normalizeExperience);
      setCVData({
        ...cvData,
        experiences: [...cvData.experiences, ...newExperiences],
      });
      toast.success(`${newExperiences.length} related sample experiences added!`);
      setResult(null);
      setActiveFeature(null);
    } catch {
      setResult('Failed to parse AI response. Here\'s the raw output:\n\n' + res);
    }
  };

  const renderFeatureForm = () => {
    switch (activeFeature) {
      case 'parse_rough_text':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Paste rough info about yourself here... e.g: I'm John, a software engineer at Google since 2020. Before that I worked at Meta. I know React, Python, and have a CS degree from MIT..."
              value={roughText}
              onChange={e => setRoughText(e.target.value)}
              rows={6}
              className="text-sm"
            />
            <Button onClick={handleParseText} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Create CV from Text
            </Button>
          </div>
        );

      case 'generate_summary':
        return (
          <div className="space-y-3">
            <Input placeholder="Job Title (e.g. Senior Developer)" value={summaryTitle} onChange={e => setSummaryTitle(e.target.value)} />
            <Textarea placeholder="Optional: brief experience notes..." value={summaryExp} onChange={e => setSummaryExp(e.target.value)} rows={2} className="text-sm" />
            <Button onClick={handleGenerateSummary} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Summary
            </Button>
            {result && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">{result}</div>
                <Button onClick={applySummary} variant="outline" size="sm" className="w-full">Apply to CV</Button>
              </div>
            )}
          </div>
        );

      case 'generate_description':
        return (
          <div className="space-y-3">
            <Input placeholder="Position (e.g. Product Manager)" value={descPosition} onChange={e => setDescPosition(e.target.value)} />
            <Input placeholder="Company (e.g. Spotify)" value={descCompany} onChange={e => setDescCompany(e.target.value)} />
            <Button onClick={handleGenerateDescription} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
              Generate Description
            </Button>
            {result && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">{result}</div>
                <p className="text-xs text-muted-foreground">Copy and paste this into the relevant experience entry.</p>
              </div>
            )}
          </div>
        );

      case 'add_related_experience':
        return (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground space-y-2">
              <p>AI will read your current CV title, summary, skills, and existing experience.</p>
              <p>It will then add 2 related sample experiences directly into your experience section.</p>
            </div>
            <Button onClick={handleAddRelatedExperience} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              Add 2 Related Experiences
            </Button>
            {result && <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">{result}</div>}
          </div>
        );

      case 'suggest_skills':
        return (
          <div className="space-y-3">
            <Input placeholder="Job Title (e.g. UX Designer)" value={skillsTitle} onChange={e => setSkillsTitle(e.target.value)} />
            <Button onClick={handleSuggestSkills} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              Suggest Skills
            </Button>
            {result && <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">{result}</div>}
          </div>
        );

      case 'review_cv':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">AI will analyze your current CV and provide feedback.</p>
            <Button onClick={handleReviewCV} disabled={loading} className="w-full btn-gold border-0 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Review My CV
            </Button>
            {result && <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">{result}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-display text-base font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close AI Assistant"
          title="Close AI Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!activeFeature ? (
        <div className="space-y-2">
          {AI_FEATURES.map(feature => (
            <button
              key={feature.id}
              onClick={() => { setActiveFeature(feature.id); setResult(null); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                {feature.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => { setActiveFeature(null); setResult(null); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className="w-3 h-3" />
            Back to features
          </button>
          <h4 className="text-sm font-semibold">{AI_FEATURES.find(f => f.id === activeFeature)?.title}</h4>
          {renderFeatureForm()}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
