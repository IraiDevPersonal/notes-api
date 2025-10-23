import { AppRoutes } from "./app.routes";
import { ENVS } from "./lib/config";
import { Server } from "./server";

(() => {
	const server = new Server({
		port: ENVS.PORT,
		routes: AppRoutes.routes,
	});

	server.start();
})();
