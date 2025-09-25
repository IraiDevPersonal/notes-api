import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { DbNote } from "../models/db/db-note.model";
import type { ResourceNote } from "../models/domain/resource-note.model";

export class ResourceNoteMapper {
	static map = (raw: DbNote): ResourceNote => {
		return {
			id: raw.id,
			order: raw.order,
			title: raw.title,
			content: raw.content,
			folderId: raw.folderId,
			updatedAt: raw.updatedAt,
			createdAt: raw.createdAt,
			owner: SharedUserMapper.map(raw.owner),
			sharedWith: SharedUserMapper.toArray(raw.shareNotes.flatMap((n) => n.user)),
			modifiedBy: raw.lastModifiedBy ? SharedUserMapper.map(raw.lastModifiedBy) : null,
		};
	};
}
