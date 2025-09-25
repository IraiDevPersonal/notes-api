import type { ResourceNote } from "@/modules/v1/notes/models/domain/resource-note.model";
import type { ResourceFolder } from "./resource-folter.model";

export type RootFolder = {
	id: string;
	name: string;
	notes: ResourceNote[];
	subfolders: ResourceFolder[];
};
