export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://getcv.lovable.app').replace(/\/$/, '');
export const SITE_NAME = 'ResumeForge';
export const CONTACT_EMAIL = 'saadmizri434@gmail.com';

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
