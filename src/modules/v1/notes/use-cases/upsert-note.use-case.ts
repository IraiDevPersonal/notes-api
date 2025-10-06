import { NoteMapper } from "../mappers/note.mapper";
import type { Note } from "../models/domain/note.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "../models/domain/upsert-note-payload.model";
import type { NotesRepository } from "../repositories/notes.respository";

type UpsertPayload = {
	noteId?: string;
	userId: string;
	body: unknown;
};

export class UpsertNoteUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	execute = async ({ userId, noteId, body }: UpsertPayload): Promise<Note> => {
		if (noteId) {
			return this.update(userId, noteId, body);
		}
		return this.create(userId, body);
	};

	private create = async (userId: string, body: unknown): Promise<Note> => {
		const note = await this.repository.createNote(userId, body as CreateNotePayload);
		return NoteMapper.map(note);
	};

	private update = async (
		userId: string,
		noteId: string,
		body: unknown
	): Promise<Note> => {
		const note = await this.repository.updateNote(
			userId,
			noteId,
			body as UpdateNotePayload
		);
		return NoteMapper.map(note);
	};
}
