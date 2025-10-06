import type { Note } from "@/modules/v1/notes/models/domain/note.model";
import type { SharedUser } from "@/modules/v1/user/models/domain/shared-user.model";

export type ResourceFolderDomainModel = {
	id: string;
	name: string;
	order: number;
	notes: Note[];
	owner: SharedUser;
	sharedWith: SharedUser[];
	subfolders: ResourceFolderDomainModel[];
};
