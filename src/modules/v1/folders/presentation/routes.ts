import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { FolderRepository } from "../data/repository";
import { FolderSharedUsersSchema } from "../domain/schemas/folder-shared-users.schema";
import {
	CreateFolderSchema,
	UpdateFolderSchema,
} from "../domain/schemas/upsert-folder.schema";
import { FoldersController } from "./controller";

const validateRequest = ValidationMiddleware.validateRequest;

export class FoldersRoutesV1 {
	private static readonly repository = new FolderRepository();
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
		router.put(
			"/folders/:id/share",
			[validateRequest({ params: IdParamSchema, body: FolderSharedUsersSchema })],
			this.controller.syncFolderSharedUsers
		);

		return router;
	}
}
