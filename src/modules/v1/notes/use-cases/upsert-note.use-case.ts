import { NoteMapper } from "../mappers/note.mapper";
import type { NoteDomainModel } from "../models/domain/note.domain.model";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "../models/domain/upsert-note-payload";
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

	execute = async ({ userId, noteId, body }: UpsertPayload): Promise<NoteDomainModel> => {
		if (noteId) {
			return this.update(userId, noteId, body);
		}
		return this.create(userId, body);
	};

	private create = async (userId: string, body: unknown): Promise<NoteDomainModel> => {
		const note = await this.repository.createNote(userId, body as CreateNotePayload);
		return NoteMapper.map(note);
	};

	private update = async (
		userId: string,
		noteId: string,
		body: unknown
	): Promise<NoteDomainModel> => {
		const note = await this.repository.updateNote(
			userId,
			noteId,
			body as UpdateNotePayload
		);
		return NoteMapper.map(note);
	};
}
