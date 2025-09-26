import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { CustomError } from "@/lib/errors/custom-error";
import { logger } from "@/lib/logger";
import type { NotesRepository } from "./respository";
import { DeleteNoteUseCase } from "./use-cases/delete-note.use-case";
import { GetNotesUseCase } from "./use-cases/get-notes.use-case";
import { UpsertNoteUseCase } from "./use-cases/upsert-note.use-case";

export class NotesController {
	private readonly upsertNoteUseCase: UpsertNoteUseCase;
	private readonly deleteNoteUseCase: DeleteNoteUseCase;
	private readonly getNoteUseCase: GetNotesUseCase;

	constructor(service: NotesRepository) {
		this.upsertNoteUseCase = new UpsertNoteUseCase(service);
		this.deleteNoteUseCase = new DeleteNoteUseCase(service);
		this.getNoteUseCase = new GetNotesUseCase(service);
	}

	createNote = async (req: Request, res: Response) => {
		const errorSource = "NotesController/createNote";
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const [error, statusCode, note] = await this.upsertNoteUseCase.executeCreate(
				userId,
				req.body
			);

			if (error) {
				logger.error({
					source: errorSource,
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to create note"
			);
			logger.error({
				source: errorSource,
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	updateNote = async (req: Request, res: Response) => {
		const noteId = req.params.id;
		const errorSource = "NotesController/updateNote";
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
					source: errorSource,
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to update note"
			);
			logger.error({
				source: errorSource,
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	deleteNote = async (req: Request, res: Response) => {
		const noteId = req.params.id;
		const responseController = new ResponseController(res);
		const errorSource = "NotesController/deleteNote";

		try {
			const [error, statusCode, note] = await this.deleteNoteUseCase.execute(noteId);

			if (error) {
				logger.error({
					source: errorSource,
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to delete note"
			);
			logger.error({
				source: errorSource,
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	getNoteById = async (req: Request, res: Response) => {
		const noteId = req.params.id;
		const responseController = new ResponseController(res);
		const errorSource = "NotesController/getNote";

		try {
			const [error, statusCode, note] =
				await this.getNoteUseCase.executeFindUnique(noteId);

			if (error) {
				logger.error({
					source: errorSource,
					message: error,
				});
				return responseController.error(error, statusCode);
			}
			return responseController.json({ data: note }, statusCode);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to get note"
			);
			logger.error({
				source: errorSource,
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};
}
