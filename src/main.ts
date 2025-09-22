import { ENVS } from "./lib/config";
import { Server } from "./server";
import { AppRouter } from "./app-router";

(() => {
  const server = new Server({
    port: ENVS.PORT,
    routes: AppRouter.routes
  });

  server.start();
})();
