import type { SharedUser } from "../../../user/models/domain/shared-user.model";

export type Note = {
	id: string;
	title: string;
	order: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUser;
	comentsCounts: number;
	folderId: string | null;
	sharedWith: SharedUser[];
	modifiedBy: SharedUser | null;
};
