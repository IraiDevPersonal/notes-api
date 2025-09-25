import { DbClient } from "@/lib/db-client";
import { logger } from "@/lib/logger";
import type { DbNote } from "./models/db/db-note.model";
import type { NoteComment } from "./models/domain/note-comment.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "./models/domain/upsert-note-payload.model";
import type { NotesRepository } from "./respository";
import { NOTE_QUERY_SELECTOR } from "./utils/query-selectors/note.query-selector";

export class NotesService extends DbClient implements NotesRepository {
	private readonly noteSelector = NOTE_QUERY_SELECTOR;

	deleteNote = async (id: string): Promise<void> => {
		try {
			await this.db.note.delete({ where: { id }, select: this.noteSelector });
		} catch (error) {
			const errorMessage = "Error deleting note.";
			logger.error({
				source: "NotesService/deleteNote",
				message: errorMessage,
				error,
			});
			throw new Error(errorMessage);
		}
	};

	getNoteById = async (id: string): Promise<DbNote | null> => {
		try {
			return await this.db.note.findUnique({
				where: { id },
				select: this.noteSelector,
			});
		} catch (error) {
			const errorMessage = "Error getting note.";
			logger.error({
				source: "NotesService/getNoteById",
				message: errorMessage,
				error,
			});
			throw new Error(errorMessage);
		}
	};

	createNote = async (userId: string, payload: CreateNotePayload): Promise<DbNote> => {
		try {
			const folderId = payload.folderId || null;
			const mappedComments = this.mapComments(payload.comments, userId, folderId);

			return await this.db.note.create({
				data: {
					ownerId: userId,
					title: payload.title,
					content: payload.content,
					folderId,
					comments: {
						create: mappedComments,
					},
				},
				select: this.noteSelector,
			});
		} catch (error) {
			const errorMessage = "Error creating note.";
			logger.error({
				source: "NotesService/createNote",
				message: errorMessage,
				error,
			});
			throw new Error(errorMessage);
		}
	};

	updateNote = async (id: string, payload: UpdateNotePayload): Promise<DbNote> => {
		try {
			const folderId = payload.folderId || null;

			return await this.db.note.update({
				where: { id: id },
				data: {
					...payload,
					folderId,
				},
				select: this.noteSelector,
			});
		} catch (error) {
			const errorMessage = "Error updating note.";
			logger.error({
				source: "NotesService/updateNote",
				message: errorMessage,
				error,
			});
			throw new Error(errorMessage);
		}
	};

	private mapComments = (
		comments: NoteComment[] | undefined,
		userId: string,
		folderId: string | null
	) => {
		return (
			comments?.map((comment) => ({
				...comment,
				userId,
				folderId,
			})) || []
		);
	};
}
