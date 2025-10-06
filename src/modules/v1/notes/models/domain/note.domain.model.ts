import type { SharedUserDomainModel } from "../../../user/models/domain/shared-user.domain.model";

export type NoteDomainModel = {
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
