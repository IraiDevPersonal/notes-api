import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { ResourceFolderModel } from "./resource-folter.model";

export type RootFolderModel = {
	id: string;
	name: string;
	notes: NoteModel[];
	subfolders: ResourceFolderModel[];
};
