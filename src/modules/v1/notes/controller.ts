import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { HttpError } from "@/lib/errors/http-error";
import { logger } from "@/lib/logger";
import type { NotesRepository } from "./repositories/notes.respository";
import { DeleteNoteUseCase } from "./use-cases/delete-note.use-case";
import { GetNoteByIdUseCase } from "./use-cases/get-note-by-id.use-case";
import { UpsertNoteUseCase } from "./use-cases/upsert-note.use-case";

export class NotesController {
	private readonly upsertNoteUseCase: UpsertNoteUseCase;
	private readonly deleteNoteUseCase: DeleteNoteUseCase;
	private readonly getNoteByIdUseCase: GetNoteByIdUseCase;

	constructor(service: NotesRepository) {
		this.upsertNoteUseCase = new UpsertNoteUseCase(service);
		this.deleteNoteUseCase = new DeleteNoteUseCase(service);
		this.getNoteByIdUseCase = new GetNoteByIdUseCase(service);
	}

	createNote = async (req: Request, res: Response) => {
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const note = await this.upsertNoteUseCase.execute({
				userId,
				body: req.body,
			});
			return responseController.json({ data: note }, 201);
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Failed to create note"
			);
			logger.error({
				source: "NotesController/createNote",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	updateNote = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const note = await this.upsertNoteUseCase.execute({
				body: req.body,
				userId,
				noteId,
			});
			return responseController.json({ data: note }, 200);
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Failed to update note"
			);
			logger.error({
				source: "NotesController/updateNote",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	deleteNote = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			await this.deleteNoteUseCase.execute(noteId);
			return responseController.noContent();
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Failed to delete note"
			);
			logger.error({
				source: "NotesController/deleteNote",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	getNoteById = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			const note = await this.getNoteByIdUseCase.execute(noteId);
			return responseController.json({ data: note });
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(error, "Failed to get note");
			logger.error({
				source: "NotesController/getNoteById",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};
}
