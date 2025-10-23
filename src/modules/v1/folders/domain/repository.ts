import type { FolderDbModel } from "../data/models/folder-db.model";
import type { CreateFolderModel, UpdateFolderModel } from "./models/upsert-folder.model";

export abstract class FoldersRepository {
	abstract createFolder(
		userId: string,
		payload: CreateFolderModel
	): Promise<FolderDbModel>;
	abstract updateFolder(
		userId: string,
		folderId: string,
		payload: UpdateFolderModel
	): Promise<FolderDbModel>;
	abstract getFolderById(folderId: string): Promise<FolderDbModel | null>;
	abstract deleteFolder(folderId: string): Promise<void>;
	abstract syncFolderSharedUsers(folderId: string, userIds: string[]): Promise<void>;
}
