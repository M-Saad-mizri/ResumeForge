import { Link } from 'react-router-dom';
import { FileText, Sparkles, Download, Layout, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Layout, title: 'Multiple Templates', desc: 'Choose from Modern, Classic, and ATS-friendly templates' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Get smart content suggestions to enhance your CV' },
  { icon: Download, title: 'PDF Export', desc: 'Download your CV as a professional PDF document' },
  { icon: Shield, title: 'ATS Optimized', desc: 'Templates designed to pass Applicant Tracking Systems' },
  { icon: Zap, title: 'Quick Editing', desc: 'Edit sections inline with real-time preview' },
  { icon: FileText, title: 'Save Profiles', desc: 'Save multiple CV profiles for different job applications' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <FileText className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
          </Link>
          <Link
            to="/builder"
            className="btn-gold rounded-lg text-sm"
          >
            Start Building
          </Link>
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
