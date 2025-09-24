export type FolderTree = {
	id: string;
	name: string;
	notes: NoteTree[];
	subfolders: FolderTree[];
	description?: string | null;
};

export type NoteTree = {
	id: string;
	title: string;
	content: string;
};
