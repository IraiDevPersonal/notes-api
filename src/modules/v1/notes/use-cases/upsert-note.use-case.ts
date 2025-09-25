import { logger } from "@/lib/logger";
import type { UseCaseResult } from "@/types/global";
import type { DbNote } from "../models/db/db-note.model";
import type { NotesRepository } from "../respository";
import { UpsertNoteValidation } from "../validations/upsert-note.validation";

type ExecuteResponse = UseCaseResult<DbNote>;

export class UpsertNoteUseCase {
	private readonly repository: NotesRepository;
	private readonly sourceError = "CreateNoteUseCase/execute";

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	executeCreate = async (userId: string, body: unknown): Promise<ExecuteResponse> => {
		const [error, payload] = UpsertNoteValidation.validateCreatePayload(body);

		if (error) {
			logger.error({
				source: this.sourceError,
				message: error,
			});
			return [error, 400, null];
		}

		const note = await this.repository.createNote(userId, payload!);
		return [null, 201, note];
	};

	executeUpdate = async (
		userId: string,
		noteId: string | undefined,
		body: unknown
	): Promise<ExecuteResponse> => {
		const [error, payload] = UpsertNoteValidation.validateUpdatePayload(body);

		if (error) {
			logger.error({
				source: this.sourceError,
				message: error,
			});
			return [error, 400, null];
		}

		if (!noteId) {
			const errorMessage = "Note ID is required";
			logger.error({
				source: this.sourceError,
				message: errorMessage,
			});
			return [errorMessage, 400, null];
		}

		const note = await this.repository.updateNote(userId, noteId, payload!);
		return [null, 201, note];
	};
}
