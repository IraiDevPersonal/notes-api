import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { SharedUserModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type FolderModel = {
	id: string;
	name: string;
	order: number;
	notes: NoteModel[];
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUserModel;
	parentId: string | null;
	sharedWith: SharedUserModel[];
	description?: string | null;
	modifiedBy: SharedUserModel | null;
	subfolders: Omit<FolderModel, "subfolders" | "notes">[];
};
