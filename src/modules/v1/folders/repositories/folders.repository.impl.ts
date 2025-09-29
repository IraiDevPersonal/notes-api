import { DbClient } from "@/lib/db-client";
import { CustomError } from "@/lib/errors/custom-error";
import { DBErrorHandler } from "@/lib/errors/db-error-hanlder";
import type { DbNote } from "@/modules/v1/notes/models/db/db-note.model";
import { NOTE_QUERY_SELECTOR } from "@/modules/v1/notes/utils/query-selectors/note.query-selector";
import type { FolderDbModel } from "../models/db/folder.db.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload.model";
import { FOLDER_QUERY_SELECTOR } from "../utils/query-selectors/folder.query-selector";
import type { FoldersRepository } from "./folders.repository";

export class FoldersRepositoryImpl extends DbClient implements FoldersRepository {
	private readonly folderSelector = FOLDER_QUERY_SELECTOR;

	deleteFolder = async (id: string): Promise<void> => {
		try {
			await this.db.folder.update({
				where: { id },
				data: { deletedAt: new Date() },
				select: { id: true },
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error deleting folder."
			);
			throw new CustomError(message, statusCode);
		}
	};

	getFoldersByParentId = async (id: string): Promise<FolderDbModel[]> => {
		try {
			// FIXME: buscar forma de obtener todo el árbol de carpetas
			return await this.db.folder.findMany({
				where: { parentId: id, AND: [{ id }] },
				select: this.folderSelector,
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error getting folder."
			);
			throw new CustomError(message, statusCode);
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
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error creating folder."
			);
			throw new CustomError(message, statusCode);
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
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error updating folder."
			);
			throw new CustomError(message, statusCode);
		}
	};

	getNotesByFolder = async (folderId: string): Promise<DbNote[]> => {
		try {
			return await this.db.note.findMany({
				where: { folderId, deletedAt: null },
				select: NOTE_QUERY_SELECTOR,
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error getting folder notes."
			);
			throw new CustomError(message, statusCode);
		}
	};
}
