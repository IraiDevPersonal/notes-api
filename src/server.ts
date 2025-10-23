import { createServer, type Server as HttpServer } from "node:http";
import cors from "cors";
import express, { type Express, type Router } from "express";
import helmet from "helmet";
import { ENVS } from "./lib/config";
import { logger } from "./lib/logger";

type ServerOptions = {
	port: number;
	routes: Router;
};

export class Server {
	private readonly httpServer: HttpServer;
	private serverListener?: HttpServer;
	private readonly routes: Router;
	private readonly port: number;
	public readonly app: Express;

	constructor({ port, routes }: ServerOptions) {
		const appInstance = express();
		const httpServerInstance = createServer(appInstance);

		this.httpServer = httpServerInstance;
		this.app = appInstance;
		this.routes = routes;
		this.port = port;
	}

	private getHelmetConfig() {
		return helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					connectSrc: ["'self'"],
				},
			},
		});
	}

	private getCorsConfig() {
		const isDevelopment = ENVS.NODE_ENV !== "production";

		if (isDevelopment) {
			return {
				origin: true,
				credentials: true,
				methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			};
		}

		const allowedOrigins = this.getAllowedOrigins();

		return {
			origin: allowedOrigins,
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		};
	}

	private getAllowedOrigins(): string[] {
		const origins: string[] = [];

		if (ENVS.ALLOWED_ORIGINS) {
			const additionalOrigins = ENVS.ALLOWED_ORIGINS.map((origin) =>
				origin.trim()
			).filter((origin) => origin.length > 0);

			origins.push(...additionalOrigins);
		}

		logger.info(`Allowed WebSocket origins: ${origins.join(", ")}`);
		return origins;
	}

	async start() {
		//* Middlewares generales
		this.app.use(this.getHelmetConfig());
		this.app.use(cors(this.getCorsConfig()));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

		//* Rutas de la aplicacion
		this.app.use(this.routes);

		this.serverListener = this.httpServer.listen(this.port, () => {
			logger.info(`Server running on port: ${this.port}`);
		});
	}

	close() {
		this.serverListener?.close();
	}
}
