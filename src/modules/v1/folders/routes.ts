import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { FoldersController } from "./controller";
import { FoldersRepositoryImpl } from "./repositories/folders.repository.impl";
import { CreateFolderSchema, UpdateFolderSchema } from "./schemas/upsert-folder.schema";

const validateRequest = ValidationMiddleware.validateRequest;

export class FoldersRoutesV1 {
	private static readonly repository = new FoldersRepositoryImpl();
	private static readonly controller = new FoldersController(this.repository);

	static get routes(): Router {
		const router = Router();

		router.get(
			"/folders/:id",
			[validateRequest({ params: IdParamSchema })],
			this.controller.getFolderById
		);
		router.post(
			"/folders",
			[validateRequest({ body: CreateFolderSchema })],
			this.controller.createFolder
		);
		router.put(
			"/folders/:id",
			[validateRequest({ params: IdParamSchema, body: UpdateFolderSchema })],
			this.controller.updateFolder
		);
		router.delete(
			"/folders/:id",
			[validateRequest({ params: IdParamSchema })],
			this.controller.deleteFolder
		);

		return router;
	}
}
