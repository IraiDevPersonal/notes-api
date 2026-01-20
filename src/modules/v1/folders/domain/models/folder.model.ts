import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { SharedUserModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type FolderModel = {
	id: string;
	name: string;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	isPinned: boolean;
	notes: NoteModel[];
	commentsCount: number;
	owner: SharedUserModel;
	parentId: string | null;
	description?: string | null;
	modifiedBy: SharedUserModel | null;
	sharedWith: {
		counts: number;
		users: SharedUserModel[];
	};
	subfolders: Pick<FolderModel, "id" | "name" | "order" | "createdAt" | "updatedAt">[];
};
