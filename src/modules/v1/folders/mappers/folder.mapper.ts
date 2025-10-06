import { NoteMapper } from "@/modules/v1/notes/mappers/note.mapper";
import { SharedUserMapper } from "@/modules/v1/user/mappers/shared-user.mapper";
import type { FolderDbModel } from "../models/db/folder.db.model";
import type { FolderDomainModel } from "../models/domain/folder.domain.model";

export class FolderMapper {
	private static baseMap(
		raw: Omit<FolderDbModel, "children" | "notes">
	): Omit<FolderDomainModel, "subfolders" | "notes"> {
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
		};
	}

	static map(raw: FolderDbModel): FolderDomainModel {
		return {
			...this.baseMap(raw),
			notes: raw.notes.map(NoteMapper.map),
			subfolders: raw.children.map(this.baseMap),
		};
	}
}
