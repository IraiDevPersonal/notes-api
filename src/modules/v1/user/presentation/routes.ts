import { Router } from "express";
import { UserRepository } from "../data/repository";
import { UserController } from "./controller";

export class UserRoutesV1 {
	private static readonly repository = new UserRepository();
	private static readonly controller = new UserController(this.repository);

	static get routes(): Router {
		const router = Router();

		// TODO: obtener id de usuario autenticado cuando se implemente autenticación
		router.get("/user/:id/resources", this.controller.getUserResources);

		return router;
	}
}
