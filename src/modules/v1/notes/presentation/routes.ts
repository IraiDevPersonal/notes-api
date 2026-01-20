import { Router } from "express";
import {
	validateRequest,
} from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { NotesRepositoryImpl } from "../data/repository.impl";
import { NoteSharedUsersSchema } from "../domain/schemas/note-shared-users.schema";
import { CreateNoteSchema, UpdateNoteSchema } from "../domain/schemas/upsert-note.schema";
import { NotesController } from "./controller";

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
		router.patch(
			"/notes/:id/share",
			[validateRequest({ params: IdParamSchema, body: NoteSharedUsersSchema })],
			this.controller.syncNoteSharedUsers
		);
		router.patch(
			"/notes/:id/pin",
			[validateRequest({ params: IdParamSchema })],
			this.controller.toggleNotePin
		);

		return router;
	}
}
