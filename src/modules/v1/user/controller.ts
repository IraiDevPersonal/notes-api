import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { HttpError } from "@/lib/errors/http-error";
import { logger } from "@/lib/logger";
import type { UserRepository } from "./repositories/user.repository";
import { GetUserResourcesUseCase } from "./use-cases/get-user-resources.use-case";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;

	constructor(service: UserRepository) {
		this.getUserResourcesUseCase = new GetUserResourcesUseCase(service);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id!;
		const responseController = new ResponseController(res);

		try {
			const resources = await this.getUserResourcesUseCase.execute(userId);
			responseController.json({ data: resources }, 200);
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Failed to get user resources"
			);
			logger.error({
				source: "UserController/getUserResources",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};
}
