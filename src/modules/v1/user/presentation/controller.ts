import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { GetUserResourcesUseCase } from "../application/use-cases/get-user-resources.use-case";
import { GetUserTreeResourcesUseCase } from "../application/use-cases/get-user-resources.use-case.resp";
import type { ResoruceQueryModel } from "../domain/models/resource-query.model";
import type { UserRepository } from "../domain/repository";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;
	private readonly getUserTreeResourcesUseCase: GetUserTreeResourcesUseCase;

	constructor(repository: UserRepository) {
		this.getUserResourcesUseCase = new GetUserResourcesUseCase(repository);
		this.getUserTreeResourcesUseCase = new GetUserTreeResourcesUseCase(repository);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id! as string;
		const query = req.query as ResoruceQueryModel;
		const responseController = new ResponseController(res);

		try {
			const resources = await this.getUserResourcesUseCase.execute(userId, query.type);
			responseController.json({ data: resources }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "UserController/getUserResources",
				defaultMessage: "Failed to get user resources",
			});
		}
	};

	// TODO: Controlador para prueba de profundidad de la estructura de carpetas y notas
	getUserTreeResources = async (req: Request, res: Response) => {
		const userId = req.params.id! as string;
		const responseController = new ResponseController(res);

		try {
			const resources = await this.getUserTreeResourcesUseCase.execute(userId);
			responseController.json({ data: resources }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "UserController/getUserTreeResources",
				defaultMessage: "Failed to get user tree resources",
			});
		}
	};
}
