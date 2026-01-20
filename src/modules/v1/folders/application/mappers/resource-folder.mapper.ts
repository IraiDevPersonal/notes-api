import { SharedUserMapper } from "@/modules/v1/user/application/mappers/shared-user.mapper";
import type { ResourceFolderDbModel } from "../../data/models/resource-folder-db.model";
import type { ResourceFolderModel } from "../../domain/models/resource-folter.model";

export class ResourceFolderMapper {
	static map(
		folderRaw: ResourceFolderDbModel
	): Omit<ResourceFolderModel, "subfolders" | "notes"> {
		return {
			id: folderRaw.id,
			name: folderRaw.name,
			order: folderRaw.order,
			isPinned: folderRaw.isPinned,
			owner: SharedUserMapper.map(folderRaw.owner),
			sharedWith: SharedUserMapper.toArray(folderRaw.shareFolders.flatMap((f) => f.user)),
		};
	}
}
