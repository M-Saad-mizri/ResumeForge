import React from 'react';
import { CVData, SectionId } from '@/types/cv';

const ExecutiveTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;

  const gold = '#8b7355';
  const dark = '#1c1c1c';

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div className="mb-6" key="experience">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1.5" style={{ color: gold, borderBottom: `1px solid ${gold}` }}>Professional Experience</h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold" style={{ color: dark }}>{exp.position}</h3>
                    <span className="text-[10px] italic" style={{ color: '#999' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: gold }}>{exp.company}</p>
                  {exp.description && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#4a4a4a' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div className="mb-6" key="education">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1.5" style={{ color: gold, borderBottom: `1px solid ${gold}` }}>Education</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold" style={{ color: dark }}>{edu.degree} in {edu.field}</h3>
                    <span className="text-[10px] italic" style={{ color: '#999' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: gold }}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div className="mb-6" key="skills">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1.5" style={{ color: gold, borderBottom: `1px solid ${gold}` }}>Core Competencies</h2>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
              {skills.map(s => (
                <div key={s.id} className="text-[11px] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: gold }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div className="mb-6" key="languages">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1.5" style={{ color: gold, borderBottom: `1px solid ${gold}` }}>Languages</h2>
            <div className="flex gap-6">
              {languages.map(l => (
                <div key={l.id} className="text-[11px]">
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
          <div className="mb-6" key={sectionId}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1.5" style={{ color: gold, borderBottom: `1px solid ${gold}` }}>{section.title}</h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-xs font-bold" style={{ color: dark }}>{item.title}</h3>
                      {item.subtitle && <p className="text-[11px]" style={{ color: gold }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span className="text-[10px] italic" style={{ color: '#999' }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#4a4a4a' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: dark }}>
      {/* Elegant header */}
      <div className="text-center mb-6">
        <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: gold }} />
        {personalInfo.photo && (
          <div className="mb-3 flex justify-center">
            <img src={personalInfo.photo} alt="" className="w-18 h-18 rounded-full object-cover" style={{ border: `2px solid ${gold}`, width: '72px', height: '72px' }} />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-[0.1em]" style={{ color: dark }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm mt-1 tracking-[0.15em] uppercase font-normal" style={{ color: gold }}>{personalInfo.title || 'Job Title'}</p>
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px]" style={{ color: '#888' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span style={{ color: gold }}>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span style={{ color: gold }}>|</span><span>{personalInfo.location}</span></>}
          {personalInfo.website && <><span style={{ color: gold }}>|</span><span>{personalInfo.website}</span></>}
        </div>
        <div className="w-16 h-px mx-auto mt-4" style={{ backgroundColor: gold }} />
      </div>

      {personalInfo.summary && (
        <div className="mb-6 text-center">
          <p className="text-[11px] leading-relaxed italic" style={{ color: '#555', maxWidth: '90%', margin: '0 auto' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default ExecutiveTemplate;
