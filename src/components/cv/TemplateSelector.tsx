import React from 'react';
import { useCV } from '@/contexts/CVContext';
import { TemplateType } from '@/types/cv';
import { Check } from 'lucide-react';

const templates: { id: TemplateType; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern', desc: 'Clean sidebar layout' },
  { id: 'classic', name: 'Classic', desc: 'Traditional format' },
  { id: 'ats', name: 'ATS', desc: 'Optimized for scanners' },
  { id: 'minimal', name: 'Minimal', desc: 'Sleek & understated' },
  { id: 'creative', name: 'Creative', desc: 'Bold & colorful' },
  { id: 'executive', name: 'Executive', desc: 'Premium & polished' },
];

const TemplateSelector = () => {
  const { template, setTemplate } = useCV();

  return (
    <div className="card-elevated p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Template</h3>
      <div className="grid grid-cols-3 gap-2">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`relative p-3 rounded-lg border-2 transition-all text-left ${
              template === t.id
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/40'
            }`}
          >
            {template === t.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-accent-foreground" />
              </div>
            )}
            <div className="text-xs font-semibold text-foreground">{t.name}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
