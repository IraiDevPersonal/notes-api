import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { SharedUserDomainModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type FolderModel = {
	id: string;
	name: string;
	order: number;
	notes: NoteModel[];
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUserDomainModel;
	parentId: string | null;
	sharedWith: SharedUserDomainModel[];
	description?: string | null;
	modifiedBy: SharedUserDomainModel | null;
	subfolders: Omit<FolderModel, "subfolders" | "notes">[];
};
