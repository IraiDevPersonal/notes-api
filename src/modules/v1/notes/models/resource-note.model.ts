import type { SharedUser } from "../../user/models/shared-user.model";

export type ResourceNote = {
	id: string;
	title: string;
	order: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUser;
	folderId: string | null;
	sharedWith: SharedUser[];
	modifiedBy: SharedUser | null;
};
