import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { GetLoggedUserUseCase } from "../application/use-cases/get-logged-user.use-case";
import { GetUserResourcesUseCase } from "../application/use-cases/get-user-resources.use-case";
import { GetUserTreeResourcesUseCase } from "../application/use-cases/get-user-tree-resources.use-case";
import type { ResoruceQueryModel } from "../domain/models/resource-query.model";
import type { UserRepository } from "../domain/repository";

export class UserController {
	private readonly getUserResourcesUseCase: GetUserResourcesUseCase;
	private readonly getUserTreeResourcesUseCase: GetUserTreeResourcesUseCase;
	private readonly getUserUseCase: GetLoggedUserUseCase;

	constructor(repository: UserRepository) {
		this.getUserResourcesUseCase = new GetUserResourcesUseCase(repository);
		this.getUserTreeResourcesUseCase = new GetUserTreeResourcesUseCase(repository);
		this.getUserUseCase = new GetLoggedUserUseCase(repository);
	}

	getUserResources = async (req: Request, res: Response) => {
		const userId = req.params.id! as string;
		const query = req.query as ResoruceQueryModel;
		const responseController = new ResponseController(res);

		try {
			const resources = await this.getUserResourcesUseCase.execute(userId, query);
			responseController.json({ data: resources }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "UserController/getUserResources",
				defaultMessage: "Failed to get user resources",
			});
		}
	};

	getMe = async (_: Request, res: Response) => {
		const userId = "550e8400-e29b-41d4-a716-446655440000";
		const responseController = new ResponseController(res);

		try {
			const user = await this.getUserUseCase.execute(userId);
			responseController.json({ data: user }, 200);
		} catch (error) {
			responseController.error(error, {
				source: "UserController/getMe",
				defaultMessage: "Failed to get user",
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
