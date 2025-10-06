import type { NoteDomainModel } from "@/modules/v1/notes/models/domain/note.domain.model";
import type { ResourceFolderDomainModel } from "./resource-folter.domain.model";

export type RootFolderDomainModel = {
	id: string;
	name: string;
	notes: NoteDomainModel[];
	subfolders: ResourceFolderDomainModel[];
};
