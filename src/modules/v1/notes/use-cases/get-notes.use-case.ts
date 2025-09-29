import { logger } from "@/lib/logger";
import { CustomError } from "../../../../lib/errors/custom-error";
import { NoteMapper } from "../mappers/note.mapper";
import type { Note } from "../models/domain/note.model";
import type { NotesRepository } from "../repositories/notes.respository";

export class GetNotesUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	executeFindUnique = async (noteId: string): Promise<Note> => {
		const result = await this.repository.getNoteById(noteId);

		if (!result) {
			const errorMessage = "Note not found";
			logger.error({
				source: "GetNotesUseCase/execute",
				message: errorMessage,
			});
			throw CustomError.notFound(errorMessage);
		}

		return NoteMapper.map(result);
	};
}
