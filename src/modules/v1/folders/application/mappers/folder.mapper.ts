import { NoteMapper } from "@/modules/v1/notes/application/mappers/note.mapper";
import { SharedUserMapper } from "@/modules/v1/user/application/mappers/shared-user.mapper";
import type { FolderDbModel } from "../../data/models/folder-db.model";
import type { FolderModel } from "../../domain/models/folder.model";

export class FolderMapper {
	static map(raw: FolderDbModel): FolderModel {
		return {
			id: raw.id,
			name: raw.name,
			order: raw.order,
			isPinned: raw.isPinned,
			parentId: raw.parentId,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
			description: raw.description,
			commentsCount: raw._count.comments,
			notes: raw.notes.map(NoteMapper.map),
			owner: SharedUserMapper.map(raw.owner),
			sharedWith: {
				counts: raw._count.shareFolders,
				users: SharedUserMapper.toArray(raw.shareFolders.flatMap((f) => f.user)),
			},
			modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
			subfolders: raw.children.map((subFolder) => ({
				id: subFolder.id,
				name: subFolder.name,
				order: subFolder.order,
				createdAt: subFolder.createdAt,
				updatedAt: subFolder.updatedAt,
			})),
		};
	}
}
