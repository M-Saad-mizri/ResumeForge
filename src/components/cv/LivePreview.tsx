import React, { forwardRef } from 'react';
import { useCV } from '@/contexts/CVContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ATSTemplate from './templates/ATSTemplate';

const LivePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { cvData, template } = useCV();

  const renderTemplate = () => {
    switch (template) {
      case 'modern': return <ModernTemplate data={cvData} />;
      case 'classic': return <ClassicTemplate data={cvData} />;
      case 'ats': return <ATSTemplate data={cvData} />;
      default: return <ModernTemplate data={cvData} />;
    }
  };

  return (
    <div
      ref={ref}
      className="cv-page shadow-xl rounded-sm"
      style={{ transform: 'scale(0.75)', transformOrigin: 'top center', maxWidth: '210mm' }}
    >
      {renderTemplate()}
    </div>
  );
});

LivePreview.displayName = 'LivePreview';

export default LivePreview;
