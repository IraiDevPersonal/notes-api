import { ResourceNoteMapper } from "../../notes/mappers/resource-note.mapper";
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
			parentId: raw.parentId,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
			description: raw.description,
			owner: SharedUserMapper.map(raw.owner),
			sharedWith: SharedUserMapper.toArray(raw.shareFolders.flatMap((f) => f.user)),
			modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
			notes: notesRaw.filter((n) => n.folderId === raw.id).map(ResourceNoteMapper.map),
		};
	}
}
