import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { DbNote } from "../models/db/db-note.model";
import type { ResourceNote } from "../models/domain/resource-note.model";

export class ResourceNoteMapper {
	static map = (note: DbNote): ResourceNote => {
		return {
			id: note.id,
			order: note.order,
			title: note.title,
			content: note.content,
			folderId: note.folderId,
			updatedAt: note.updatedAt,
			createdAt: note.createdAt,
			owner: SharedUserMapper.map(note.owner),
			sharedWith: SharedUserMapper.toArray(note.shareNotes.flatMap((n) => n.user)),
			modifiedBy: note.lastModifiedBy ? SharedUserMapper.map(note.lastModifiedBy) : null,
		};
	};
}
