import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import type { UserRepository } from "./repository";
import { GetUserResourcesUseCase } from "./use-cases/get-user-resources.use-case";

export class UserController {
	private readonly getUserResourceUseCase: GetUserResourcesUseCase;

	constructor(service: UserRepository) {
		this.getUserResourceUseCase = new GetUserResourcesUseCase(service);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id;
		const responseController = new ResponseController(res);

		try {
			const [error, statusCode, data] =
				await this.getUserResourceUseCase.execute(userId);

			if (error) {
				responseController.error(error, statusCode);
				return;
			}

			responseController.json({ data }, statusCode);
		} catch (error) {
			console.error(error);
			responseController.error("Failed to get user resources", 500);
		}
	};
}
