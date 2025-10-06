import { Router } from "express";
import { FoldersRoutesV1 } from "./modules/v1/folders/routes";
import { NotesRoutesV1 } from "./modules/v1/notes/routes";
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
		router.use("/api/v1", NotesRoutesV1.routes);
		router.use("/api/v1", FoldersRoutesV1.routes);

		return router;
	}
}
