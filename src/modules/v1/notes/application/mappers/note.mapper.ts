import { SharedUserMapper } from "@/modules/v1/user/application/mappers/shared-user.mapper";
import type { NoteDbModel } from "../../data/models/note-db.model";
import type { NoteModel } from "../../domain/models/note.model";

export class NoteMapper {
	static map = (raw: NoteDbModel): NoteModel => {
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
			sharedWith: {
				count: raw._count.shareNotes,
				users: SharedUserMapper.toArray(raw.shareNotes.flatMap((n) => n.user)),
			},
			modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
		};
	};
}
