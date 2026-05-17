import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import PublicPage from '@/components/PublicPage';
import { CONTACT_EMAIL } from '@/config/site';

type LegalPageKey = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

interface LegalPageProps {
  page: LegalPageKey;
}

const pages = {
  about: {
    title: 'About Us',
    canonical: '/about',
    description:
      'Learn about ResumeForge, a resume builder that helps users create, edit, save, export, and share professional resumes with optional AI writing assistance.',
    intro:
      'ResumeForge helps job seekers create professional resumes and CVs with practical editing tools, clean templates, AI writing assistance, saved profiles, and shareable resume data.',
    sections: [
      {
        heading: 'What We Provide',
        body: 'The website is designed to make resume creation easier. Users can create, edit, save, export, and share resumes, including JSON resume data for portability. The builder supports professional templates, live preview, cloud sync for signed-in users, and local storage for guest users.',
      },
      {
        heading: 'How AI Assistance Works',
        body: 'AI features are included only to assist with resume writing, such as drafting summaries, improving experience descriptions, and organizing rough notes. AI output may be incomplete or inaccurate, so users are responsible for checking final resume content before using it in applications.',
      },
      {
        heading: 'Our Approach',
        body: 'We aim to keep ResumeForge useful, transparent, and respectful of users. The site may use cookies, analytics, and advertising services in the future, including Google AdSense or similar advertising networks, to improve the service and support ongoing development.',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    canonical: '/contact',
    description:
      'Contact ResumeForge for support, feedback, questions about the resume builder, privacy, advertising, or AI resume writing assistance.',
    intro:
      `Questions, feedback, and support requests are welcome. Use the contact form below or email us directly at ${CONTACT_EMAIL}.`,
    sections: [],
  },
  privacy: {
    title: 'Privacy Policy',
    canonical: '/privacy-policy',
    description:
      'Read the ResumeForge privacy policy for information about resume data, account features, cookies, analytics, advertising, and user responsibility.',
    intro:
      'This Privacy Policy explains, in simple terms, how ResumeForge handles information related to the resume builder, account features, AI assistance, cookies, analytics, and advertising.',
    sections: [
      {
        heading: 'Information You Provide',
        body: 'When you use ResumeForge, you may enter resume details such as your name, contact information, education, work history, skills, projects, and other career information. If you sign in, your account email may be used to provide saved profiles and cloud sync. Guest users may store resume data locally in their browser.',
      },
      {
        heading: 'Resume and AI Data',
        body: 'ResumeForge helps users create, edit, save, export, and share resumes. AI features are used only to assist with resume writing and organization. Users are responsible for reviewing and verifying final resume content before submitting it to employers or sharing it publicly.',
      },
      {
        heading: 'Cookies, Analytics, and Advertising',
        body: 'The website may use cookies and similar technologies for essential functionality, analytics, performance measurement, and advertising. In the future, ResumeForge may display ads through Google AdSense or similar advertising networks. Advertising partners may use cookies or other identifiers according to their own policies.',
      },
      {
        heading: 'Data Sharing and Links',
        body: 'If you create a public or shared resume link, anyone with that link may be able to view or import the shared resume data until the link expires or is removed. Avoid including sensitive personal information that you do not want to share.',
      },
      {
        heading: 'Contact',
        body: `For privacy questions, contact us at ${CONTACT_EMAIL}. This policy may be updated as the website adds new features, analytics, or advertising services.`,
      },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    canonical: '/terms-and-conditions',
    description:
      'Read the ResumeForge terms and conditions for using the resume builder, AI writing assistance, saved profiles, exports, and shared resume links.',
    intro:
      'By using ResumeForge, you agree to use the website responsibly and to review all resume content before relying on it for job applications or professional use.',
    sections: [
      {
        heading: 'Use of the Website',
        body: 'ResumeForge provides tools to create, edit, save, export, and share resumes. You may use the website for personal career documents and related job-search activities. You should not use the service for unlawful, harmful, abusive, or misleading activity.',
      },
      {
        heading: 'AI Writing Assistance',
        body: 'AI features are provided as writing assistance only. They may suggest wording, summarize rough notes, or help organize resume sections. AI output is not guaranteed to be accurate, complete, or suitable for every job. You are responsible for checking final resume content.',
      },
      {
        heading: 'Accounts, Saved Profiles, and Sharing',
        body: 'Signed-in users may access saved profiles and cloud sync, while guest users may store data locally. Shared resume links and exported JSON files can contain personal information, so you should share them carefully and only with people or services you trust.',
      },
      {
        heading: 'Advertising and Service Changes',
        body: 'The website may use cookies, analytics, and advertising services in the future. ResumeForge may display ads through Google AdSense or similar advertising networks. Features may change over time as the service is improved.',
      },
      {
        heading: 'No Job Guarantee',
        body: 'ResumeForge can help you prepare a stronger resume, but it does not guarantee interviews, job offers, hiring outcomes, or employer responses. Your results depend on many factors outside the website.',
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    canonical: '/disclaimer',
    description:
      'Read the ResumeForge disclaimer about AI resume writing assistance, user responsibility, job outcomes, cookies, analytics, and future advertising.',
    intro:
      'ResumeForge is a resume building and writing assistance tool. It is not a recruiter, legal adviser, career guarantee service, or official employer application system.',
    sections: [
      {
        heading: 'Resume Content Responsibility',
        body: 'The website helps users create, edit, save, export, and share resumes. Users are responsible for checking the accuracy, completeness, tone, and suitability of final resume content before submitting it anywhere.',
      },
      {
        heading: 'AI Assistance Disclaimer',
        body: 'AI features are intended only to assist with resume writing. AI may produce suggestions that need editing or correction. Do not include claims, achievements, degrees, dates, employers, or skills unless they are true and can be explained by you.',
      },
      {
        heading: 'Advertising and Third Parties',
        body: 'ResumeForge may use cookies, analytics, and advertising services in the future. The website may display ads through Google AdSense or similar advertising networks. Third-party websites, ads, or services may have their own policies and practices.',
      },
      {
        heading: 'No Professional Outcome Guarantee',
        body: 'ResumeForge does not guarantee that a resume will pass every ATS, lead to interviews, or result in employment. The tool is provided to support resume preparation, and users should make their own decisions about applications and career materials.',
      },
    ],
  },
} as const;

const LegalPage = ({ page }: LegalPageProps) => {
  const content = pages[page];
  const isContact = page === 'contact';

  return (
    <PublicPage>
      <SEO title={content.title} description={content.description} canonical={content.canonical} />
      <section className="px-6 py-16 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">ResumeForge</p>
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">{content.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{content.intro}</p>

          {isContact && (
            <div className="mt-10 grid gap-8 md:grid-cols-[1fr_0.9fr]">
              <form className="card-elevated space-y-4 p-6" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">Name</label>
                  <input id="contact-name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
                  <input id="contact-email" type="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">Message</label>
                  <textarea id="contact-message" rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" placeholder="How can we help?" />
                </div>
                <button type="submit" className="btn-gold rounded-lg px-5 py-2 text-sm">
                  Prepare Message
                </button>
                <p className="text-xs text-muted-foreground">
                  This form is a simple UI placeholder. For now, please email us directly for support.
                </p>
              </form>

              <div className="rounded-xl border border-border bg-muted/30 p-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Email Support</h2>
                <p className="mt-3 text-muted-foreground">
                  For product support, privacy questions, advertising inquiries, or resume builder feedback, contact:
                </p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block font-semibold text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          )}

          {!isContact && (
            <div className="mt-10 space-y-8">
              {content.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-bold text-foreground">{section.heading}</h2>
                  <p className="mt-3 leading-8 text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Build With Confidence</h2>
            <p className="mt-3 text-muted-foreground">
              Ready to create or improve your resume? Open the builder to use templates, AI writing help, saved profiles, exports, and shareable resume data.
            </p>
            <Link to="/builder" className="btn-gold mt-5 inline-flex rounded-lg px-5 py-2 text-sm">
              Open Resume Builder
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
};

export default LegalPage;
