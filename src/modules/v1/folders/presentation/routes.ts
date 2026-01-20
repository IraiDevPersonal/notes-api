import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { IdParamSchema } from "@/lib/schemas/shared";
import { FoldersRepositoryImpl } from "../data/repository.impl";
import { FolderSharedUsersSchema } from "../domain/schemas/folder-shared-users.schema";
import {
	CreateFolderSchema,
	UpdateFolderSchema,
} from "../domain/schemas/upsert-folder.schema";
import { FoldersController } from "./controller";

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
		router.patch(
			"/folders/:id/share",
			[validateRequest({ params: IdParamSchema, body: FolderSharedUsersSchema })],
			this.controller.syncFolderSharedUsers
		);
		router.patch(
			"/folders/:id/pin",
			[validateRequest({ params: IdParamSchema })],
			this.controller.toggleFolderPin
		);

		return router;
	}
}
