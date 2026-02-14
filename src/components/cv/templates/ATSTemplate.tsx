import React from 'react';
import { CVData } from '@/types/cv';

const ATSTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages } = data;

  return (
    <div style={{ fontFamily: "'Inter', Arial, sans-serif", color: '#000', lineHeight: 1.5 }}>
      {/* Header - Simple, no graphics */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm font-medium" style={{ color: '#333' }}>{personalInfo.title || 'Job Title'}</p>
        <div className="text-xs mt-1" style={{ color: '#444' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '8px 0' }} />

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-1">Professional Summary</h2>
          <p className="text-xs">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2" style={{ borderBottom: '1px solid #000', paddingBottom: '2px' }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className="text-xs font-bold">{exp.position}</span>
                  <span className="text-[10px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs" style={{ color: '#333' }}>{exp.company}</div>
                {exp.description && (
                  <p className="text-[11px] mt-1" style={{ color: '#222' }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2" style={{ borderBottom: '1px solid #000', paddingBottom: '2px' }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="text-xs font-bold">{edu.degree} in {edu.field}</span>
                  <span className="text-xs"> — {edu.institution}</span>
                </div>
                <span className="text-[10px]">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-1" style={{ borderBottom: '1px solid #000', paddingBottom: '2px' }}>
            Skills
          </h2>
          <p className="text-xs">{skills.map(s => s.name).join(', ')}</p>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase mb-1" style={{ borderBottom: '1px solid #000', paddingBottom: '2px' }}>
            Languages
          </h2>
          <p className="text-xs">{languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ATSTemplate;
