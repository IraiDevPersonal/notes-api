import { logger } from "@/lib/logger";
import type { UseCaseResult } from "@/types/global";
import { NoteMapper } from "../mappers/note.mapper";
import type { Note } from "../models/domain/note.model";
import type { NotesRepository } from "../respository";

type ExecuteResponse = UseCaseResult<Note>;

export class GetNotesUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	executeFindUnique = async (noteId: string | undefined): Promise<ExecuteResponse> => {
		if (!noteId) {
			const errorMessage = "Note ID is required";
			logger.error({
				source: "GetNotesUseCase/executeFindUnique",
				message: errorMessage,
			});
			return [errorMessage, 400, null];
		}

		const result = await this.repository.getNoteById(noteId);

		if (!result) {
			const errorMessage = "Note not found";
			logger.error({
				source: "GetNotesUseCase/execute",
				message: errorMessage,
			});
			return [errorMessage, 404, null];
		}

		return [null, 200, NoteMapper.map(result)];
	};
}
