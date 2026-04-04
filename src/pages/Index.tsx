import { Link } from 'react-router-dom';
import { FileText, Sparkles, Download, Layout, Shield, Zap, Image, Share2, Upload, Palette, Save, Database, Eye, Layers, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: Layout, title: 'Multiple Templates', desc: 'Choose from Modern, Classic, and ATS-friendly templates' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Get smart content suggestions to enhance your CV' },
  { icon: Download, title: 'PDF Export', desc: 'Download your CV as a professional PDF document' },
  { icon: Shield, title: 'ATS Optimized', desc: 'Templates designed to pass Applicant Tracking Systems' },
  { icon: Zap, title: 'Quick Editing', desc: 'Edit sections inline with real-time preview' },
  { icon: FileText, title: 'Save Profiles', desc: 'Save multiple CV profiles for different job applications' },
];

const WorkflowStep = ({ index, icon: Icon, title, description, steps }: {
  index: number;
  icon: React.ElementType;
  title: string;
  description: string;
  steps: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.05 }}
    className="flex gap-6 items-start"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">Step {index}</span>
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-3 leading-relaxed">{description}</p>
      <ul className="space-y-1.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-accent flex-shrink-0" />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background" role="main">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <FileText className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/builder" className="btn-gold rounded-lg text-sm">
                Go to Builder
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/10 transition-colors inline-flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="btn-gold rounded-lg text-sm inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-24 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-accent/20 text-gold-light mb-6">
              Free & Professional
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Build Your Perfect
              <br />
              <span className="text-accent">CV in Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 font-light">
              Professional CV builder with AI-powered suggestions, multiple templates,
              and ATS optimization. Create, save, and download — all for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/builder"
                className="btn-gold text-base px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Your CV
              </Link>
              <Link
                to="/builder"
                className="px-8 py-4 rounded-xl border border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/5 transition-all duration-300 inline-flex items-center justify-center gap-2 font-medium"
              >
                View Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Powerful tools to create a standout CV that gets you noticed
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              A complete workflow from editing to sharing — here's everything you can do
            </p>
          </motion.div>

          <div className="space-y-12 max-w-4xl mx-auto">
            <WorkflowStep index={1} icon={Database} title="Start with Sample Data"
              description="Not sure where to begin? Load sample data with one click to populate your CV with realistic content. Preview how every template looks before entering your own info."
              steps={['Click "Load Sample Data" in the builder', 'All sections fill with professional example content', 'Explore templates and layouts with real-looking data', 'Replace with your own details when ready']} />

            <WorkflowStep index={2} icon={Eye} title="Real-Time Editing & Preview"
              description="Edit on the left panel while changes appear instantly in the live preview on the right. On mobile, toggle between Edit and Preview modes seamlessly."
              steps={['Fill in personal info, experience, education, skills & languages', 'Add custom sections for certifications, projects, or anything else', 'Drag & drop to reorder sections exactly how you want', 'Every change is reflected in the preview immediately']} />

            <WorkflowStep index={3} icon={Palette} title="Custom Design Settings"
              description="Fine-tune every visual aspect of your CV. Adjust accent colors, fonts, spacing, and page width to create a document that's uniquely yours."
              steps={['Pick an accent color from the palette or enter a hex code', 'Choose heading and body fonts independently', 'Adjust font sizes for headings and body text', 'Control section spacing and page width (170mm–230mm) with sliders']} />

            <WorkflowStep index={4} icon={Layers} title="6 Professional Templates"
              description="Switch between Modern, Classic, Minimal, Creative, Executive, and ATS-Optimized templates. Each respects your design settings — switching is instant and non-destructive."
              steps={['Browse all 6 templates in the Template Selector', 'Click any template to apply it instantly', 'Content and design settings are preserved across switches', 'ATS template is optimized for applicant tracking systems']} />

            <WorkflowStep index={5} icon={Save} title="Save Multiple Profiles"
              description="Create different CV versions for different job applications. Each profile stores its own content, template, and design settings. Everything auto-saves as you edit."
              steps={['Click "Save" and name your profile (e.g., "Tech Resume")', 'Switch between saved profiles from the profile manager', 'Each profile remembers its template and design settings', 'Auto-saves every change — never lose your work']} />

            <WorkflowStep index={6} icon={Download} title="Export as PDF"
              description="Generate a print-ready PDF with proper A4 formatting. The export uses your browser's print engine for pixel-perfect output with correct margins."
              steps={['Click "Export PDF" in the top bar', 'Your browser\'s print dialog opens with the CV', 'Choose "Save as PDF" or print directly', 'The PDF respects your exact design settings and page width']} />

            <WorkflowStep index={7} icon={Image} title="Export as HD Image"
              description="Download your CV as a high-resolution PNG at 3x scale. Perfect for sharing on social media, portfolios, or anywhere that accepts images."
              steps={['Open the "More" menu (⋮) in the top bar', 'Click "Export HD Image"', 'A 3x resolution PNG is generated and downloaded', 'Maintains crisp text and colors at any zoom level']} />

            <WorkflowStep index={8} icon={Share2} title="JSON Export & Import"
              description="Transfer your CV between devices without an account. Export as JSON, then import on any device to continue editing exactly where you left off."
              steps={['Export: More menu → "Export JSON" downloads a .json file', 'Import via file: "Import JSON" → upload the file', 'Import via text: Paste raw JSON directly into the import dialog', 'All content, template, and design settings are preserved']} />

            <WorkflowStep index={9} icon={Share2} title="Share via Link"
              description="Generate a unique shareable link to your CV with one click. Anyone with the link can view and import your CV into their own builder — no account needed. Links are valid for 30 days."
              steps={['Open "More" menu → "Share via Link"', 'Click "Generate Share Link" to create a unique URL', 'Copy and send the link to anyone', 'Recipients can instantly load your CV and start editing']} />

            <WorkflowStep index={10} icon={Sparkles} title="AI-Powered Assistant"
              description="Use built-in AI to supercharge your CV. Generate professional summaries, craft job descriptions, get skill suggestions, receive optimization tips, or paste rough text and let AI structure it into a complete CV."
              steps={['Rough Text → CV: Paste unstructured info and AI builds your entire CV', 'Summary Generator: Create a polished professional summary from your experience', 'Job Description Writer: Generate impactful bullet points for any role', 'Skill Suggestions: Get relevant skills recommended based on your experience', 'CV Review & Tips: Receive actionable feedback to improve your CV']} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="gradient-hero rounded-2xl p-12 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto">
              Start building your professional CV now. No signup required.
            </p>
            <Link
              to="/builder"
              className="btn-gold text-base px-8 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 ResumeForge. Free & Open.</span>
          <span>Built with ❤️</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
