import { NoteMapper } from "../../notes/mappers/note.mapper";
import type { DbNote } from "../../notes/models/db/db-note.model";
import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { ResourceFolderDbModel } from "../models/db/resource-folder.db.model";
import type { FolderDomainModel } from "../models/domain/folder.domain.model";

export class FolderMapper {
	static map(
		raw: ResourceFolderDbModel,
		notesRaw: DbNote[]
	): Omit<FolderDomainModel, "subfolders"> {
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
			notes: notesRaw.filter((n) => n.folderId === raw.id).map(NoteMapper.map),
		};
	}
}
