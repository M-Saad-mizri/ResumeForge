import React from 'react';
import { Cloud, CloudOff, Loader2, CheckCircle2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCV } from '@/contexts/CVContext';
import { Link } from 'react-router-dom';

const SyncStatusBadge: React.FC = () => {
  const { user } = useAuth();
  const { syncStatus } = useCV();

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        title="Sign in to enable cloud sync"
      >
        <CloudOff className="w-3 h-3" />
        <span className="hidden sm:inline">Local Only</span>
      </Link>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Syncing</span>
      </div>
    );
  }

  if (syncStatus === 'synced') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-3 h-3" />
        <span className="hidden sm:inline">Cloud Synced</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
        <Cloud className="w-3 h-3" />
        <span className="hidden sm:inline">Sync Error</span>
      </div>
    );
  }

  // idle
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
      <Cloud className="w-3 h-3" />
      <span className="hidden sm:inline">Cloud</span>
    </div>
  );
};

export default SyncStatusBadge;
