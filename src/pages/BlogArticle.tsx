import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import PublicPage from '@/components/PublicPage';
import AdPlaceholder from '@/components/AdPlaceholder';
import { getBlogArticle } from '@/data/blogArticles';
import { absoluteUrl } from '@/config/site';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getBlogArticle(slug);

  if (!article) {
    return (
      <PublicPage>
        <SEO title="Guide Not Found" description="The requested ResumeForge guide could not be found." canonical={`/blog/${slug ?? ''}`} noindex />
        <section className="px-6 py-20">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">Guide Not Found</h1>
            <p className="mt-4 text-muted-foreground">The guide you are looking for may have moved or no longer exists.</p>
            <Link to="/blog" className="btn-gold mt-6 inline-flex rounded-lg px-5 py-2 text-sm">
              Back to Guides
            </Link>
          </div>
        </section>
      </PublicPage>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'ResumeForge',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ResumeForge',
    },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
  };

  return (
    <PublicPage>
      <SEO
        title={article.title}
        description={article.description}
        canonical={`/blog/${article.slug}`}
        type="article"
        structuredData={structuredData}
      />

      <article className="px-6 py-12 md:py-16">
        <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to guides
            </Link>

            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>{article.readTime}</span>
                <span aria-hidden="true">&bull;</span>
                <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">{article.title}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{article.description}</p>
            </div>

            <AdPlaceholder className="my-10 max-w-3xl" />

            <div className="max-w-3xl space-y-9">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-bold text-foreground">{section.heading}</h2>
                  <div className="mt-3 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="leading-8 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Create Your Resume</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Use ResumeForge to turn these tips into a professional resume. You can create, edit, save, export, and share resume data with optional AI writing help.
              </p>
              <Link to="/builder" className="btn-gold mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm">
                Open Resume Builder
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder />
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h2 className="font-display text-xl font-bold text-foreground">Responsible AI Use</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  AI can help draft resume content, but you should review every line for accuracy before applying.
                </p>
                <Link to="/disclaimer" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                  Read disclaimer
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PublicPage>
  );
};

export default BlogArticle;
