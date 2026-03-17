import React from 'react';
import { CVData, SectionId, DesignSettings } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ModernTemplate: React.FC<{ data: CVData; design: DesignSettings }> = ({ data, design }) => {
  const { personalInfo, experiences, education, skills, languages, customSections, sectionOrder } = data;
  const accent = design.accentColor;
  const sidebarBg = '#1a2332';
  const sidebarText = '#e8e8e8';

  const sidebarSections = ['skills', 'languages'];
  const mainSections = ['experience', 'education'];

  const orderedSidebar = sectionOrder.filter(id => sidebarSections.includes(id));
  const orderedMain = sectionOrder.filter(id => mainSections.includes(id) || id.startsWith('custom-'));

  const renderCustomSection = (sectionId: string, isLight = false) => {
    const section = customSections.find(s => s.id === sectionId);
    if (!section || section.items.length === 0) return null;
    const titleColor = isLight ? accent : '#1a2332';
    const textColor = isLight ? '#e8e8e8' : '#4a4a4a';
    return (
      <div style={{ marginBottom: `${design.sectionSpacing}px` }} key={sectionId}>
        <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: titleColor, fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>
          {section.title}
        </h2>
        {!isLight && <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: accent }} />}
        <div className="space-y-3">
          {section.items.map(item => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{item.title}</h3>
                  {item.subtitle && <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{item.subtitle}</p>}
                </div>
                {item.date && <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: isLight ? '#aaa' : '#888' }}>{item.date}</span>}
              </div>
              {item.description && <p className="mt-1.5" style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: textColor }}>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="experience">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332', fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>Experience</h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: accent }} />
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{exp.position}</h3>
                      <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{exp.company}</p>
                    </div>
                    <span className="whitespace-nowrap" style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
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
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332', fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>Education</h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: accent }} />
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ fontSize: `${design.bodyFontSize}px` }}>{edu.degree} in {edu.field}</h3>
                      <p style={{ fontSize: `${design.bodyFontSize}px`, color: accent }}>{edu.institution}</p>
                    </div>
                    <span style={{ fontSize: `${design.bodyFontSize - 1}px`, color: '#888' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        if (sectionId.startsWith('custom-')) return renderCustomSection(sectionId);
        return null;
    }
  };

  const renderSidebarSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'skills':
        if (skills.length === 0) return null;
        const useCompact = skills.length > 5;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="skills">
            <h2 className="font-bold uppercase tracking-wider mb-3" style={{ color: accent, fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>Skills</h2>
            {useCompact ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span
                    key={skill.id}
                    className="inline-block rounded-sm px-2 py-0.5"
                    style={{
                      fontSize: `${design.bodyFontSize - 1}px`,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderLeft: `2px solid ${accent}`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1" style={{ fontSize: `${design.bodyFontSize}px` }}><span>{skill.name}</span></div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }} key="languages">
            <h2 className="font-bold uppercase tracking-wider mb-3" style={{ color: accent, fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>Languages</h2>
            <div className="space-y-1.5">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between" style={{ fontSize: `${design.bodyFontSize}px` }}>
                  <span>{lang.name}</span>
                  <span style={{ color: accent }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        if (sectionId.startsWith('custom-')) return renderCustomSection(sectionId, true);
        return null;
    }
  };

  return (
    <div className="flex min-h-full" style={{ fontFamily: design.bodyFont, color: '#1a1a2e' }}>
      <div className="p-6" style={{ width: `${design.sidebarWidth}%`, backgroundColor: sidebarBg, color: sidebarText }}>
        <div style={{ marginBottom: `${design.sectionSpacing}px` }}>
          {personalInfo.photo && (
            <div className="mb-4 flex justify-center">
              <img src={personalInfo.photo} alt="" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: accent }} />
            </div>
          )}
          <h1 className="font-bold leading-tight" style={{ color: '#fff', fontSize: `${design.nameFontSize}px`, fontFamily: design.headingFont }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p className="mt-1" style={{ color: accent, fontSize: `${design.bodyFontSize + 2}px` }}>{personalInfo.title || 'Job Title'}</p>
        </div>
        <div className="space-y-2 mb-6" style={{ fontSize: `${design.bodyFontSize}px` }}>
          {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 flex-shrink-0" style={{ color: accent }} /><span className="break-all">{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 flex-shrink-0" style={{ color: accent }} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accent }} /><span>{personalInfo.location}</span></div>}
          {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3 flex-shrink-0" style={{ color: accent }} /><span>{personalInfo.website}</span></div>}
        </div>
        {sectionOrder.filter(id => sidebarSections.includes(id) || (id.startsWith('custom-') && orderedSidebar.includes(id))).map(id => renderSidebarSection(id))}
      </div>
      <div className="flex-1 p-6">
        {personalInfo.summary && (
          <div style={{ marginBottom: `${design.sectionSpacing}px` }}>
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332', fontSize: `${design.sectionHeadingSize}px`, fontFamily: design.headingFont }}>Professional Summary</h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: accent }} />
            <p style={{ fontSize: `${design.bodyFontSize}px`, lineHeight: design.lineHeight, color: '#4a4a4a' }}>{personalInfo.summary}</p>
          </div>
        )}
        {orderedMain.map(id => renderMainSection(id))}
      </div>
    </div>
  );
};

export default ModernTemplate;
