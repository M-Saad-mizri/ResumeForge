import { Link } from 'react-router-dom';
import { FileText, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Builder', to: '/builder' },
  { label: 'Guides', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const PublicHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-gold">
            <FileText className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
        </Link>

        <nav aria-label="Primary navigation" className="order-last flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium md:order-none md:w-auto md:gap-5">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to={user ? '/builder' : '/auth'}
          className="btn-gold inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm"
        >
          {!user && <LogIn className="h-4 w-4" />}
          {user ? 'Go to Builder' : 'Sign In'}
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;
