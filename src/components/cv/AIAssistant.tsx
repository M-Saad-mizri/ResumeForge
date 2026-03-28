import React, { useState } from 'react';
import { Sparkles, FileText, Briefcase, Star, MessageSquare, Loader2, Wand2, X, ChevronDown, ChevronUp, PlusCircle, Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCV } from '@/contexts/CVContext';
import { CVData, Experience } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AIAction = 'generate_summary' | 'generate_description' | 'suggest_skills' | 'review_cv' | 'parse_rough_text' | 'add_related_experience' | 'generate_cover_letter';

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
  { id: 'generate_cover_letter', icon: <Mail className="w-4 h-4" />, title: 'Generate Cover Letter', description: 'Creates a tailored cover letter from your CV data' },
  { id: 'suggest_skills', icon: <Star className="w-4 h-4" />, title: 'Suggest Skills', description: 'Get relevant skill recommendations' },
  { id: 'review_cv', icon: <MessageSquare className="w-4 h-4" />, title: 'Review My CV', description: 'Get AI feedback and improvement tips' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

// Renders AI markdown output (bold, headings, bullet lists) as React elements
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let keyCounter = 0;
  const k = () => keyCounter++;

  const renderInline = (raw: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = regex.exec(raw)) !== null) {
      if (m.index > last) parts.push(raw.slice(last, m.index));
      parts.push(<strong key={k()} className="font-semibold text-foreground">{m[1]}</strong>);
      last = m.index + m[0].length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={k()} className="space-y-1.5 pl-1">{listItems}</ul>);
      listItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }

    // Heading: ## or ###
    if (/^#{1,3}\s/.test(line)) {
      flushList();
      const text = line.replace(/^#{1,3}\s/, '');
      elements.push(<p key={k()} className="font-semibold text-foreground text-sm mt-2">{renderInline(text)}</p>);
      continue;
    }

    // Bold-only line (acts as a section heading)
    if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      flushList();
      elements.push(<p key={k()} className="font-semibold text-foreground text-sm mt-2">{renderInline(line.replace(/:$/, ''))}</p>);
      continue;
    }

    // Bullet: * or -
    if (/^[*-]\s+/.test(line)) {
      const content = line.replace(/^[*-]\s+/, '');
      listItems.push(
        <li key={k()} className="flex gap-2 text-sm text-muted-foreground">
          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-accent/70 inline-block" />
          <span>{renderInline(content)}</span>
        </li>
      );
      continue;
    }

    // Plain paragraph
    flushList();
    elements.push(<p key={k()} className="text-sm text-muted-foreground leading-relaxed">{renderInline(line)}</p>);
  }
  flushList();
  return elements;
};

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
  const [coverRole, setCoverRole] = useState(cvData.personalInfo.title || '');
  const [coverCompany, setCoverCompany] = useState('');
  const [coverTone, setCoverTone] = useState<'professional' | 'confident' | 'friendly'>('professional');
  const [coverJobFocus, setCoverJobFocus] = useState('');

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

  const handleAddRelatedExperience = () => {
    const title = cvData.personalInfo.title.trim();
    const skills = cvData.skills.slice(0, 5).map(s => s.name).filter(Boolean);

    if (!title && skills.length === 0 && cvData.experiences.length === 0) {
      toast.error('Add a job title, skills, or at least one experience first');
      return;
    }

    const isSenior = /senior|sr\b|lead|principal|manager|director|head|chief/i.test(title);
    const baseRole = title
      .replace(/^(senior|sr\.|lead|principal|junior|jr\.|associate|entry\s+level)\s+/i, '')
      .trim() || 'Professional';

    const skillsStr = skills.length > 0 ? skills.slice(0, 3).join(', ') : 'core industry tools';
    const currentYear = new Date().getFullYear();

    // Derive industry-contextual company names from the job title
    const inferCompanyNames = (role: string): [string, string] => {
      const r = role.toLowerCase();
      if (/software|developer|engineer|frontend|backend|fullstack|devops|cloud|data|ml|ai/.test(r))
        return ['Nexova Technologies', 'Brightcode Solutions'];
      if (/design|ux|ui|product design|graphic|visual/.test(r))
        return ['Pixel & Co.', 'Forma Creative Studio'];
      if (/market|seo|content|brand|social media|growth|digital/.test(r))
        return ['Momentum Marketing', 'Spark Digital Agency'];
      if (/finance|account|audit|tax|banking|analyst/.test(r))
        return ['Meridian Financial Group', 'Clearview Consulting'];
      if (/doctor|nurse|healthcare|medical|clinical|pharma|health/.test(r))
        return ['Vitalcare Health Systems', 'MedBridge Clinic'];
      if (/teach|educat|instructor|professor|trainer|curriculum/.test(r))
        return ['Horizon Academy', 'EduPath Institute'];
      if (/sales|business develop|account exec|client/.test(r))
        return ['Pinnacle Sales Group', 'Venture Connect Ltd.'];
      if (/project manager|scrum|agile|program manager|product manager/.test(r))
        return ['Stratex Consulting', 'Agile Works Inc.'];
      if (/lawyer|legal|counsel|paralegal|attorney/.test(r))
        return ['Harlow & Partners LLP', 'Cornerstone Legal Group'];
      // fallback: generic but professional
      return ['Apex Innovations Ltd.', 'Crestline Group'];
    };

    const [company1, company2] = inferCompanyNames(baseRole);

    const sample1: Experience = {
      id: generateId(),
      company: company1,
      position: isSenior ? baseRole : `Senior ${baseRole}`,
      startDate: `${currentYear - 5}-03`,
      endDate: `${currentYear - 2}-08`,
      current: false,
      description: `Led key projects using ${skillsStr}. Collaborated with cross-functional teams to deliver results on time and within scope. Mentored junior colleagues and drove continuous process improvements.`,
    };

    const sample2: Experience = {
      id: generateId(),
      company: company2,
      position: `Junior ${baseRole}`,
      startDate: `${currentYear - 8}-06`,
      endDate: `${currentYear - 5}-02`,
      current: false,
      description: `Supported team initiatives and applied ${skillsStr} to day-to-day challenges. Assisted in delivery of client-facing work and maintained technical documentation.`,
    };

    setCVData({
      ...cvData,
      experiences: [...cvData.experiences, sample1, sample2],
    });
    toast.success('2 related sample experiences added — edit them to match your background!');
    setActiveFeature(null);
  };

  const handleGenerateCoverLetter = () => {
    const fullName = cvData.personalInfo.fullName.trim();
    const title = cvData.personalInfo.title.trim();
    const summary = cvData.personalInfo.summary.trim();

    if (!fullName || (!title && cvData.experiences.length === 0 && cvData.skills.length === 0)) {
      toast.error('Add your name and some CV details first (title, experience, or skills).');
      return;
    }

    const targetRole = coverRole.trim() || title || 'the role';
    const targetCompany = coverCompany.trim() || 'your organization';

    const topSkills = cvData.skills
      .filter(s => s.name.trim())
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
      .map(s => s.name.trim());

    const recentExperience = cvData.experiences.slice(0, 2).map(exp => {
      const role = exp.position.trim() || 'a key role';
      const company = exp.company.trim() || 'a previous organization';
      const snippet = exp.description.trim();
      const sentence = snippet
        ? snippet.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/)[0]
        : '';
      return { role, company, sentence };
    });

    const toneLine =
      coverTone === 'confident'
        ? 'I bring a proven track record of delivering high-impact outcomes in fast-paced environments.'
        : coverTone === 'friendly'
          ? 'I enjoy collaborating across teams and building practical solutions that create real value.'
          : 'I am excited to contribute my background and experience to your team.';

    const jobFocusLine = coverJobFocus.trim()
      ? `I am particularly drawn to this opportunity because ${coverJobFocus.trim()}.`
      : 'I am particularly interested in this opportunity because it aligns with my experience and career focus.';

    const skillsLine = topSkills.length > 0
      ? `My strongest areas include ${topSkills.slice(0, 4).join(', ')}${topSkills.length > 4 ? ', and more' : ''}.`
      : '';

    const experienceLine = recentExperience.length > 0
      ? recentExperience
          .map((exp) => exp.sentence
            ? `In my ${exp.role} role at ${exp.company}, ${exp.sentence.charAt(0).toLowerCase() + exp.sentence.slice(1)}`
            : `In my ${exp.role} role at ${exp.company}, I handled responsibilities relevant to ${targetRole}.`)
          .join(' ')
      : '';

    const opening = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${targetRole} position at ${targetCompany}. ${toneLine}`;
    const middle = [summary ? summary : '', skillsLine, experienceLine, jobFocusLine]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const closing = `\n\nThank you for your time and consideration. I would welcome the opportunity to discuss how my background can support ${targetCompany}.\n\nSincerely,\n${fullName}`;

    setResult(`${opening}\n\n${middle}${closing}`.trim());
  };

  const handleCopyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Could not copy automatically. Please select and copy manually.');
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
              <p>Reads your current CV title and skills, then adds 2 contextually related sample experiences to your experience section.</p>
              <p className="text-xs">Edit the added entries to match your actual background.</p>
            </div>
            <Button onClick={handleAddRelatedExperience} className="w-full btn-gold border-0 gap-2">
              <PlusCircle className="w-4 h-4" />
              Add 2 Related Experiences
            </Button>
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

      case 'generate_cover_letter':
        return (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Uses your existing CV data to draft a clean cover letter. Add optional targeting details below.
            </div>
            <Input
              placeholder="Target role (optional)"
              value={coverRole}
              onChange={e => setCoverRole(e.target.value)}
            />
            <Input
              placeholder="Company name (optional)"
              value={coverCompany}
              onChange={e => setCoverCompany(e.target.value)}
            />
            <select
              value={coverTone}
              onChange={e => setCoverTone(e.target.value as 'professional' | 'confident' | 'friendly')}
              aria-label="Cover letter tone"
              title="Cover letter tone"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="professional">Tone: Professional</option>
              <option value="confident">Tone: Confident</option>
              <option value="friendly">Tone: Friendly</option>
            </select>
            <Textarea
              placeholder="Optional focus from job post (e.g., mission, responsibilities, key requirements)"
              value={coverJobFocus}
              onChange={e => setCoverJobFocus(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button onClick={handleGenerateCoverLetter} className="w-full btn-gold border-0 gap-2">
              <Mail className="w-4 h-4" />
              Generate Cover Letter
            </Button>

            {result && (
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
                <Button onClick={handleCopyResult} variant="outline" size="sm" className="w-full gap-2">
                  <Copy className="w-3.5 h-3.5" />
                  Copy Cover Letter
                </Button>
              </div>
            )}
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
            {result && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                {renderMarkdown(result)}
              </div>
            )}
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
