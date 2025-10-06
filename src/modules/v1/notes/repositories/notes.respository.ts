import type { NoteDbModel } from "../models/db/note.db..model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "../models/domain/upsert-note-payload";

export abstract class NotesRepository {
	abstract deleteNote(id: string): Promise<void>;
	abstract getNoteById(id: string): Promise<NoteDbModel | null>;
	abstract updateNote(
		userId: string,
		noteId: string,
		payload: UpdateNotePayload
	): Promise<NoteDbModel>;
	abstract createNote(userId: string, payload: CreateNotePayload): Promise<NoteDbModel>;
}
