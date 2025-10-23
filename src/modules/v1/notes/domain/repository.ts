import type { NoteDbModel } from "../data/models/note-db.model";
import type { CreateNoteModel, UpdateNoteModel } from "./models/upsert-note.model";

export abstract class NotesRepository {
	abstract createNote(userId: string, payload: CreateNoteModel): Promise<NoteDbModel>;
	abstract updateNote(
		userId: string,
		noteId: string,
		payload: UpdateNoteModel
	): Promise<NoteDbModel>;
	abstract getNoteById(noteId: string): Promise<NoteDbModel | null>;
	abstract deleteNote(noteId: string): Promise<void>;
	abstract syncNoteSharedUsers(noteId: string, userIds: string[]): Promise<void>;
}
