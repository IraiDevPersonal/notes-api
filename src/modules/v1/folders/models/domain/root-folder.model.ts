import type { Note } from "@/modules/v1/notes/models/domain/note.model";
import type { ResourceFolder } from "./resource-folter.model";

export type RootFolder = {
	id: string;
	name: string;
	notes: Note[];
	subfolders: ResourceFolder[];
};
