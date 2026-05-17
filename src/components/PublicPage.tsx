import { ReactNode } from 'react';
import PublicHeader from '@/components/PublicHeader';
import SiteFooter from '@/components/SiteFooter';

interface PublicPageProps {
  children: ReactNode;
}

const PublicPage = ({ children }: PublicPageProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    <PublicHeader />
    <main className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export default PublicPage;
