import { DatabaseClient } from "@/lib/database-client";
import { DatabaseErrorhandler } from "@/lib/errors/prisma-error-handler";
import { removeUndefined } from "@/lib/utils";
import type { NoteDbModel } from "../data/models/note-db.model";
import type {
	CreateNoteModel,
	UpdateNoteModel,
} from "../domain/models/upsert-note.model";
import type { NotesRepository } from "../domain/repository";
import { NOTE_SELECTOR } from "./selectors/note.selector";

export class NotesRepositoryImpl extends DatabaseClient implements NotesRepository {
	private readonly noteSelector = NOTE_SELECTOR;

	deleteNote = async (id: string): Promise<void> => {
		try {
			await this.db.note.update({
				where: { id },
				data: { deletedAt: new Date() },
				select: { id: true },
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	getNoteById = async (id: string): Promise<NoteDbModel | null> => {
		try {
			return await this.db.note.findUnique({
				where: { id, deletedAt: null },
				select: this.noteSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	createNote = async (userId: string, payload: CreateNoteModel): Promise<NoteDbModel> => {
		try {
			const folderId = payload.folderId || null;

			// Si no está en una carpeta, crear directamente sin transacción
			if (!folderId) {
				return await this.db.note.create({
					data: {
						folderId: null,
						ownerId: userId,
						title: payload.title,
						content: payload.content,
					},
					select: this.noteSelector,
				});
			}

			// Si está en una carpeta, usar transacción para heredar permisos
			return await this.db.$transaction(async (tx) => {
				const note = await tx.note.create({
					data: {
						folderId,
						ownerId: userId,
						title: payload.title,
						content: payload.content,
					},
					select: this.noteSelector,
				});

				const folderShares = await tx.shareFolder.findMany({
					where: { folderId },
					select: {
						userId: true,
						permission: true,
					},
				});

				if (folderShares.length > 0) {
					await tx.shareNote.createMany({
						data: folderShares.map((share) => ({
							noteId: note.id,
							userId: share.userId,
							permission: share.permission,
						})),
						skipDuplicates: true,
					});
				}

				return note;
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	updateNote = async (
		userId: string,
		noteId: string,
		payload: UpdateNoteModel
	): Promise<NoteDbModel> => {
		try {
			const folderId = payload.folderId || null;

			return await this.db.note.update({
				where: { id: noteId, deletedAt: null },
				data: {
					folderId,
					lastModifiedById: userId,
					...removeUndefined(payload),
				},
				select: this.noteSelector,
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};

	syncNoteSharedUsers = async (noteId: string, sharedUsers: string[]): Promise<void> => {
		try {
			await this.db.note.update({
				where: { id: noteId, deletedAt: null },
				data: {
					shareNotes: {
						deleteMany: {},
						create: sharedUsers.map((userId) => ({ userId, permission: "READ" })),
					},
				},
			});
		} catch (error) {
			throw DatabaseErrorhandler.toHttpError(error);
		}
	};
}
