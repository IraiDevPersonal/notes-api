export type FolderTree = {
	id: string;
	name: string;
	subfolders: FolderTree[];
	description?: string | null;
	notes: { id: string; title: string; content: string }[];
};
