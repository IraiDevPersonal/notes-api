import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { DbNote } from "../models/db/db-note.model";
import type { Note } from "../models/domain/note.model";

export class NoteMapper {
	static map = (raw: DbNote): Note => {
		return {
			id: raw.id,
			order: raw.order,
			title: raw.title,
			content: raw.content,
			folderId: raw.folderId,
			updatedAt: raw.updatedAt,
			createdAt: raw.createdAt,
			comentsCounts: raw._count.comments,
			owner: SharedUserMapper.map(raw.owner),
			sharedWith: SharedUserMapper.toArray(raw.shareNotes.flatMap((n) => n.user)),
			modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
		};
	};
}
