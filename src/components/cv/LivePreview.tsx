import React, { forwardRef } from 'react';
import { useCV } from '@/contexts/CVContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ATSTemplate from './templates/ATSTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

const LivePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { cvData, template, designSettings } = useCV();

  const renderTemplate = () => {
    const props = { data: cvData, design: designSettings };
    switch (template) {
      case 'modern': return <ModernTemplate {...props} />;
      case 'classic': return <ClassicTemplate {...props} />;
      case 'ats': return <ATSTemplate {...props} />;
      case 'minimal': return <MinimalTemplate {...props} />;
      case 'creative': return <CreativeTemplate {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <div
      ref={ref}
      className="cv-page shadow-xl rounded-sm"
      style={{
        transform: 'scale(0.75)',
        transformOrigin: 'top center',
        maxWidth: '210mm',
        padding: `${designSettings.pagePadding}mm`,
      }}
    >
      {renderTemplate()}
    </div>
  );
});

LivePreview.displayName = 'LivePreview';

export default LivePreview;
