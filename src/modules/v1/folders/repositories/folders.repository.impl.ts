import { DatabaseClient } from "@/lib/database-client";
import { DatabaseErrorhandler } from "@/lib/errors/database-error-handler";
import type { FolderDbModel } from "../models/db/folder.db.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload.model";
import { FOLDER_QUERY_SELECTOR } from "../utils/query-selectors/folder.query-selector";
import type { FoldersRepository } from "./folders.repository";

export class FoldersRepositoryImpl extends DatabaseClient implements FoldersRepository {
	private readonly folderSelector = FOLDER_QUERY_SELECTOR;

	deleteFolder = async (id: string): Promise<void> => {
		try {
			await this.db.folder.update({
				where: { id },
				data: { deletedAt: new Date() },
				select: { id: true },
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	getFolderById = async (id: string): Promise<FolderDbModel | null> => {
		try {
			return await this.db.folder.findUnique({
				where: { id, deletedAt: null },
				select: this.folderSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	createFolder = async (
		userId: string,
		payload: CreateFolderPayload
	): Promise<FolderDbModel> => {
		try {
			return await this.db.folder.create({
				data: {
					ownerId: userId,
					name: payload.name,
					description: payload.description || null,
					parentId: payload.parentId || null,
					order: payload.order ?? 0,
				},
				select: this.folderSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	updateFolder = async (
		userId: string,
		folderId: string,
		payload: UpdateFolderPayload
	): Promise<FolderDbModel> => {
		try {
			const adaptedPayload: Record<string, unknown> = {};

			if (payload.name !== undefined) adaptedPayload.name = payload.name;
			if (payload.description !== undefined)
				adaptedPayload.description = payload.description;
			if (payload.parentId !== undefined)
				adaptedPayload.parentId = payload.parentId || null;
			if (payload.order !== undefined) adaptedPayload.order = payload.order;

			return await this.db.folder.update({
				where: { id: folderId, deletedAt: null },
				data: {
					...adaptedPayload,
					lastModifiedById: userId,
				},
				select: this.folderSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};
}
