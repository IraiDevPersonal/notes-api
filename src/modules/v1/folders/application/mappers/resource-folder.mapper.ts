import type { NoteDbModel } from "@/modules/v1/notes/models/db/note.db.model";
import { NoteMapper } from "@/modules/v1/notes/utils/mappers/note.mapper";
import { SharedUserMapper } from "@/modules/v1/user/utils/mappers/shared-user.mapper";
import type { ResourceFolderDbModel } from "../../data/models/resource-folder-db.model";
import type { ResourceFolderModel } from "../../domain/models/resource-folter.model";

export class ResourceFolderMapper {
	static map(
		folderRaw: ResourceFolderDbModel,
		notesRaw: NoteDbModel[]
	): Omit<ResourceFolderModel, "subfolders"> {
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
