import type { NoteDomainModel } from "@/modules/v1/notes/models/domain/note.domain.model";
import type { SharedUserDomainModel } from "@/modules/v1/user/models/domain/shared-user.domain.model";

export type ResourceFolderDomainModel = {
	id: string;
	name: string;
	order: number;
	notes: NoteDomainModel[];
	owner: SharedUserDomainModel;
	sharedWith: SharedUserDomainModel[];
	subfolders: ResourceFolderDomainModel[];
};
