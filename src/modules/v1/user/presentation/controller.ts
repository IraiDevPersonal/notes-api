import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { GetUserResourcesUseCase } from "../application/use-cases/get-user-resources.use-case";
import type { ResourceType } from "../data/models/resource-type.model";
import type { UserRepository } from "../domain/repository";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;

	constructor(repository: UserRepository) {
		this.getUserResourcesUseCase = new GetUserResourcesUseCase(repository);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id!;
		const type = req.params.type! as ResourceType;
		const responseController = new ResponseController(res);

		try {
			const resources = await this.getUserResourcesUseCase.execute(userId, type);
			responseController.json({ data: resources }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "UserController/getUserResources",
				defaultMessage: "Failed to get user resources",
			});
		}
	};
}
