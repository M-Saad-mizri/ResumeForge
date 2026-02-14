import React from 'react';
import { useCV } from '@/contexts/CVContext';
import { User, Briefcase, GraduationCap, Star, Globe, Plus, Trash2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CVForm = () => {
  const {
    cvData, updatePersonalInfo,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, updateSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    loadSampleData,
  } = useCV();

  return (
    <div className="space-y-2">
      <Button variant="outline" size="sm" onClick={loadSampleData} className="w-full gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-accent" />
        Load Sample Data
      </Button>

      <Accordion type="multiple" defaultValue={['personal', 'experience', 'education', 'skills']} className="space-y-2">
        {/* Personal Info */}
        <AccordionItem value="personal" className="card-elevated px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <User className="w-4 h-4 text-accent" />
              Personal Information
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Input placeholder="Full Name" value={cvData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} />
            <Input placeholder="Job Title" value={cvData.personalInfo.title} onChange={e => updatePersonalInfo('title', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Email" value={cvData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} />
              <Input placeholder="Phone" value={cvData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Location" value={cvData.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} />
              <Input placeholder="Website" value={cvData.personalInfo.website} onChange={e => updatePersonalInfo('website', e.target.value)} />
            </div>
            <Textarea placeholder="Professional Summary..." value={cvData.personalInfo.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} rows={3} />
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience" className="card-elevated px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="w-4 h-4 text-accent" />
              Experience ({cvData.experiences.length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {cvData.experiences.map((exp, i) => (
              <div key={exp.id} className="space-y-2 p-3 rounded-lg bg-muted/50 relative">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <Input placeholder="Position" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} />
                <Input placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="month" placeholder="Start" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                  <Input type="month" placeholder="End" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={exp.current} onCheckedChange={v => updateExperience(exp.id, 'current', !!v)} />
                  <span className="text-xs text-muted-foreground">Currently working here</span>
                </div>
                <Textarea placeholder="Description..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={2} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addExperience} className="w-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="card-elevated px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="w-4 h-4 text-accent" />
              Education ({cvData.education.length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {cvData.education.map(edu => (
              <div key={edu.id} className="space-y-2 p-3 rounded-lg bg-muted/50 relative">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <Input placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                  <Input placeholder="Field of Study" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Start Year" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                  <Input placeholder="End Year" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addEducation} className="w-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="card-elevated px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star className="w-4 h-4 text-accent" />
              Skills ({cvData.skills.length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            {cvData.skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2">
                <Input placeholder="Skill name" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} className="flex-1" />
                <Slider value={[skill.level]} onValueChange={v => updateSkill(skill.id, 'level', v[0])} min={1} max={5} step={1} className="w-24" />
                <span className="text-xs text-muted-foreground w-4">{skill.level}</span>
                <button onClick={() => removeSkill(skill.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addSkill} className="w-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages" className="card-elevated px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Globe className="w-4 h-4 text-accent" />
              Languages ({cvData.languages.length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            {cvData.languages.map(lang => (
              <div key={lang.id} className="flex items-center gap-2">
                <Input placeholder="Language" value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} className="flex-1" />
                <select
                  value={lang.proficiency}
                  onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option>Beginner</option>
                  <option>Elementary</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Fluent</option>
                  <option>Native</option>
                </select>
                <button onClick={() => removeLanguage(lang.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLanguage} className="w-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Language
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CVForm;
