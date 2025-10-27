import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { DeleteFolderUseCase } from "../application/use-cases/delete-folder.use-case";
import { GetFolderByIdUseCase } from "../application/use-cases/get-folder-by-id.use-case";
import { SyncFolderSharedUsersUseCase } from "../application/use-cases/sync-folder-shared-users.use-case";
import { UpsertFolderUseCase } from "../application/use-cases/upsert-folder.use-case";
import type { FolderSharedUsersModel } from "../domain/models/folder-shared-users.model";
import type { FoldersRepository } from "../domain/repository";

export class FoldersController {
	private readonly upsertFolderUseCase: UpsertFolderUseCase;
	private readonly deleteFolderUseCase: DeleteFolderUseCase;
	private readonly getFolderByIdUseCase: GetFolderByIdUseCase;
	private readonly syncFolderSharedUsersUseCase: SyncFolderSharedUsersUseCase;

	constructor(repository: FoldersRepository) {
		this.upsertFolderUseCase = new UpsertFolderUseCase(repository);
		this.deleteFolderUseCase = new DeleteFolderUseCase(repository);
		this.getFolderByIdUseCase = new GetFolderByIdUseCase(repository);
		this.syncFolderSharedUsersUseCase = new SyncFolderSharedUsersUseCase(
			repository,
			this.getFolderByIdUseCase
		);
	}

	createFolder = async (req: Request, res: Response) => {
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const folder = await this.upsertFolderUseCase.execute({ userId, body: req.body });
			responseController.json({ data: folder }, 201);
		} catch (error) {
			responseController.error(error, {
				source: "FoldersController/createFolder",
				defaultMessage: "Failed to create folder",
			});
		}
	};

	updateFolder = async (req: Request, res: Response) => {
		const folderId = req.params.id!;
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const folder = await this.upsertFolderUseCase.execute({
				body: req.body,
				folderId,
				userId,
			});
			responseController.json({ data: folder }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "FoldersController/updateFolder",
				defaultMessage: "Failed to update folder",
			});
		}
	};

	deleteFolder = async (req: Request, res: Response) => {
		const folderId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			await this.deleteFolderUseCase.execute(folderId);
			responseController.noContent();
		} catch (error) {
			responseController.error(error, {
				source: "FoldersController/deleteFolder",
				defaultMessage: "Failed to delete folder",
			});
		}
	};

	getFolderById = async (req: Request, res: Response) => {
		const folderId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			const folder = await this.getFolderByIdUseCase.execute(folderId);
			responseController.json({ data: folder });
		} catch (error) {
			responseController.error(error, {
				source: "FoldersController/getFolderById",
				defaultMessage: "Failed to get folder by id",
			});
		}
	};

	syncFolderSharedUsers = async (req: Request, res: Response) => {
		// const userId = "550e8400-e29b-41d4-a716-446655440001";
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const folderId = req.params.id!;
		const payload = req.body as FolderSharedUsersModel;
		const responseController = new ResponseController(res);

		try {
			await this.syncFolderSharedUsersUseCase.execute({
				sharedUsers: payload.userIds,
				folderId,
				userId,
			});
			responseController.noContent();
		} catch (error) {
			responseController.error(error, {
				source: "FoldersController/syncFolderSharedUsers",
				defaultMessage: "Failed to sync folder shared users",
			});
		}
	};
}
