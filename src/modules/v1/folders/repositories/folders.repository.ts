import type { DbNote } from "@/modules/v1/notes/models/db/db-note.model";
import type { FolderDbModel } from "../models/db/folder.db.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload.model";

export abstract class FoldersRepository {
	abstract deleteFolder(id: string): Promise<void>;
	abstract getFoldersByParentId(id: string): Promise<FolderDbModel[]>;
	abstract updateFolder(
		userId: string,
		folderId: string,
		payload: UpdateFolderPayload
	): Promise<FolderDbModel>;
	abstract createFolder(
		userId: string,
		payload: CreateFolderPayload
	): Promise<FolderDbModel>;
	abstract getNotesByFolder(folderId: string): Promise<DbNote[]>;
}
