import type { DbNote } from "./models/db/db-note.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "./models/domain/upsert-note-payload.model";

export abstract class NotesRepository {
	abstract deleteNote(id: string): Promise<void>;
	abstract getNoteById(id: string): Promise<DbNote | null>;
	abstract updateNote(
		userId: string,
		noteId: string,
		payload: UpdateNotePayload
	): Promise<DbNote>;
	abstract createNote(userId: string, payload: CreateNotePayload): Promise<DbNote>;
}
