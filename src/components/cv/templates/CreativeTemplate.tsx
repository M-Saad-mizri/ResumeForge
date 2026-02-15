import React from 'react';
import { CVData, SectionId } from '@/types/cv';

const CreativeTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;

  const accentColor = '#e74c3c';
  const darkColor = '#2c2c54';

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'personal': return null;
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div className="mb-6" key="experience">
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
              Experience
            </h2>
            <div className="space-y-4 pl-5" style={{ borderLeft: `2px solid ${accentColor}` }}>
              {experiences.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{exp.position}</h3>
                      <p className="text-[11px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
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
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
              Education
            </h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: '#fafafa' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-[11px]" style={{ color: accentColor }}>{edu.institution}</p>
                    </div>
                    <span className="text-[10px]" style={{ color: '#999' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div className="mb-6" key="skills">
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span key={s.id} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: s.level >= 4 ? accentColor : '#f0f0f0', color: s.level >= 4 ? '#fff' : '#444' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div className="mb-6" key="languages">
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
              Languages
            </h2>
            <div className="flex gap-3">
              {languages.map(l => (
                <div key={l.id} className="text-center p-2 rounded-lg" style={{ backgroundColor: '#fafafa', minWidth: '70px' }}>
                  <div className="text-xs font-bold">{l.name}</div>
                  <div className="text-[10px]" style={{ color: accentColor }}>{l.proficiency}</div>
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
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{item.title}</h3>
                      {item.subtitle && <p className="text-[11px]" style={{ color: accentColor }}>{item.subtitle}</p>}
                    </div>
                    {item.date && <span className="text-[10px]" style={{ color: '#999' }}>{item.date}</span>}
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
    <div style={{ fontFamily: "'Inter', sans-serif", color: darkColor }}>
      {/* Header band */}
      <div className="p-5 rounded-lg mb-6 flex items-center gap-5" style={{ backgroundColor: darkColor }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: accentColor }} />
        )}
        <div>
          <h1 className="text-xl font-black" style={{ color: '#fff' }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm font-medium" style={{ color: accentColor }}>{personalInfo.title || 'Job Title'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-[10px]" style={{ color: '#ccc' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fdf2f0', borderLeft: `3px solid ${accentColor}` }}>
          <p className="text-[11px] leading-relaxed" style={{ color: '#555' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.filter(id => id !== 'personal').map(id => renderSection(id))}
    </div>
  );
};

export default CreativeTemplate;
