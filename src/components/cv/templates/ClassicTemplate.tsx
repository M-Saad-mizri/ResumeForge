import React from 'react';
import { CVData } from '@/types/cv';

const ClassicTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages } = data;

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: '#2d2d2d' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #2d2d2d' }}>
        <h1 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#666', letterSpacing: '0.1em' }}>
          {personalInfo.title || 'Job Title'}
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs" style={{ color: '#555' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: '#444' }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1" style={{ fontFamily: "'Inter', sans-serif", borderBottom: '1px solid #ddd' }}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-bold">{exp.position}</h3>
                    <p className="text-xs italic" style={{ color: '#666' }}>{exp.company}</p>
                  </div>
                  <span className="text-[10px]" style={{ color: '#888' }}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#444' }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1" style={{ fontFamily: "'Inter', sans-serif", borderBottom: '1px solid #ddd' }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="text-xs font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="text-xs italic" style={{ color: '#666' }}>{edu.institution}</p>
                </div>
                <span className="text-[10px]" style={{ color: '#888' }}>{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-6">
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1" style={{ fontFamily: "'Inter', sans-serif", borderBottom: '1px solid #ddd' }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span key={s.id} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1" style={{ fontFamily: "'Inter', sans-serif", borderBottom: '1px solid #ddd' }}>
              Languages
            </h2>
            <div className="space-y-1">
              {languages.map(l => (
                <div key={l.id} className="text-xs flex justify-between">
                  <span>{l.name}</span>
                  <span style={{ color: '#888' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
