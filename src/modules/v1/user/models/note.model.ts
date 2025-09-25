import type { SharedUser } from "./shared-user.model";

export type Note = {
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
