import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CVData, CVProfile, TemplateType, defaultCVData, sampleCVData } from '@/types/cv';

interface CVContextType {
  profiles: CVProfile[];
  activeProfileId: string | null;
  activeProfile: CVProfile | null;
  cvData: CVData;
  template: TemplateType;
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
  saveProfile: (name: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  createNewProfile: () => void;
  loadSampleData: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const STORAGE_KEY = 'cv-builder-profiles';
const ACTIVE_KEY = 'cv-builder-active';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<CVProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });

  const [cvData, setCVDataState] = useState<CVData>(defaultCVData);
  const [template, setTemplateState] = useState<TemplateType>('modern');

  useEffect(() => {
    if (activeProfileId) {
      const profile = profiles.find(p => p.id === activeProfileId);
      if (profile) {
        setCVDataState(profile.data);
        setTemplateState(profile.template);
      }
    }
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem(ACTIVE_KEY, activeProfileId);
    }
  }, [activeProfileId]);

  // Auto-save active profile
  useEffect(() => {
    if (activeProfileId) {
      setProfiles(prev => prev.map(p =>
        p.id === activeProfileId
          ? { ...p, data: cvData, template, updatedAt: new Date().toISOString() }
          : p
      ));
    }
  }, [cvData, template]);

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

  const saveProfile = (name: string) => {
    const id = activeProfileId || generateId();
    const profile: CVProfile = {
      id, name, data: cvData, template, updatedAt: new Date().toISOString(),
    };
    setProfiles(prev => {
      const exists = prev.find(p => p.id === id);
      return exists ? prev.map(p => p.id === id ? profile : p) : [...prev, profile];
    });
    setActiveProfileId(id);
  };

  const loadProfile = (id: string) => {
    setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setCVDataState(profile.data);
      setTemplateState(profile.template);
    }
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
      setCVDataState(defaultCVData);
    }
  };

  const createNewProfile = () => {
    setActiveProfileId(null);
    setCVDataState(defaultCVData);
    setTemplateState('modern');
  };

  const loadSampleData = () => {
    setCVDataState(sampleCVData);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return (
    <CVContext.Provider value={{
      profiles, activeProfileId, activeProfile, cvData, template,
      setCVData, updatePersonalInfo, setTemplate,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      addSkill, updateSkill, removeSkill,
      addLanguage, updateLanguage, removeLanguage,
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
