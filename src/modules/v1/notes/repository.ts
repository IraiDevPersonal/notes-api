import { DatabaseClient } from "@/lib/database-client";
import { DatabaseErrorhandler } from "@/lib/errors/prisma-error-handler";
import { removeUndefined } from "@/lib/utils";
import type { NoteDbModel } from "./models/db/note.db.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "./models/domain/upsert-note-payload";
import { NOTE_QUERY_SELECTOR } from "./utils/query-selectors/note.query-selector";

export interface NotesRepository {
	deleteNote(id: string): Promise<void>;
	getNoteById(id: string): Promise<NoteDbModel | null>;
	updateNote(
		userId: string,
		noteId: string,
		payload: UpdateNotePayload
	): Promise<NoteDbModel>;
	createNote(userId: string, payload: CreateNotePayload): Promise<NoteDbModel>;
	syncNoteSharedUsers(noteId: string, sharedUsers: string[]): Promise<void>;
}

export class NotesRepositoryImpl extends DatabaseClient implements NotesRepository {
	private readonly noteSelector = NOTE_QUERY_SELECTOR;

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

	createNote = async (
		userId: string,
		payload: CreateNotePayload
	): Promise<NoteDbModel> => {
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
		payload: UpdateNotePayload
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
