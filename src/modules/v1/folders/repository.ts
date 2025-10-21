import type { Prisma } from "@prisma/client";
import { DatabaseClient } from "@/lib/database-client";
import { DatabaseErrorhandler } from "@/lib/errors/prisma-error-handler";
import { removeUndefined } from "@/lib/utils";
import type { FolderDbModel } from "./models/db/folder.db.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "./models/domain/upsert-folder-payload";
import { FOLDER_QUERY_SELECTOR } from "./utils/query-selectors/folder.query-selector";

export interface FoldersRepository {
	deleteFolder(id: string): Promise<void>;
	getFolderById(id: string): Promise<FolderDbModel | null>;
	updateFolder(
		userId: string,
		folderId: string,
		payload: UpdateFolderPayload
	): Promise<FolderDbModel>;
	createFolder(userId: string, payload: CreateFolderPayload): Promise<FolderDbModel>;
	syncFolderSharedUsers: (folderId: string, userIds: string[]) => Promise<void>;
}

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
			return await this.db.folder.update({
				where: { id: folderId, deletedAt: null },
				data: {
					lastModifiedById: userId,
					...removeUndefined(payload),
				},
				select: this.folderSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	syncFolderSharedUsers = async (
		folderId: string,
		userIds: string[]
		// permission: Permission = "READ"
	): Promise<void> => {
		try {
			await this.db.$transaction(async (tx) => {
				// 1. Obtener todos los IDs de carpetas descendientes
				const allFolderIds = [folderId, ...(await this.getAllChildFolderIds(folderId))];

				// 2. Obtener todos los IDs de notas en esas carpetas
				const allNoteIds = await this.getAllNotesInFolderTree(allFolderIds);

				// 3. Eliminar comparticiones existentes de carpetas
				await tx.shareFolder.deleteMany({
					where: { folderId: { in: allFolderIds } },
				});

				// 4. Eliminar comparticiones existentes de notas
				if (allNoteIds.length > 0) {
					await tx.shareNote.deleteMany({
						where: { noteId: { in: allNoteIds } },
					});
				}

				// 5. Crear nuevas comparticiones de carpetas
				if (userIds.length > 0) {
					const folderShares = allFolderIds.flatMap((fId) =>
						userIds.map((userId) => ({
							folderId: fId,
							userId,
							permission: "READ",
						}))
					) satisfies Prisma.ShareFolderCreateManyInput[];

					await tx.shareFolder.createMany({
						data: folderShares,
						skipDuplicates: true,
					});

					// 6. Crear nuevas comparticiones de notas
					if (allNoteIds.length > 0) {
						const noteShares = allNoteIds.flatMap((nId) =>
							userIds.map((userId) => ({
								noteId: nId,
								userId,
								permission: "READ",
							}))
						) satisfies Prisma.ShareNoteCreateManyInput[];

						await tx.shareNote.createMany({
							data: noteShares,
							skipDuplicates: true,
						});
					}
				}
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	private getAllChildFolderIds = async (folderId: string): Promise<string[]> => {
		const childFolders = await this.db.folder.findMany({
			where: {
				parentId: folderId,
				deletedAt: null,
			},
			select: { id: true },
		});

		const childIds = childFolders.map((f) => f.id);

		// Recursivamente obtener todos los descendientes
		const descendantIds = await Promise.all(
			childIds.map((id) => this.getAllChildFolderIds(id))
		);

		return [...childIds, ...descendantIds.flat()];
	};

	private getAllNotesInFolderTree = async (folderIds: string[]): Promise<string[]> => {
		const notes = await this.db.note.findMany({
			where: {
				folderId: { in: folderIds },
				deletedAt: null,
			},
			select: { id: true },
		});

		return notes.map((n) => n.id);
	};
}
