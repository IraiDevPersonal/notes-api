import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { logger } from "@/lib/logger";
import type { NotesRepository } from "./respository";
import { UpsertNoteUseCase } from "./use-cases/upsert-note.use-case";

export class NotesController {
	private readonly upsertNoteUseCase: UpsertNoteUseCase;

	constructor(service: NotesRepository) {
		this.upsertNoteUseCase = new UpsertNoteUseCase(service);
	}

	createNote = async (req: Request, res: Response) => {
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const [error, statusCode, note] = await this.upsertNoteUseCase.executeCreate(
				userId,
				req.body
			);

			if (error) {
				logger.error({
					source: "NotesController/createNote",
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const errorMessage = "Failed to create note";
			logger.error({
				source: "NotesController/createNote",
				message: errorMessage,
				error,
			});
			responseController.error(errorMessage, 500);
		}
	};

	updateNote = async (req: Request, res: Response) => {
		const noteId = req.params.id;
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const [error, statusCode, note] = await this.upsertNoteUseCase.executeUpdate(
				userId,
				noteId,
				req.body
			);

			if (error) {
				logger.error({
					source: "NotesController/updateNote",
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const errorMessage = "Failed to update note";
			logger.error({
				source: "NotesController/updateNote",
				message: errorMessage,
				error,
			});
			responseController.error(errorMessage, 500);
		}
	};
}
