import type { NoteDomainModel } from "@/modules/v1/notes/models/domain/note.domain.model";
import type { SharedUserDomainModel } from "@/modules/v1/user/models/domain/shared-user.domain.model";

export type FolderDomainModel = {
	id: string;
	name: string;
	order: number;
	notes: NoteDomainModel[];
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUserDomainModel;
	parentId: string | null;
	sharedWith: SharedUserDomainModel[];
	description?: string | null;
	modifiedBy: SharedUserDomainModel | null;
	subfolders: Omit<FolderDomainModel, "subfolders" | "notes">[];
};
