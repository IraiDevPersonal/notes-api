import { Router } from "express";
import { NotesController } from "./controller";
import { NotesService } from "./service";

export class NotesRoutesV1 {
	private static readonly service = new NotesService();
	private static readonly controller = new NotesController(this.service);

	static get routes(): Router {
		const router = Router();

		router.post("/notes", this.controller.createNote);
		router.put("/notes/:id", this.controller.updateNote);

		return router;
	}
}
