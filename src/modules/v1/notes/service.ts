import { DbClient } from "@/lib/db-client";
import { CustomError } from "@/lib/errors/custom-error";
import { DBErrorHandler } from "@/lib/errors/db-error-hanlder";
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
			await this.db.note.update({
				where: { id },
				data: { deletedAt: new Date() },
				select: { id: true },
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error deleting note."
			);
			throw new CustomError(message, statusCode);
		}
	};

	getNoteById = async (id: string): Promise<DbNote | null> => {
		try {
			return await this.db.note.findUnique({
				where: { id, deletedAt: null },
				select: this.noteSelector,
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error getting note."
			);
			throw new CustomError(message, statusCode);
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
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error creating note."
			);
			throw new CustomError(message, statusCode);
		}
	};

	updateNote = async (
		userId: string,
		noteId: string,
		payload: UpdateNotePayload
	): Promise<DbNote> => {
		try {
			const folderId = payload.folderId || null;
			const adaptedPayload: Record<string, string> = {};

			if (payload.title !== undefined) {
				adaptedPayload.title = payload.title;
			}
			if (payload.content !== undefined) {
				adaptedPayload.content = payload.content;
			}

			return await this.db.note.update({
				where: { id: noteId },
				data: {
					...adaptedPayload,
					folderId,
					lastModifiedById: userId,
				},
				select: this.noteSelector,
			});
		} catch (error) {
			const { message, statusCode } = DBErrorHandler.getErrorData(
				error,
				"Error updating note."
			);
			throw new CustomError(message, statusCode);
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
