import type { FolderDbModel } from "../models/db/folder.db.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload.model";

export abstract class FoldersRepository {
	abstract deleteFolder(id: string): Promise<void>;
	abstract getFolderById(id: string): Promise<FolderDbModel | null>;
	abstract updateFolder(
		userId: string,
		folderId: string,
		payload: UpdateFolderPayload
	): Promise<FolderDbModel>;
	abstract createFolder(
		userId: string,
		payload: CreateFolderPayload
	): Promise<FolderDbModel>;
}
