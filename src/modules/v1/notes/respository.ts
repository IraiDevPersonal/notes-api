import type { DbNote } from "./models/db/db-note.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "./models/upsert-note-payload.model";

export abstract class NotesRepository {
	abstract deleteNote(id: string): Promise<void>;
	abstract getNoteById(id: string): Promise<DbNote | null>;
	abstract updateNote(id: string, payload: UpdateNotePayload): Promise<DbNote>;
	abstract createNote(userId: string, payload: CreateNotePayload): Promise<DbNote>;
}
