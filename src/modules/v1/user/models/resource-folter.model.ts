import type { ResourceNote } from "@/modules/v1/notes/models/resource-note.model";
import type { SharedUser } from "./shared-user.model";

export type ResourceFolder = {
	id: string;
	name: string;
	order?: number;
	createdAt?: Date;
	updatedAt?: Date;
	notes: ResourceNote[];
	owner?: SharedUser;
	parentId?: string | null;
	subfolders: ResourceFolder[];
	sharedWith?: SharedUser[];
	description?: string | null;
	modifiedBy?: SharedUser | null;
};
