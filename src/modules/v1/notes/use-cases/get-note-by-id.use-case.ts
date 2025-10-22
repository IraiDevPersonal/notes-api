import { HttpError } from "@/lib/errors/http-error";
import type { NoteDomainModel } from "../models/domain/note.domain.model";
import type { NotesRepository } from "../repository";
import { NoteMapper } from "../utils/mappers/note.mapper";

export class GetNoteByIdUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	execute = async (noteId: string): Promise<NoteDomainModel> => {
		const result = await this.repository.getNoteById(noteId);

		if (!result) {
			throw HttpError.notFound("Note not found");
		}

		return NoteMapper.map(result);
	};
}
