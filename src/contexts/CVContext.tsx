import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CVData, CVProfile, TemplateType, defaultCVData, sampleCVData, SectionId, DEFAULT_SECTION_ORDER, DesignSettings, defaultDesignSettings } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface CVContextType {
  syncStatus: SyncStatus;
  profiles: CVProfile[];
  activeProfileId: string | null;
  activeProfile: CVProfile | null;
  cvData: CVData;
  template: TemplateType;
  designSettings: DesignSettings;
  setCVData: (data: CVData) => void;
  updatePersonalInfo: (field: string, value: string) => void;
  setTemplate: (template: TemplateType) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: string | number) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;
  addCustomSection: () => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  removeCustomSection: (sectionId: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, field: string, value: string) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  reorderSections: (newOrder: SectionId[]) => void;
  updateDesignSetting: (key: keyof DesignSettings, value: any) => void;
  resetDesignSettings: () => void;
  saveProfile: (name: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  renameProfile: (id: string, newName: string) => void;
  createNewProfile: () => void;
  loadSampleData: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const STORAGE_KEY = 'cv-builder-profiles';
const ACTIVE_KEY = 'cv-builder-active';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Migration helper for old data without new fields
const migrateCVData = (data: any): CVData => ({
  ...defaultCVData,
  ...data,
  customSections: data.customSections || [],
  sectionOrder: data.sectionOrder || [...DEFAULT_SECTION_ORDER],
});

const migrateDesignSettings = (settings: any): DesignSettings => ({
  ...defaultDesignSettings,
  ...(settings || {}),
});

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<CVProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({ ...p, data: migrateCVData(p.data), designSettings: migrateDesignSettings(p.designSettings) }));
    } catch { return []; }
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });

  const [cvData, setCVDataState] = useState<CVData>(defaultCVData);
  const [template, setTemplateState] = useState<TemplateType>('modern');
  const [designSettings, setDesignSettings] = useState<DesignSettings>(defaultDesignSettings);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // Debounce timer ref for cloud sync
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cloud sync: load profiles from Supabase when user signs in ──
  useEffect(() => {
    if (!user) return;
    supabase
      .from('cv_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data) return;
        const cloudProfiles: CVProfile[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          data: migrateCVData(row.cv_data),
          template: row.template as TemplateType,
          designSettings: migrateDesignSettings(row.design_settings),
          updatedAt: row.updated_at,
        }));
        setProfiles(cloudProfiles);
        // If there was an active profile id that exists in the cloud, keep it
        setActiveProfileId(prev => {
          if (prev && cloudProfiles.find(p => p.id === prev)) return prev;
          return cloudProfiles[0]?.id ?? null;
        });
      });
  }, [user?.id]);

  // Load active profile's data into editor state
  useEffect(() => {
    if (activeProfileId) {
      const profile = profiles.find(p => p.id === activeProfileId);
      if (profile) {
        setCVDataState(migrateCVData(profile.data));
        setTemplateState(profile.template);
        setDesignSettings(migrateDesignSettings(profile.designSettings));
      }
    }
  }, [activeProfileId]);

  // Persist to localStorage (always)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) localStorage.setItem(ACTIVE_KEY, activeProfileId);
  }, [activeProfileId]);

  // Auto-save active profile state
  useEffect(() => {
    if (activeProfileId) {
      setProfiles(prev => prev.map(p =>
        p.id === activeProfileId
          ? { ...p, data: cvData, template, designSettings, updatedAt: new Date().toISOString() }
          : p
      ));
    }
  }, [cvData, template, designSettings]);

  // ── Cloud sync: debounced upsert on every profile list change ──
  useEffect(() => {
    if (!user || profiles.length === 0) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    setSyncStatus('syncing');
    syncTimerRef.current = setTimeout(async () => {
      try {
        const rows = profiles.map(p => ({
          id: p.id,
          user_id: user.id,
          name: p.name,
          cv_data: p.data as any,
          template: p.template,
          design_settings: p.designSettings as any,
          updated_at: p.updatedAt,
        }));
        const { error } = await supabase.from('cv_profiles').upsert(rows, { onConflict: 'id' });
        setSyncStatus(error ? 'error' : 'synced');
      } catch {
        setSyncStatus('error');
      }
    }, 1500);
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [profiles, user?.id]);

  const setCVData = (data: CVData) => setCVDataState(data);

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setCVDataState(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const setTemplate = (t: TemplateType) => setTemplateState(t);

  const addExperience = () => {
    setCVDataState(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        id: generateId(), company: '', position: '', startDate: '', endDate: '', current: false, description: '',
      }],
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setCVDataState(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeExperience = (id: string) => {
    setCVDataState(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id),
    }));
  };

  const addEducation = () => {
    setCVDataState(prev => ({
      ...prev,
      education: [...prev.education, {
        id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', description: '',
      }],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCVDataState(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeEducation = (id: string) => {
    setCVDataState(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  const addSkill = () => {
    setCVDataState(prev => ({
      ...prev,
      skills: [...prev.skills, { id: generateId(), name: '', level: 3 }],
    }));
  };

  const updateSkill = (id: string, field: string, value: string | number) => {
    setCVDataState(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const removeSkill = (id: string) => {
    setCVDataState(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const addLanguage = () => {
    setCVDataState(prev => ({
      ...prev,
      languages: [...prev.languages, { id: generateId(), name: '', proficiency: 'Beginner' }],
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCVDataState(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  const removeLanguage = (id: string) => {
    setCVDataState(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id),
    }));
  };

  // Custom sections
  const addCustomSection = () => {
    const sectionId = `custom-${generateId()}`;
    setCVDataState(prev => ({
      ...prev,
      customSections: [...prev.customSections, { id: sectionId, title: 'New Section', items: [] }],
      sectionOrder: [...prev.sectionOrder, sectionId],
    }));
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    setCVDataState(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === sectionId ? { ...s, title } : s),
    }));
  };

  const removeCustomSection = (sectionId: string) => {
    setCVDataState(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== sectionId),
      sectionOrder: prev.sectionOrder.filter(id => id !== sectionId),
    }));
  };

  const addCustomSectionItem = (sectionId: string) => {
    setCVDataState(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId
          ? { ...s, items: [...s.items, { id: generateId(), title: '', subtitle: '', date: '', description: '' }] }
          : s
      ),
    }));
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, field: string, value: string) => {
    setCVDataState(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
          : s
      ),
    }));
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    setCVDataState(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.filter(i => i.id !== itemId) }
          : s
      ),
    }));
  };

  // Section ordering
  const reorderSections = (newOrder: SectionId[]) => {
    setCVDataState(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  // Design settings
  const updateDesignSetting = (key: keyof DesignSettings, value: any) => {
    setDesignSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetDesignSettings = () => {
    setDesignSettings(defaultDesignSettings);
  };

  const saveProfile = (name: string) => {
    const id = activeProfileId || crypto.randomUUID();
    const profile: CVProfile = {
      id, name, data: cvData, template, designSettings, updatedAt: new Date().toISOString(),
    };
    setProfiles(prev => {
      const exists = prev.find(p => p.id === id);
      return exists ? prev.map(p => p.id === id ? profile : p) : [...prev, profile];
    });
    setActiveProfileId(id);
    // Immediate cloud upsert on explicit save
    if (user) {
      supabase.from('cv_profiles').upsert({
        id: profile.id,
        user_id: user.id,
        name: profile.name,
        cv_data: profile.data as any,
        template: profile.template,
        design_settings: profile.designSettings as any,
        updated_at: profile.updatedAt,
      }, { onConflict: 'id' });
    }
  };

  const loadProfile = (id: string) => {
    setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setCVDataState(migrateCVData(profile.data));
      setTemplateState(profile.template);
      setDesignSettings(migrateDesignSettings(profile.designSettings));
    }
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
      setCVDataState(defaultCVData);
      setDesignSettings(defaultDesignSettings);
    }
    // Delete from cloud
    if (user) {
      supabase.from('cv_profiles').delete().eq('id', id).eq('user_id', user.id);
    }
  };

  const renameProfile = (id: string, newName: string) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p));
  };

  const createNewProfile = () => {
    const id = crypto.randomUUID();
    const profile: CVProfile = {
      id,
      name: `Untitled CV ${profiles.length + 1}`,
      data: defaultCVData,
      template: 'modern',
      designSettings: defaultDesignSettings,
      updatedAt: new Date().toISOString(),
    };
    setProfiles(prev => [...prev, profile]);
    setActiveProfileId(id);
    setCVDataState(defaultCVData);
    setTemplateState('modern');
    setDesignSettings(defaultDesignSettings);
  };

  const loadSampleData = () => {
    setCVDataState(sampleCVData);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return (
    <CVContext.Provider value={{
      profiles, activeProfileId, activeProfile, cvData, template, designSettings, syncStatus,
      setCVData, updatePersonalInfo, setTemplate,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      addSkill, updateSkill, removeSkill,
      addLanguage, updateLanguage, removeLanguage,
      addCustomSection, updateCustomSectionTitle, removeCustomSection,
      addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem,
      reorderSections, updateDesignSetting, resetDesignSettings,
      saveProfile, loadProfile, deleteProfile, createNewProfile, loadSampleData,
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within CVProvider');
  return ctx;
};
