import { Router } from "express";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { UserRepositoryImpl } from "../data/repository.impl";
import { ResourceQuerySchema } from "../domain/schemas/resource-query.schema";
import { UserController } from "./controller";

const validateRequest = ValidationMiddleware.validateRequest;

export class UserRoutesV1 {
	private static readonly repository = new UserRepositoryImpl();
	private static readonly controller = new UserController(this.repository);

	static get routes(): Router {
		const router = Router();

		// FIXME: obtener id de usuario autenticado cuando se implemente autenticación
		router.get(
			"/user/:id/resources",
			[validateRequest({ query: ResourceQuerySchema })],
			this.controller.getUserResources
		);

		// TODO: Endpoint para prueba de profundidad de la estructura de carpetas y notas
		router.get("/user/:id/resources/tree", this.controller.getUserTreeResources);

		return router;
	}
}
