import React from 'react';
import { CVData, SectionId, DesignSettings } from '@/types/cv';

const ATSTemplate: React.FC<{ data: CVData; design: DesignSettings }> = ({ data, design }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="experience">
            <h2 className="font-bold uppercase mb-2" style={{ fontSize: `${design.sectionHeadingSize}px`, borderBottom: '1px solid #000', paddingBottom: '2px' }}>Work Experience</h2>
            <div className="space-y-3">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{exp.position}</span>
                    <span style={{ fontSize: `${design.bodyFontSize - 1}px` }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: `${design.bodyFontSize}px`, color: '#333' }}>{exp.company}</div>
                  {exp.description && <p className="mt-1" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#222' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="education">
            <h2 className="font-bold uppercase mb-2" style={{ fontSize: `${design.sectionHeadingSize}px`, borderBottom: '1px solid #000', paddingBottom: '2px' }}>Education</h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <span className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{edu.degree} in {edu.field}</span>
                    <span style={{ fontSize: `${design.bodyFontSize}px` }}> — {edu.institution}</span>
                  </div>
                  <span style={{ fontSize: `${design.bodyFontSize - 1}px` }}>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="skills">
            <h2 className="font-bold uppercase mb-1" style={{ fontSize: `${design.sectionHeadingSize}px`, borderBottom: '1px solid #000', paddingBottom: '2px' }}>Skills</h2>
            <p style={{ fontSize: `${design.bodyFontSize}px` }}>{skills.map(s => s.name).join(', ')}</p>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="languages">
            <h2 className="font-bold uppercase mb-1" style={{ fontSize: `${design.sectionHeadingSize}px`, borderBottom: '1px solid #000', paddingBottom: '2px' }}>Languages</h2>
            <p style={{ fontSize: `${design.bodyFontSize}px` }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
          </div>
        );
      default: {
        const section = customSections.find(s => s.id === sectionId);
        if (!section || section.items.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key={sectionId}>
            <h2 className="font-bold uppercase mb-2" style={{ fontSize: `${design.sectionHeadingSize}px`, borderBottom: '1px solid #000', paddingBottom: '2px' }}>{section.title}</h2>
            <div className="space-y-2">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{item.title}</span>
                      {item.subtitle && <span style={{ fontSize: `${design.bodyFontSize}px` }}> — {item.subtitle}</span>}
                    </div>
                    {item.date && <span style={{ fontSize: `${design.bodyFontSize - 1}px` }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="mt-1" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#222' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: design.bodyFont, color: '#000', lineHeight: design.lineHeight }}>
      <div style={{ marginBottom: `${design.sectionSpacing}px` }}>
        <h1 className="font-bold" style={{ fontSize: `${design.nameFontSize}px`, fontFamily: design.headingFont }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="font-medium" style={{ fontSize: `${design.bodyFontSize + 2}px`, color: '#333' }}>{personalInfo.title || 'Job Title'}</p>
        <div className="mt-1" style={{ fontSize: `${design.bodyFontSize}px`, color: '#444' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website].filter(Boolean).join(' | ')}
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '8px 0' }} />
      {personalInfo.summary && (
        <div style={{ marginBottom: `${design.sectionSpacing}px` }}>
          <h2 className="font-bold uppercase mb-1" style={{ fontSize: `${design.sectionHeadingSize}px` }}>Professional Summary</h2>
          <p style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight }}>{personalInfo.summary}</p>
        </div>
      )}
      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default ATSTemplate;
