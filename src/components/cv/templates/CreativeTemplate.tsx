import React from 'react';
import { CVData, SectionId, DesignSettings } from '@/types/cv';

const CreativeTemplate: React.FC<{ data: CVData; design: DesignSettings }> = ({ data, design }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;
  const accent = design.accentColor;
  const darkColor = '#2c2c54';

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="experience">
            <h2 className="font-black uppercase mb-3 flex items-center gap-2" style={{ fontSize: `${design.sectionHeadingSize}px` }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
              Experience
            </h2>
            <div className="space-y-4 pl-5" style={{ borderLeft: `2px solid ${accent}` }}>
              {experiences.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{exp.position}</h3>
                      <p className="font-semibold" style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{exp.company}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: `${design.bodyFontSize - 1}px`, backgroundColor: '#f0f0f0', color: '#666' }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#555' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="education">
            <h2 className="font-black uppercase mb-3 flex items-center gap-2" style={{ fontSize: `${design.sectionHeadingSize}px` }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
              Education
            </h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: '#fafafa' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{edu.degree} in {edu.field}</h3>
                      <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{edu.institution}</p>
                    </div>
                    <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#999' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="skills">
            <h2 className="font-black uppercase mb-3 flex items-center gap-2" style={{ fontSize: `${design.sectionHeadingSize}px` }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span key={s.id} className="px-2.5 py-1 rounded-full font-medium"
                  style={{ fontSize: `${design.bodyFontSize - 1}px`, backgroundColor: s.level >= 4 ? accent : '#f0f0f0', color: s.level >= 4 ? '#fff' : '#444' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="languages">
            <h2 className="font-black uppercase mb-3 flex items-center gap-2" style={{ fontSize: `${design.sectionHeadingSize}px` }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
              Languages
            </h2>
            <div className="flex gap-3">
              {languages.map(l => (
                <div key={l.id} className="text-center p-2 rounded-lg" style={{ backgroundColor: '#fafafa', minWidth: '70px' }}>
                  <div className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{l.name}</div>
                  <div style={{ fontSize: `${design.bodyFontSize - 1}px`, color: accent }}>{l.proficiency}</div>
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
            <h2 className="font-black uppercase mb-3 flex items-center gap-2" style={{ fontSize: `${design.sectionHeadingSize}px` }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accent }} />
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{item.title}</h3>
                      {item.subtitle && <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#999' }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#555' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: design.bodyFont, color: darkColor }}>
      <div className="p-5 rounded-lg mb-6 flex items-center gap-5" style={{ backgroundColor: darkColor }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: accent }} />
        )}
        <div>
          <h1 className="font-black" style={{ fontSize: `${design.nameFontSize}px`, fontFamily: design.headingFont, color: '#fff' }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p className="font-medium" style={{ fontSize: `${design.bodyFontSize + 2}px`, color: accent }}>{personalInfo.title || 'Job Title'}</p>
          <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#ccc' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {personalInfo.summary && (
        <div className="p-4 rounded-lg" style={{ marginBottom: `${design.sectionSpacing}px`, backgroundColor: '#fdf2f0', borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#555' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default CreativeTemplate;
