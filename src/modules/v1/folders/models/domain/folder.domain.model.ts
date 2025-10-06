import type { Note } from "@/modules/v1/notes/models/domain/note.model";
import type { SharedUser } from "@/modules/v1/user/models/domain/shared-user.model";

export type FolderDomainModel = {
	id: string;
	name: string;
	order: number;
	notes: Note[];
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUser;
	parentId: string | null;
	sharedWith: SharedUser[];
	description?: string | null;
	modifiedBy: SharedUser | null;
	subfolders: Omit<FolderDomainModel, "subfolders" | "notes">[];
};
