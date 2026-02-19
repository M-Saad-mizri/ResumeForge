import React from 'react';
import { useCV } from '@/contexts/CVContext';
import { FONT_OPTIONS } from '@/types/cv';
import { Palette, Type, Ruler, LayoutTemplate } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

const PRESET_COLORS = [
  '#d4a853', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6',
  '#1abc9c', '#e67e22', '#34495e', '#8b7355', '#c0392b',
  '#2980b9', '#27ae60', '#f39c12', '#7f8c8d', '#e91e63',
];

const DesignCustomizer = () => {
  const { designSettings, updateDesignSetting, resetDesignSettings } = useCV();

  return (
    <div className="card-elevated p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" />
          Design Settings
        </h3>
        <button
          onClick={resetDesignSettings}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline"
        >
          Reset defaults
        </button>
      </div>

      <details className="group mb-2">
        <summary className="flex items-center gap-2 text-xs font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden py-2">
          <Palette className="w-3.5 h-3.5 text-accent" />
          <span className="flex-1">Colors</span>
          <svg className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="space-y-3 pb-3">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block">Accent Color</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateDesignSetting('accentColor', color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    designSettings.accentColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={designSettings.accentColor}
                onChange={e => updateDesignSetting('accentColor', e.target.value)}
                className="w-10 h-8 p-0.5 cursor-pointer"
              />
              <Input
                value={designSettings.accentColor}
                onChange={e => updateDesignSetting('accentColor', e.target.value)}
                className="flex-1 text-xs h-8"
                placeholder="#hex"
              />
            </div>
          </div>
        </div>
      </details>

      <details className="group mb-2">
        <summary className="flex items-center gap-2 text-xs font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden py-2">
          <Type className="w-3.5 h-3.5 text-accent" />
          <span className="flex-1">Typography</span>
          <svg className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="space-y-3 pb-3">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Heading Font</label>
            <select
              value={designSettings.headingFont}
              onChange={e => updateDesignSetting('headingFont', e.target.value)}
              className="w-full px-2 py-1.5 rounded-md border border-input bg-background text-xs"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Body Font</label>
            <select
              value={designSettings.bodyFont}
              onChange={e => updateDesignSetting('bodyFont', e.target.value)}
              className="w-full px-2 py-1.5 rounded-md border border-input bg-background text-xs"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Name Size</span><span>{designSettings.nameFontSize}px</span>
            </label>
            <Slider value={[designSettings.nameFontSize]} onValueChange={v => updateDesignSetting('nameFontSize', v[0])} min={16} max={36} step={1} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Section Heading Size</span><span>{designSettings.sectionHeadingSize}px</span>
            </label>
            <Slider value={[designSettings.sectionHeadingSize]} onValueChange={v => updateDesignSetting('sectionHeadingSize', v[0])} min={8} max={20} step={1} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Body Text Size</span><span>{designSettings.bodyFontSize}px</span>
            </label>
            <Slider value={[designSettings.bodyFontSize]} onValueChange={v => updateDesignSetting('bodyFontSize', v[0])} min={8} max={16} step={0.5} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Line Height</span><span>{designSettings.lineHeight.toFixed(1)}</span>
            </label>
            <Slider value={[designSettings.lineHeight]} onValueChange={v => updateDesignSetting('lineHeight', v[0])} min={1} max={2.5} step={0.1} />
          </div>
        </div>
      </details>

      <details className="group mb-2">
        <summary className="flex items-center gap-2 text-xs font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden py-2">
          <LayoutTemplate className="w-3.5 h-3.5 text-accent" />
          <span className="flex-1">Layout</span>
          <svg className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="space-y-3 pb-3">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Page Padding</span><span>{designSettings.pagePadding}mm</span>
            </label>
            <Slider value={[designSettings.pagePadding]} onValueChange={v => updateDesignSetting('pagePadding', v[0])} min={5} max={25} step={1} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Section Spacing</span><span>{designSettings.sectionSpacing}px</span>
            </label>
            <Slider value={[designSettings.sectionSpacing]} onValueChange={v => updateDesignSetting('sectionSpacing', v[0])} min={8} max={48} step={2} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex justify-between">
              <span>Sidebar Width</span><span>{designSettings.sidebarWidth}%</span>
            </label>
            <Slider value={[designSettings.sidebarWidth]} onValueChange={v => updateDesignSetting('sidebarWidth', v[0])} min={25} max={45} step={1} />
          </div>
        </div>
      </details>
    </div>
  );
};

export default DesignCustomizer;
