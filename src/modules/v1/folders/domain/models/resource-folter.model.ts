import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { SharedUserDomainModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type ResourceFolderModel = {
	id: string;
	name: string;
	order: number;
	notes: NoteModel[];
	owner: SharedUserDomainModel;
	sharedWith: SharedUserDomainModel[];
	subfolders: ResourceFolderModel[];
};
