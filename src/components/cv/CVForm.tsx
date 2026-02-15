import React, { useRef } from 'react';
import { useCV } from '@/contexts/CVContext';
import { User, Briefcase, GraduationCap, Star, Globe, Plus, Trash2, Sparkles, GripVertical, LayoutList, Camera, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionId } from '@/types/cv';

const SECTION_LABELS: Record<string, { icon: React.ReactNode; label: string }> = {
  personal: { icon: <User className="w-4 h-4 text-accent" />, label: 'Personal Information' },
  experience: { icon: <Briefcase className="w-4 h-4 text-accent" />, label: 'Experience' },
  education: { icon: <GraduationCap className="w-4 h-4 text-accent" />, label: 'Education' },
  skills: { icon: <Star className="w-4 h-4 text-accent" />, label: 'Skills' },
  languages: { icon: <Globe className="w-4 h-4 text-accent" />, label: 'Languages' },
};

const SortableSection: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="card-elevated px-4 rounded-lg">
      <div className="flex items-center gap-2 py-3 border-b border-border/50">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const PhotoUpload: React.FC<{ photo?: string; onUpload: (dataUrl: string) => void; onRemove: () => void }> = ({ photo, onUpload, onRemove }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-border">
          {photo ? <AvatarImage src={photo} alt="Profile" /> : <AvatarFallback><Camera className="w-5 h-5 text-muted-foreground" /></AvatarFallback>}
        </Avatar>
        {photo && (
          <button onClick={onRemove} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
          <Camera className="w-3.5 h-3.5" /> {photo ? 'Change Photo' : 'Upload Photo'}
        </Button>
        <p className="text-[10px] text-muted-foreground mt-1">Max 2MB. JPG/PNG.</p>
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
    </div>
  );
};

const CVForm = () => {
  const {
    cvData, updatePersonalInfo,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, updateSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    addCustomSection, updateCustomSectionTitle, removeCustomSection,
    addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem,
    reorderSections,
    loadSampleData,
  } = useCV();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.sectionOrder.indexOf(active.id as string);
      const newIndex = cvData.sectionOrder.indexOf(over.id as string);
      reorderSections(arrayMove(cvData.sectionOrder, oldIndex, newIndex));
    }
  };

  const getSectionLabel = (sectionId: SectionId) => {
    if (SECTION_LABELS[sectionId]) return SECTION_LABELS[sectionId];
    const custom = cvData.customSections.find(s => s.id === sectionId);
    return { icon: <LayoutList className="w-4 h-4 text-accent" />, label: custom?.title || 'Custom Section' };
  };

  const renderSectionContent = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal':
        return (
          <div className="space-y-3 py-3">
            <PhotoUpload
              photo={cvData.personalInfo.photo}
              onUpload={(dataUrl) => updatePersonalInfo('photo', dataUrl)}
              onRemove={() => updatePersonalInfo('photo', '')}
            />
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
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4 py-3">
            {cvData.experiences.map(exp => (
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
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4 py-3">
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
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-3 py-3">
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
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-3 py-3">
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
          </div>
        );

      default: {
        // Custom section
        const section = cvData.customSections.find(s => s.id === sectionId);
        if (!section) return null;
        return (
          <div className="space-y-3 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={section.title}
                onChange={e => updateCustomSectionTitle(section.id, e.target.value)}
                className="font-semibold"
                placeholder="Section Title"
              />
              <button onClick={() => removeCustomSection(section.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {section.items.map(item => (
              <div key={item.id} className="space-y-2 p-3 rounded-lg bg-muted/50 relative">
                <button onClick={() => removeCustomSectionItem(section.id, item.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <Input placeholder="Title" value={item.title} onChange={e => updateCustomSectionItem(section.id, item.id, 'title', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Subtitle" value={item.subtitle} onChange={e => updateCustomSectionItem(section.id, item.id, 'subtitle', e.target.value)} />
                  <Input placeholder="Date" value={item.date} onChange={e => updateCustomSectionItem(section.id, item.id, 'date', e.target.value)} />
                </div>
                <Textarea placeholder="Description..." value={item.description} onChange={e => updateCustomSectionItem(section.id, item.id, 'description', e.target.value)} rows={2} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addCustomSectionItem(section.id)} className="w-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={loadSampleData} className="flex-1 gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Load Sample Data
        </Button>
        <Button variant="outline" size="sm" onClick={addCustomSection} className="flex-1 gap-2">
          <Plus className="w-4 h-4 text-accent" />
          Custom Section
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        <GripVertical className="w-3 h-3 inline" /> Drag sections to reorder them on your CV
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {cvData.sectionOrder.map(sectionId => {
              const { icon, label } = getSectionLabel(sectionId);
              const count = sectionId === 'experience' ? cvData.experiences.length
                : sectionId === 'education' ? cvData.education.length
                : sectionId === 'skills' ? cvData.skills.length
                : sectionId === 'languages' ? cvData.languages.length
                : sectionId.startsWith('custom-') ? (cvData.customSections.find(s => s.id === sectionId)?.items.length || 0)
                : undefined;

              return (
                <SortableSection key={sectionId} id={sectionId}>
                  <details className="group">
                    <summary className="flex items-center gap-2 text-sm font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      {icon}
                      <span className="flex-1">{label}{count !== undefined ? ` (${count})` : ''}</span>
                      <svg className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    {renderSectionContent(sectionId)}
                  </details>
                </SortableSection>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CVForm;
