import type { SharedUserModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type NoteModel = {
	id: string;
	title: string;
	order: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUserModel;
	comentsCounts: number;
	folderId: string | null;
	sharedWith: {
		users: SharedUserModel[];
		count: number;
	};
	modifiedBy: SharedUserModel | null;
};
