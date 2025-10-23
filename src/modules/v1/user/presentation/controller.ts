import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { GetUserResourcesUseCase } from "../application/use-cases/get-user-resources.use-case";
import type { UserRepositoryImpl } from "../data/repository";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;

	constructor(service: UserRepositoryImpl) {
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
