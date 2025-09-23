import type { Folder, Note, ShareFolder, ShareNote } from "@prisma/client";

export type DBUserResources = {
	notes: Note[];
	folders: Folder[];
	shareNotes: ShareNote[];
	shareFolders: ShareFolder[];
};
