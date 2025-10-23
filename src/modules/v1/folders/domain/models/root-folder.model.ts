import type { NoteDomainModel } from "@/modules/v1/notes/models/domain/note.domain.model";
import type { ResourceFolderModel } from "./resource-folter.model";

export type RootFolderModel = {
	id: string;
	name: string;
	notes: NoteDomainModel[];
	subfolders: ResourceFolderModel[];
};
