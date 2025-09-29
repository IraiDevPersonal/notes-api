import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { CustomError } from "@/lib/errors/custom-error";
import { logger } from "@/lib/logger";
import type { FoldersRepository } from "./repositories/folders.repository";
import { DeleteFolderUseCase } from "./use-cases/delete-folder.use-case";
import { GetFoldersUseCase } from "./use-cases/get-folders.use-case";
import { UpsertFolderUseCase } from "./use-cases/upsert-folder.use-case";

export class FoldersController {
	private readonly upsertFolderUseCase: UpsertFolderUseCase;
	private readonly deleteFolderUseCase: DeleteFolderUseCase;
	private readonly getFolderUseCase: GetFoldersUseCase;

	constructor(repository: FoldersRepository) {
		this.upsertFolderUseCase = new UpsertFolderUseCase(repository);
		this.deleteFolderUseCase = new DeleteFolderUseCase(repository);
		this.getFolderUseCase = new GetFoldersUseCase(repository);
	}

	createFolder = async (req: Request, res: Response) => {
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const result = await this.upsertFolderUseCase.executeCreate(userId, req.body);
			responseController.json({ data: result }, 201);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to create folder"
			);
			logger.error({
				source: "FoldersController/createFolder",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	updateFolder = async (req: Request, res: Response) => {
		const folderId = req.params.id;
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const result = await this.upsertFolderUseCase.executeUpdate(
				userId,
				folderId!,
				req.body
			);
			responseController.json({ data: result }, 200);
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to update folder"
			);
			logger.error({
				source: "FoldersController/updateFolder",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	deleteFolder = async (req: Request, res: Response) => {
		const folderId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			await this.deleteFolderUseCase.execute(folderId);
			responseController.noContent();
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to delete folder"
			);
			logger.error({
				source: "FoldersController/deleteFolder",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};

	getFoldersByParetnId = async (req: Request, res: Response) => {
		const folderId = req.params.id;
		const responseController = new ResponseController(res);

		try {
			const result = await this.getFolderUseCase.execute(folderId!);
			responseController.json({ data: result });
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Failed to get folder"
			);
			logger.error({
				source: "FoldersController/getFolderById",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};
}
