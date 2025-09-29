import type { Note } from "@/modules/v1/notes/models/domain/note.model";
import type { ResourceFolderDomainModel } from "./resource-folter.domain.model";

export type RootFolderDomainModel = {
	id: string;
	name: string;
	notes: Note[];
	subfolders: ResourceFolderDomainModel[];
};
