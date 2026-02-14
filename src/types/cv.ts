export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

export type TemplateType = 'modern' | 'classic' | 'ats';

export interface CVProfile {
  id: string;
  name: string;
  data: CVData;
  template: TemplateType;
  updatedAt: string;
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};

export const sampleCVData: CVData = {
  personalInfo: {
    fullName: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexchen.design',
    summary: 'Creative and strategic product designer with 8+ years of experience crafting user-centered digital experiences for leading tech companies. Passionate about accessibility and design systems.',
  },
  experiences: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Product Designer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Led design for the flagship SaaS platform serving 2M+ users. Established design system adopted across 12 product teams. Increased user engagement by 34% through redesigned onboarding flow.',
    },
    {
      id: '2',
      company: 'StartupHub',
      position: 'Product Designer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Designed end-to-end experiences for mobile and web applications. Collaborated with engineering to ship 15+ features. Conducted user research with 200+ participants.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Human-Computer Interaction',
      startDate: '2016',
      endDate: '2018',
      description: 'Focus on interaction design and cognitive psychology.',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 5 },
    { id: '2', name: 'User Research', level: 5 },
    { id: '3', name: 'Prototyping', level: 4 },
    { id: '4', name: 'Design Systems', level: 5 },
    { id: '5', name: 'HTML/CSS', level: 4 },
    { id: '6', name: 'React', level: 3 },
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Mandarin', proficiency: 'Fluent' },
  ],
};
