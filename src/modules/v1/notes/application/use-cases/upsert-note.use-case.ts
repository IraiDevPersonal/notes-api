import { NoteMapper } from "../../application/mappers/note.mapper";
import type { NotesRepository } from "../../data/repository";
import type { NoteModel } from "../../domain/models/note.model";
import type {
	CreateNoteModel,
	UpdateNoteModel,
} from "../../domain/models/upsert-note.model";

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

	execute = async ({ userId, noteId, body }: UpsertPayload): Promise<NoteModel> => {
		if (noteId) {
			return this.update(userId, noteId, body);
		}
		return this.create(userId, body);
	};

	private create = async (userId: string, body: unknown): Promise<NoteModel> => {
		const note = await this.repository.createNote(userId, body as CreateNoteModel);
		return NoteMapper.map(note);
	};

	private update = async (
		userId: string,
		noteId: string,
		body: unknown
	): Promise<NoteModel> => {
		const note = await this.repository.updateNote(
			userId,
			noteId,
			body as UpdateNoteModel
		);
		return NoteMapper.map(note);
	};
}
