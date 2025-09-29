import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { NotesController } from "./controller";
import { NotesRepositoryImpl } from "./repositories/notes.repository.impl";
import { CreateNoteSchema, UpdateNoteSchema } from "./schemas/upsert-note.schema";

const validateRequest = ValidationMiddleware.validateRequest;

export class NotesRoutesV1 {
	private static readonly repository = new NotesRepositoryImpl();
	private static readonly controller = new NotesController(this.repository);

	static get routes(): Router {
		const router = Router();

		router.get(
			"/notes/:id",
			[validateRequest({ params: IdParamSchema })],
			this.controller.getNoteById
		);
		router.post(
			"/notes",
			[validateRequest({ body: CreateNoteSchema })],
			this.controller.createNote
		);
		router.put(
			"/notes/:id",
			[
				validateRequest({
					params: IdParamSchema,
					body: UpdateNoteSchema,
				}),
			],
			this.controller.updateNote
		);
		router.delete(
			"/notes/:id",
			[validateRequest({ params: IdParamSchema })],
			this.controller.deleteNote
		);

		return router;
	}
}
