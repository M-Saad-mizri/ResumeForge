import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, FileText, Shield, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import PublicPage from '@/components/PublicPage';
import AdPlaceholder from '@/components/AdPlaceholder';
import { blogArticles } from '@/data/blogArticles';

const trustSignals = [
  { icon: FileText, label: 'Free resume builder' },
  { icon: Sparkles, label: 'AI writing assistance' },
  { icon: CheckCircle2, label: 'Save and manage resumes' },
  { icon: ArrowRight, label: 'Export and share resume data' },
  { icon: Shield, label: 'Privacy-focused experience' },
];

const Blog = () => (
  <PublicPage>
    <SEO
      title="Resume Writing Guides"
      description="Read practical resume writing guides about ATS-friendly resumes, graduate resume formats, resume mistakes, CV differences, and responsible AI resume writing."
      canonical="/blog"
      type="website"
    />

    <section className="px-6 py-16 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <BookOpen className="h-4 w-4" />
            Resume Guides
          </p>
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Practical Resume Advice for Better Applications
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Learn how to write clearer resumes, avoid common mistakes, use AI responsibly, and prepare documents that are easier for recruiters and applicant tracking systems to review.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {trustSignals.map((signal) => (
            <div key={signal.label} className="rounded-lg border border-border bg-card p-4">
              <signal.icon className="mb-3 h-5 w-5 text-accent" />
              <p className="text-sm font-medium text-foreground">{signal.label}</p>
            </div>
          ))}
        </div>

        <AdPlaceholder className="my-10" />

        <div className="grid gap-6 md:grid-cols-2">
          {blogArticles.map((article) => (
            <article key={article.slug} className="card-elevated p-6">
              <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>{article.readTime}</span>
                <span aria-hidden="true">&bull;</span>
                <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">{article.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{article.description}</p>
              <Link to={`/blog/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-accent hover:underline">
                Read guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  </PublicPage>
);

export default Blog;
