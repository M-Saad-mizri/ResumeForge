import React from 'react';
import { useCV } from '@/contexts/CVContext';
import { FolderOpen, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ProfileManager = () => {
  const { profiles, activeProfile, loadProfile, deleteProfile, createNewProfile } = useCV();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline max-w-[120px] truncate">
            {activeProfile?.name || 'Profiles'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={createNewProfile} className="gap-2">
          <Plus className="w-4 h-4" />
          New CV
        </DropdownMenuItem>
        {profiles.length > 0 && <DropdownMenuSeparator />}
        {profiles.map(p => (
          <DropdownMenuItem key={p.id} className="flex items-center justify-between group">
            <span onClick={() => loadProfile(p.id)} className="flex-1 truncate cursor-pointer">
              {p.name}
            </span>
            <button
              onClick={e => { e.stopPropagation(); deleteProfile(p.id); }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileManager;
