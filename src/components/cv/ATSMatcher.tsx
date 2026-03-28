import React, { useMemo, useState } from 'react';
import { Gauge, Target, CheckCircle2, AlertTriangle, ChevronDown, ListChecks, BarChart3, Wand2 } from 'lucide-react';
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

const STRONG_VERBS = [
  'Led', 'Designed', 'Built', 'Implemented', 'Delivered', 'Optimized', 'Streamlined', 'Improved',
  'Launched', 'Managed', 'Developed', 'Coordinated', 'Automated', 'Analyzed', 'Reduced', 'Increased',
];

const WEAK_VERB_RE = /^(worked|helped|did|made|handled|responsible|assisted|participated|supported|involved)\b/i;

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

  const sectionCorpora = useMemo(() => {
    return {
      summary: [cvData.personalInfo.title, cvData.personalInfo.summary].join(' ').toLowerCase(),
      experience: cvData.experiences.flatMap(exp => [exp.position, exp.company, exp.description]).join(' ').toLowerCase(),
      skills: cvData.skills.map(skill => skill.name).join(' ').toLowerCase(),
      education: cvData.education.flatMap(edu => [edu.degree, edu.field, edu.institution, edu.description]).join(' ').toLowerCase(),
    };
  }, [cvData]);

  const readinessChecks = useMemo(() => {
    const missingExperienceDates = cvData.experiences.filter(exp => !exp.startDate || (!exp.current && !exp.endDate)).length;
    const missingEducationDates = cvData.education.filter(edu => !edu.startDate || !edu.endDate).length;

    const bulletLines = cvData.experiences
      .flatMap(exp => exp.description.split(/\n|\.\s+/g).map(line => line.trim()))
      .filter(Boolean);

    const tooShortBullets = bulletLines.filter(line => line.length > 0 && line.length < 60).length;
    const tooLongBullets = bulletLines.filter(line => line.length > 220).length;
    const weakVerbBullets = bulletLines.filter(line => WEAK_VERB_RE.test(line)).slice(0, 5);

    return {
      items: [
        {
          label: 'Full name and job title added',
          ok: Boolean(cvData.personalInfo.fullName.trim() && cvData.personalInfo.title.trim()),
          hint: 'Add your name and a clear target role in Personal Information.',
        },
        {
          label: 'Professional summary written',
          ok: Boolean(cvData.personalInfo.summary.trim()),
          hint: 'Add a 2-4 line summary highlighting your value and domain expertise.',
        },
        {
          label: 'At least 2 experience entries',
          ok: cvData.experiences.length >= 2,
          hint: 'Recruiters usually expect at least 2 relevant roles or projects.',
        },
        {
          label: 'Experience dates complete',
          ok: missingExperienceDates === 0,
          hint: `${missingExperienceDates} experience entr${missingExperienceDates === 1 ? 'y is' : 'ies are'} missing dates.`,
        },
        {
          label: 'Education dates complete',
          ok: missingEducationDates === 0,
          hint: `${missingEducationDates} education entr${missingEducationDates === 1 ? 'y is' : 'ies are'} missing dates.`,
        },
        {
          label: 'At least 6 skills listed',
          ok: cvData.skills.length >= 6,
          hint: 'Add role-relevant tools, frameworks, and methods.',
        },
      ],
      tooShortBullets,
      tooLongBullets,
      weakVerbBullets,
    };
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
        sectionCoverage: [] as Array<{ label: string; value: number }>,
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

    const sectionCoverage = [
      { label: 'Summary', corpus: sectionCorpora.summary },
      { label: 'Experience', corpus: sectionCorpora.experience },
      { label: 'Skills', corpus: sectionCorpora.skills },
      { label: 'Education', corpus: sectionCorpora.education },
    ].map(section => {
      const matched = uniqueTerms.filter(term => section.corpus.includes(term)).length;
      return {
        label: section.label,
        value: Math.round((matched / uniqueTerms.length) * 100),
      };
    });

    return {
      score,
      coveragePct,
      missingTerms: missingTerms.slice(0, 12),
      matchedTerms: matchedTerms.slice(0, 12),
      sectionCoverage,
      insights,
    };
  }, [jobDescription, cvCorpus, cvData, sectionCorpora]);

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

          <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <ListChecks className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-medium text-foreground">CV Readiness Checklist</p>
            </div>
            <ul className="space-y-1.5">
              {readinessChecks.items.map((item) => (
                <li key={item.label} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className={`mt-[2px] inline-block w-2 h-2 rounded-full ${item.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span>
                    <span className="text-foreground">{item.label}:</span>{' '}
                    {item.ok ? 'Looks good.' : item.hint}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-1 space-y-1">
              <p className="text-xs font-medium text-foreground">Bullet Quality</p>
              <p className="text-xs text-muted-foreground">
                Short bullets (&lt;60 chars): {readinessChecks.tooShortBullets} | Long bullets (&gt;220 chars): {readinessChecks.tooLongBullets}
              </p>
              {readinessChecks.weakVerbBullets.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5 text-foreground"><Wand2 className="w-3 h-3" /> Replace weak openers with stronger verbs:</p>
                  <ul className="space-y-1">
                    {readinessChecks.weakVerbBullets.map((line, idx) => (
                      <li key={`${line}-${idx}`}>• "{line.slice(0, 80)}{line.length > 80 ? '...' : ''}"</li>
                    ))}
                  </ul>
                  <p>Try verbs like: {STRONG_VERBS.slice(0, 8).join(', ')}.</p>
                </div>
              )}
            </div>
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

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <BarChart3 className="w-3.5 h-3.5 text-accent" />
                  Keyword Coverage by Section
                </div>
                <div className="space-y-2">
                  {analysis.sectionCoverage.map((section) => (
                    <div key={section.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{section.label}</span>
                        <span className="font-medium text-foreground">{section.value}%</span>
                      </div>
                      <Progress value={section.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
};

export default ATSMatcher;
