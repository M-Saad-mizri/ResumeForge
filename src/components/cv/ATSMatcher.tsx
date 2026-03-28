import React, { useMemo, useState } from 'react';
import { Gauge, Target, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCV } from '@/contexts/CVContext';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'from', 'this', 'have', 'your', 'you', 'are', 'will', 'our', 'about',
  'into', 'their', 'they', 'them', 'was', 'were', 'has', 'had', 'but', 'not', 'all', 'any', 'can', 'job',
  'role', 'work', 'team', 'years', 'year', 'who', 'what', 'when', 'where', 'why', 'how', 'should', 'must',
  'would', 'could', 'responsible', 'requirements', 'preferred', 'experience', 'skills', 'skill', 'using',
]);

const usageSteps = [
  'Paste the full job description.',
  'Review matched and missing keywords.',
  'Update your summary, skills, and experience with relevant terms.',
];

const improvementTips = [
  'Use exact job-title and tool keywords only when they genuinely match your background.',
  'Add missing terms naturally to summary and achievement bullets instead of keyword stuffing.',
  'Use measurable outcomes and concrete technologies rather than generic claims.',
];

const tokenize = (text: string): string[] => {
  return (text.toLowerCase().match(/[a-z0-9+#.]{3,}/g) || []).filter(token => !STOP_WORDS.has(token));
};

const ATSMatcher: React.FC = () => {
  const { cvData } = useCV();
  const [jobDescription, setJobDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const cvCorpus = useMemo(() => {
    const parts: string[] = [
      cvData.personalInfo.title,
      cvData.personalInfo.summary,
      ...cvData.experiences.flatMap(exp => [exp.position, exp.company, exp.description]),
      ...cvData.education.flatMap(edu => [edu.degree, edu.field, edu.institution, edu.description]),
      ...cvData.skills.map(skill => skill.name),
      ...cvData.languages.map(lang => lang.name),
      ...cvData.customSections.flatMap(section => [
        section.title,
        ...section.items.flatMap(item => [item.title, item.subtitle, item.description]),
      ]),
    ];

    return parts.join(' ').toLowerCase();
  }, [cvData]);

  const analysis = useMemo(() => {
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      return null;
    }

    const jdTokens = tokenize(trimmed);
    const uniqueTerms = Array.from(new Set(jdTokens)).slice(0, 40);

    if (uniqueTerms.length === 0) {
      return {
        score: 0,
        coveragePct: 0,
        missingTerms: [] as string[],
        matchedTerms: [] as string[],
        insights: ['Add more specific keywords (tools, technologies, responsibilities) in the job description.'],
      };
    }

    const matchedTerms = uniqueTerms.filter(term => cvCorpus.includes(term));
    const missingTerms = uniqueTerms.filter(term => !cvCorpus.includes(term));

    const coveragePct = Math.round((matchedTerms.length / uniqueTerms.length) * 100);

    const completionBonus =
      (cvData.personalInfo.summary.trim() ? 4 : 0) +
      (cvData.experiences.length >= 2 ? 3 : 0) +
      (cvData.skills.length >= 6 ? 3 : 0);

    const score = Math.min(100, Math.max(0, Math.round(coveragePct * 0.9 + completionBonus)));

    const insights: string[] = [];
    if (!cvData.personalInfo.summary.trim()) {
      insights.push('Add a professional summary to improve ATS context matching.');
    }
    if (cvData.experiences.length < 2) {
      insights.push('Add at least two role entries with measurable outcomes.');
    }
    if (cvData.skills.length < 6) {
      insights.push('Include more role-specific skills (tools, frameworks, methods).');
    }
    if (missingTerms.length > 0) {
      insights.push(`Add missing keywords naturally in your CV: ${missingTerms.slice(0, 6).join(', ')}.`);
    }

    return {
      score,
      coveragePct,
      missingTerms: missingTerms.slice(0, 12),
      matchedTerms: matchedTerms.slice(0, 12),
      insights,
    };
  }, [jobDescription, cvCorpus, cvData]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <section className="rounded-xl border border-border bg-card p-4">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-label={isOpen ? 'Collapse Free ATS Match' : 'Expand Free ATS Match'}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm">Free ATS Match</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a job description, compare keyword coverage, and get focused improvement tips.
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 pt-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-medium text-foreground">How to use</p>
            <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
              {usageSteps.map((step, index) => (
                <li key={step}>{index + 1}. {step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <p className="text-xs font-medium text-foreground">How to improve your match</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {improvementTips.map((tip) => (
                <li key={tip}>- {tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              This analyzer runs locally. Nothing is sent to paid AI APIs.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setJobDescription('')} disabled={!jobDescription.trim()}>
              Clear
            </Button>
          </div>

          <Textarea
            placeholder="Paste a job description to get an instant ATS match score and keyword gap analysis..."
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="text-sm"
          />

          {!analysis && (
            <p className="text-xs text-muted-foreground">
              Open this panel only when needed. It starts collapsed to keep the builder focused.
            </p>
          )}

          {analysis && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">ATS Match Score</p>
                  <p className="font-semibold text-sm">{analysis.score}/100</p>
                </div>
                <Progress value={analysis.score} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Keyword coverage: {analysis.coveragePct}%</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Matched Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedTerms.length > 0 ? analysis.matchedTerms.map((term) => (
                    <span key={term} className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs border border-green-200">
                      {term}
                    </span>
                  )) : <span className="text-xs text-muted-foreground">No matches detected yet.</span>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  Missing Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingTerms.length > 0 ? analysis.missingTerms.map((term) => (
                    <span key={term} className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs border border-amber-200">
                      {term}
                    </span>
                  )) : <span className="text-xs text-muted-foreground">Great coverage for extracted terms.</span>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                  Improvement Suggestions
                </div>
                <ul className="space-y-1">
                  {analysis.insights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground">• {insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
};

export default ATSMatcher;
