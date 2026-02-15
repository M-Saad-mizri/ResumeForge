import React from 'react';
import { CVData, SectionId } from '@/types/cv';

const MinimalTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;

  const sectionTitle = (title: string) => (
    <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: '#999' }}>{title}</h2>
  );

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div className="mb-6" key="experience">
            {sectionTitle('Experience')}
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{exp.position}</h3>
                    <span className="text-[10px]" style={{ color: '#bbb' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#777' }}>{exp.company}</p>
                  {exp.description && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#555' }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (education.length === 0) return null;
        return (
          <div className="mb-6" key="education">
            {sectionTitle('Education')}
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{edu.degree} in {edu.field}</h3>
                    <p className="text-[11px]" style={{ color: '#777' }}>{edu.institution}</p>
                  </div>
                  <span className="text-[10px]" style={{ color: '#bbb' }}>{edu.startDate} — {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div className="mb-6" key="skills">
            {sectionTitle('Skills')}
            <p className="text-[11px] leading-relaxed" style={{ color: '#555' }}>{skills.map(s => s.name).join('  ·  ')}</p>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div className="mb-6" key="languages">
            {sectionTitle('Languages')}
            <p className="text-[11px]" style={{ color: '#555' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join('  ·  ')}</p>
          </div>
        );
      default: {
        const section = customSections.find(s => s.id === sectionId);
        if (!section || section.items.length === 0) return null;
        return (
          <div className="mb-6" key={sectionId}>
            {sectionTitle(section.title)}
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{item.title}</h3>
                      {item.subtitle && <p className="text-[11px]" style={{ color: '#777' }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span className="text-[10px]" style={{ color: '#bbb' }}>{item.date}</span>}
                  </div>
                  {item.description && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#555' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", color: '#1a1a1a' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide" style={{ color: '#1a1a1a', letterSpacing: '0.08em' }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xs mt-1 font-medium uppercase tracking-[0.15em]" style={{ color: '#999' }}>{personalInfo.title || 'Job Title'}</p>
        <div className="flex gap-4 mt-3 text-[10px]" style={{ color: '#aaa' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <p className="text-[11px] leading-relaxed" style={{ color: '#555' }}>{personalInfo.summary}</p>
        </div>
      )}

      <div className="w-full h-px mb-6" style={{ backgroundColor: '#e5e5e5' }} />

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default MinimalTemplate;
