import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { logger } from "@/lib/logger";
import type { UserRepository } from "./repository";
import { GetUserResourcesUseCase } from "./use-cases/get-user-resources.use-case";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;

	constructor(service: UserRepository) {
		this.getUserResourcesUseCase = new GetUserResourcesUseCase(service);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id;
		const responseController = new ResponseController(res);

		try {
			const [error, statusCode, data] =
				await this.getUserResourcesUseCase.execute(userId);

			if (error) {
				responseController.error(error, statusCode);
				return;
			}

			responseController.json({ data }, statusCode);
		} catch (error) {
			const errorMessage = "Failed to get user resources";
			logger.error({
				source: "UserController/getUserResources",
				message: errorMessage,
				error,
			});
			responseController.error(errorMessage, 500);
		}
	};
}
