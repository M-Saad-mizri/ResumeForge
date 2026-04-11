import React, { useState } from 'react';
import { useCV } from '@/contexts/CVContext';
import { FolderOpen, Trash2, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ProfileManager = () => {
  const { profiles, activeProfile, loadProfile, deleteProfile, createNewProfile, renameProfile } = useCV();
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState('');
  const [renameName, setRenameName] = useState('');

  const startRename = (id: string, currentName: string) => {
    setRenameId(id);
    setRenameName(currentName);
    setRenameOpen(true);
  };

  const confirmRename = () => {
    if (renameName.trim()) {
      renameProfile(renameId, renameName.trim());
    }
    setRenameOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground sm:h-9 sm:w-auto sm:px-3 sm:gap-1.5 sm:variant-outline">
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
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2">
                <button
                  onClick={e => { e.stopPropagation(); startRename(p.id, p.name); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteProfile(p.id); }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename CV</DialogTitle>
          </DialogHeader>
          <Input
            value={renameName}
            onChange={e => setRenameName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirmRename()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileManager;
