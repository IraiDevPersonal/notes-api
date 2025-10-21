import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import type { NotesRepository } from "./repository";
import { DeleteNoteUseCase } from "./use-cases/delete-note.use-case";
import { GetNoteByIdUseCase } from "./use-cases/get-note-by-id.use-case";
import { SyncNoteSharedUsersUseCase } from "./use-cases/sync-note-shared-users.use-case";
import { UpsertNoteUseCase } from "./use-cases/upsert-note.use-case";

export class NotesController {
	private readonly upsertNoteUseCase: UpsertNoteUseCase;
	private readonly deleteNoteUseCase: DeleteNoteUseCase;
	private readonly getNoteByIdUseCase: GetNoteByIdUseCase;
	private readonly syncNoteSharedUsersUseCase: SyncNoteSharedUsersUseCase;

	constructor(service: NotesRepository) {
		this.upsertNoteUseCase = new UpsertNoteUseCase(service);
		this.deleteNoteUseCase = new DeleteNoteUseCase(service);
		this.getNoteByIdUseCase = new GetNoteByIdUseCase(service);
		this.syncNoteSharedUsersUseCase = new SyncNoteSharedUsersUseCase(
			service,
			this.getNoteByIdUseCase
		);
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
			responseController.errorHandler(error, {
				source: "NotesController/createNote",
				defaultMessage: "Failed to create note",
			});
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
			responseController.errorHandler(error, {
				source: "NotesController/updateNote",
				defaultMessage: "Failed to update note",
			});
		}
	};

	deleteNote = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			await this.deleteNoteUseCase.execute(noteId);
			return responseController.noContent();
		} catch (error) {
			responseController.errorHandler(error, {
				source: "NotesController/deleteNote",
				defaultMessage: "Failed to delete note",
			});
		}
	};

	getNoteById = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			const note = await this.getNoteByIdUseCase.execute(noteId);
			return responseController.json({ data: note });
		} catch (error) {
			responseController.errorHandler(error, {
				source: "NotesController/getNoteById",
				defaultMessage: "Failed to get note by id",
			});
		}
	};

	syncNoteSharedUsers = async (req: Request, res: Response) => {
		const noteId = req.params.id!;
		// const userId = "550e8400-e29b-41d4-a716-446655440000";
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			await this.syncNoteSharedUsersUseCase.execute({
				sharedUsers: req.body.userIds,
				userId,
				noteId,
			});
			return responseController.noContent();
		} catch (error) {
			responseController.errorHandler(error, {
				source: "NotesController/syncNoteSharedUsers",
				defaultMessage: "Failed to sync note shared users",
			});
		}
	};
}
