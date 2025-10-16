import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
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
			responseController.errorHandler(error, {
				source: "UserController/getUserResources",
				defaultMessage: "Failed to get user resources",
			});
		}
	};
}
