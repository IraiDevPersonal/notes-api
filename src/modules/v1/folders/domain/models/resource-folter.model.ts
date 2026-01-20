import type { SharedUserModel } from "@/modules/v1/user/domain/models/shared-user.model";

export type ResourceFolderModel = {
	id: string;
	name: string;
	order: number;
	isPinned: boolean;
	owner: SharedUserModel;
	sharedWith: SharedUserModel[];
};
