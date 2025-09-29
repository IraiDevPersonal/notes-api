import { logger } from "@/lib/logger";
import type { UseCaseResult } from "@/types/global";
import type { NotesRepository } from "../repositories/notes.respository";

type ExecuteResponse = UseCaseResult<void>;

export class DeleteNoteUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	execute = async (id: string | undefined): Promise<ExecuteResponse> => {
		if (!id) {
			const errorMessage = "Note id is required";
			logger.error({
				source: "DeleteNoteUseCase/execute",
				message: errorMessage,
			});
			return [errorMessage, 400, null];
		}
		await this.repository.deleteNote(id);
		return [null, 204, null];
	};
}
