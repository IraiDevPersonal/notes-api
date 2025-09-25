import { DbClient } from "@/lib/db-client";
import type { DbNote } from "./models/db/db-note.model";
import type { NoteComment } from "./models/domain/note-comment.model";
import type { NoteTag } from "./models/domain/note-tag.model";
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
			console.log(error);
			throw new Error("Error deleting note.");
		}
	};

	getNoteById = async (id: string): Promise<DbNote | null> => {
		try {
			return await this.db.note.findUnique({
				where: { id },
				select: this.noteSelector,
			});
		} catch (error) {
			console.log(error);
			throw new Error("Error getting note.");
		}
	};

	createNote = async (userId: string, payload: CreateNotePayload): Promise<DbNote> => {
		try {
			const folderId = payload.folderId || null;
			const filteredTags = this.filterTags(payload.tags);
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
					tags: {
						create: filteredTags,
					},
				},
				select: this.noteSelector,
			});
		} catch (error) {
			console.log(error);
			throw new Error("Error creating note.");
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
			console.log(error);
			throw new Error("Error updating note.");
		}
	};

	private filterTags = (tags: NoteTag[] | undefined) => {
		return (
			tags
				?.filter((tag) => tag.id)
				.map((tag) => ({
					tagId: tag.id!,
					tag: {
						name: tag.name,
						color: tag.color,
					},
				})) || []
		);
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
