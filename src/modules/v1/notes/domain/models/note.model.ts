import type { SharedUserDomainModel } from "../../../user/domain/models/shared-user.model";

export type NoteModel = {
	id: string;
	title: string;
	order: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	owner: SharedUserDomainModel;
	comentsCounts: number;
	folderId: string | null;
	sharedWith: SharedUserDomainModel[];
	modifiedBy: SharedUserDomainModel | null;
};
