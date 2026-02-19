import React from 'react';
import { CVData, SectionId, DesignSettings } from '@/types/cv';

const ExecutiveTemplate: React.FC<{ data: CVData; design: DesignSettings }> = ({ data, design }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;
  const accent = design.accentColor;
  const dark = '#1c1c1c';

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="experience">
            <h2 className="font-bold uppercase mb-3 pb-1.5" style={{ fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}` }}>Professional Experience</h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px`, color: dark }}>{exp.position}</h3>
                    <span className="italic" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#999' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="font-medium" style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{exp.company}</p>
                  {exp.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#4a4a4a' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="education">
            <h2 className="font-bold uppercase mb-3 pb-1.5" style={{ fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}` }}>Education</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px`, color: dark }}>{edu.degree} in {edu.field}</h3>
                    <span className="italic" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#999' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="skills">
            <h2 className="font-bold uppercase mb-3 pb-1.5" style={{ fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}` }}>Core Competencies</h2>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
              {skills.map(s => (
                <div key={s.id} className="flex items-center gap-1.5" style={{ fontSize: `${design.bodyFontSize}px` }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="languages">
            <h2 className="font-bold uppercase mb-3 pb-1.5" style={{ fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}` }}>Languages</h2>
            <div className="flex gap-6">
              {languages.map(l => (
                <div key={l.id} style={{ fontSize: `${design.bodyFontSize}px` }}>
                  <span className="font-semibold">{l.name}</span>
                  <span className="ml-1" style={{ color: '#888' }}>— {l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default: {
        const section = customSections.find(s => s.id === sectionId);
        if (!section || section.items.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key={sectionId}>
            <h2 className="font-bold uppercase mb-3 pb-1.5" style={{ fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}` }}>{section.title}</h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px`, color: dark }}>{item.title}</h3>
                      {item.subtitle && <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span className="italic" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#999' }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#4a4a4a' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: design.bodyFont, color: dark }}>
      <div className="text-center mb-6">
        <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: accent }} />
        {personalInfo.photo && (
          <div className="mb-3 flex justify-center">
            <img src={personalInfo.photo} alt="" className="rounded-full object-cover" style={{ border: `2px solid ${accent}`, width: '72px', height: '72px' }} />
          </div>
        )}
        <h1 className="font-bold" style={{ fontSize: `${design.nameFontSize}px`, fontFamily: design.headingFont, letterSpacing: '0.1em', color: dark }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="mt-1 uppercase font-normal" style={{ fontSize: `${design.bodyFontSize + 2}px`, letterSpacing: '0.15em', color: accent }}>{personalInfo.title || 'Job Title'}</p>
        <div className="flex items-center justify-center gap-3 mt-3" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span style={{ color: accent }}>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span style={{ color: accent }}>|</span><span>{personalInfo.location}</span></>}
          {personalInfo.website && <><span style={{ color: accent }}>|</span><span>{personalInfo.website}</span></>}
        </div>
        <div className="w-16 h-px mx-auto mt-4" style={{ backgroundColor: accent }} />
      </div>

      {personalInfo.summary && (
        <div className="mb-6 text-center">
          <p className="italic" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#555', maxWidth: '90%', margin: '0 auto' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default ExecutiveTemplate;
