import type { ResourceNote } from "../../notes/models/resource-note.model";
import type { ResourceFolder } from "../../user/models/resource-folter.model";

export type RootFolder = {
	id: string;
	name: string;
	notes: ResourceNote[];
	subfolders: ResourceFolder[];
};
