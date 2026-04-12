import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  type?: string;
  image?: string;
}

const SITE_NAME = 'ResumeForge';
const BASE_URL = 'https://getcv.lovable.app';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.svg`;
const DEFAULT_TITLE = 'Free AI CV Builder – Create Professional Resumes Online';
const DEFAULT_DESCRIPTION =
  'Build a professional CV in minutes with ResumeForge — free AI-powered resume builder with 6 templates, ATS optimization, PDF export, LinkedIn import, and smart content suggestions.';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  noindex = false,
  type = 'website',
  image = DEFAULT_IMAGE,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${DEFAULT_TITLE} | ${SITE_NAME}`;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
