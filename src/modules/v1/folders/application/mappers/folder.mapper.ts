import { NoteMapper } from "@/modules/v1/notes/application/mappers/note.mapper";
import { SharedUserMapper } from "@/modules/v1/user/application/mappers/shared-user.mapper";
import type { FolderDbModel } from "../../data/models/folder-db.model";
import type { FolderModel } from "../../domain/models/folder.model";

export class FolderMapper {
	private static baseMap(
		raw: Omit<FolderDbModel, "children" | "notes">
	): Omit<FolderModel, "subfolders" | "notes"> {
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

	static map(raw: FolderDbModel): FolderModel {
		return {
			...this.baseMap(raw),
			notes: raw.notes.map(NoteMapper.map),
			subfolders: raw.children.map(this.baseMap),
		};
	}
}
