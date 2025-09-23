import type { Folder, Note, ShareFolder, ShareNote } from '@prisma/client';

export type UserResources = {
  notes: Note[];
  folders: Folder[];
  shareNotes: ShareNote[];
  shareFolders: ShareFolder[];
};
