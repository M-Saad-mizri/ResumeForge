import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: string;
  image?: string;
  keywords?: string[];
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = 'ResumeForge';
const BASE_URL = 'https://getcv.lovable.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`;
const DEFAULT_TITLE = 'Free AI CV Builder - Create Professional Resumes Online';
const DEFAULT_DESCRIPTION =
  'Build a professional CV in minutes with ResumeForge, a free AI-powered resume builder with professional templates, ATS optimization, PDF export, LinkedIn import, and smart content suggestions.';
const DEFAULT_KEYWORDS = [
  'free CV builder',
  'AI resume builder',
  'resume maker',
  'CV maker',
  'ATS resume builder',
  'professional CV template',
  'PDF resume builder',
  'LinkedIn resume import',
  'online resume creator',
];

const makeAbsoluteUrl = (path?: string) => {
  if (!path) return BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  noindex = false,
  nofollow = false,
  type = 'website',
  image = DEFAULT_IMAGE,
  keywords = DEFAULT_KEYWORDS,
  structuredData,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${DEFAULT_TITLE} | ${SITE_NAME}`;
  const fullCanonical = makeAbsoluteUrl(canonical);
  const robots = noindex
    ? `noindex, ${nofollow ? 'nofollow' : 'follow'}`
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const imageUrl = makeAbsoluteUrl(image);

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={fullCanonical} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content="ResumeForge AI CV builder preview" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="ResumeForge AI CV builder preview" />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
