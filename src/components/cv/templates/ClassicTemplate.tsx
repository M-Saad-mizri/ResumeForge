import React from 'react';
import { CVData, SectionId, DesignSettings } from '@/types/cv';

const ClassicTemplate: React.FC<{ data: CVData; design: DesignSettings }> = ({ data, design }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;
  const accent = design.accentColor;

  const sectionHeading = (title: string) => (
    <h2 className="font-bold uppercase mb-3 pb-1" style={{ fontFamily: design.headingFont, borderBottom: '1px solid #ddd', fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em' }}>{title}</h2>
  );

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="experience">
            {sectionHeading('Professional Experience')}
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize + 1}px` }}>{exp.position}</h3>
                      <p className="italic" style={{ fontSize: `${design.bodyFontSize}px`, color: '#666' }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#444' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="education">
            {sectionHeading('Education')}
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{edu.degree} in {edu.field}</h3>
                    <p className="italic" style={{ fontSize: `${design.bodyFontSize}px`, color: '#666' }}>{edu.institution}</p>
                  </div>
                  <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>{edu.startDate} — {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="skills">
            {sectionHeading('Skills')}
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span key={s.id} className="px-2 py-0.5 rounded" style={{ fontSize: `${design.bodyFontSize - 1}px`, backgroundColor: '#f0f0f0', color: '#333' }}>{s.name}</span>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="languages">
            {sectionHeading('Languages')}
            <div className="space-y-1">
              {languages.map(l => (
                <div key={l.id} className="flex justify-between" style={{ fontSize: `${design.bodyFontSize}px` }}>
                  <span>{l.name}</span>
                  <span style={{ color: '#888' }}>{l.proficiency}</span>
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
            {sectionHeading(section.title)}
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{item.title}</h3>
                      {item.subtitle && <p className="italic" style={{ fontSize: `${design.bodyFontSize}px`, color: '#666' }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#444' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: design.bodyFont, color: '#2d2d2d' }}>
      <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${accent}` }}>
        {personalInfo.photo && (
          <div className="mb-3 flex justify-center">
            <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: accent }} />
          </div>
        )}
        <h1 className="font-bold tracking-wide" style={{ fontFamily: design.headingFont, fontSize: `${design.nameFontSize}px` }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="mt-1" style={{ color: '#666', letterSpacing: '0.1em', fontSize: `${design.bodyFontSize + 2}px` }}>{personalInfo.title || 'Job Title'}</p>
        <div className="flex items-center justify-center gap-4 mt-3" style={{ color: '#555', fontSize: `${design.bodyFontSize}px` }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: `${design.sectionSpacing}px` }}>
          <h2 className="font-bold uppercase mb-2" style={{ fontFamily: design.headingFont, fontSize: `${design.sectionHeadingSize}px`, letterSpacing: '0.2em' }}>Professional Summary</h2>
          <p style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#444' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default ClassicTemplate;
