import { Router } from "express";
import { NotesController } from "./controller";
import { NotesRepositoryImpl } from "./repositories/notes.repository.impl";

export class NotesRoutesV1 {
	private static readonly repository = new NotesRepositoryImpl();
	private static readonly controller = new NotesController(this.repository);

	static get routes(): Router {
		const router = Router();

		router.get("/notes/:id", this.controller.getNoteById);
		router.post("/notes", this.controller.createNote);
		router.put("/notes/:id", this.controller.updateNote);
		router.delete("/notes/:id", this.controller.deleteNote);

		return router;
	}
}
