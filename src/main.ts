import { AppRouter } from "./app-router";
import { ENVS } from "./lib/config";
import { Server } from "./server";

(() => {
	const server = new Server({
		port: ENVS.PORT,
		routes: AppRouter.routes,
	});

	server.start();
})();
