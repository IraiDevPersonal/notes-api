import { HttpError } from "@/lib/errors/http-error";
import { NoteMapper } from "../../application/mappers/note.mapper";
import type { NotesRepository } from "../../data/repository";
import type { NoteModel } from "../../domain/models/note.model";

export class GetNoteByIdUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	execute = async (noteId: string): Promise<NoteModel> => {
		const result = await this.repository.getNoteById(noteId);

		if (!result) {
			throw HttpError.notFound("Note not found");
		}

		return NoteMapper.map(result);
	};
}
