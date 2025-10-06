import { NoteMapper } from "../../notes/mappers/note.mapper";
import type { NoteDbModel } from "../../notes/models/db/note.db..model";
import { SharedUserMapper } from "../../user/mappers/shared-user.mapper";
import type { ResourceFolderDbModel } from "../models/db/resource-folder.db.model";
import type { ResourceFolderDomainModel } from "../models/domain/resource-folter.domain.model";

export class ResourceFolderMapper {
	static map(
		folderRaw: ResourceFolderDbModel,
		notesRaw: NoteDbModel[]
	): Omit<ResourceFolderDomainModel, "subfolders"> {
		return {
			id: folderRaw.id,
			name: folderRaw.name,
			order: folderRaw.order,
			owner: SharedUserMapper.map(folderRaw.owner),
			sharedWith: SharedUserMapper.toArray(folderRaw.shareFolders.flatMap((f) => f.user)),
			notes: notesRaw.filter((n) => n.folderId === folderRaw.id).map(NoteMapper.map),
		};
	}
}
