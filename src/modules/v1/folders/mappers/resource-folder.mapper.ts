import { NoteMapper } from "../../notes/mappers/note.mapper";
import type { DbNote } from "../../notes/models/db/db-note.model";
import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { DbFolder } from "../models/db/db-folder.model";
import type { ResourceFolder } from "../models/domain/resource-folter.model";

export class ResourceFolderMapper {
	static map(raw: DbFolder, notesRaw: DbNote[]): Omit<ResourceFolder, "subfolders"> {
		return {
			id: raw.id,
			name: raw.name,
			order: raw.order,
			owner: SharedUserMapper.map(raw.owner),
			sharedWith: SharedUserMapper.toArray(raw.shareFolders.flatMap((f) => f.user)),
			notes: notesRaw.filter((n) => n.folderId === raw.id).map(NoteMapper.map),
			// parentId: raw.parentId,
			// createdAt: raw.createdAt,
			// updatedAt: raw.updatedAt,
			// description: raw.description,
			// modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
		};
	}
}
