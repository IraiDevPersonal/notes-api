import type { Note } from "./note.model";
import type { SharedUser } from "./shared-user.model";

export type FolderTree = {
	id: string;
	name: string;
	order?: number;
	createdAt?: Date;
	updatedAt?: Date;
	notes: Note[];
	owner?: SharedUser;
	parentId?: string | null;
	subfolders: FolderTree[];
	sharedWith?: SharedUser[];
	description?: string | null;
	modifiedBy?: SharedUser | null;
};
