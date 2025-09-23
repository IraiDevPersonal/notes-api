import { Router } from "express";
import { UserRoutesV1 } from "./modules/v1/user/routes";

export class AppRouter {
	static get routes(): Router {
		const router = Router();
		const currentDate = new Date();

		router.get("/health", (_, res) => {
			res.json({
				status: "healthy",
				service: "Notes API",
				version: "1.0.0",
				timestamp: currentDate.toISOString(),
			});
		});

		router.use("/api/v1", UserRoutesV1.routes);

		return router;
	}
}
