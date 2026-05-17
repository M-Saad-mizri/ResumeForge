import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const footerLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms and Conditions', to: '/terms-and-conditions' },
  { label: 'Disclaimer', to: '/disclaimer' },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/70 px-6 py-8">
      <div className="container mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-gold">
            <FileText className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">ResumeForge</span>
        </Link>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          Copyright &copy; {year} Resume Builder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
