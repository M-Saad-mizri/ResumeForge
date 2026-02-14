import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ModernTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, experiences, education, skills, languages } = data;

  return (
    <div className="flex min-h-full" style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a2e' }}>
      {/* Sidebar */}
      <div className="w-[35%] p-6" style={{ backgroundColor: '#1a2332', color: '#e8e8e8' }}>
        {/* Name */}
        <div className="mb-6">
          <h1 className="text-xl font-bold leading-tight" style={{ color: '#fff' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#d4a853' }}>
            {personalInfo.title || 'Job Title'}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-6 text-xs">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a853' }} />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a853' }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a853' }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a853' }} />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#d4a853' }}>Skills</h2>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: '#d4a853' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#d4a853' }}>Languages</h2>
            <div className="space-y-1.5">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between text-xs">
                  <span>{lang.name}</span>
                  <span style={{ color: '#d4a853' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332' }}>
              Professional Summary
            </h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: '#d4a853' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#4a4a4a' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332' }}>
              Experience
            </h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: '#d4a853' }} />
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{exp.position}</h3>
                      <p className="text-xs" style={{ color: '#d4a853' }}>{exp.company}</p>
                    </div>
                    <span className="text-[10px] whitespace-nowrap" style={{ color: '#888' }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#4a4a4a' }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2332' }}>
              Education
            </h2>
            <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: '#d4a853' }} />
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-xs" style={{ color: '#d4a853' }}>{edu.institution}</p>
                    </div>
                    <span className="text-[10px]" style={{ color: '#888' }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
