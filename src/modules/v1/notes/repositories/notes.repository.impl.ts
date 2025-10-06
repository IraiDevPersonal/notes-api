import { DatabaseClient } from "@/lib/database-client";
import { DatabaseErrorhandler } from "@/lib/errors/database-error-handler";
import { removeUndefined } from "@/lib/utils";
import type { NoteDbModel } from "../models/db/note.db..model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "../models/domain/upsert-note-payload";
import { NOTE_QUERY_SELECTOR } from "../utils/query-selectors/note.query-selector";
import type { NotesRepository } from "./notes.respository";

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

			return await this.db.note.create({
				data: {
					folderId,
					ownerId: userId,
					title: payload.title,
					content: payload.content,
				},
				select: this.noteSelector,
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
}
