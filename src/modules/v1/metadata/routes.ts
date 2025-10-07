import { Router } from "express";
import { HttpClient } from "@/lib/http-client";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { MetadataController } from "./controller";
import { MetadataQuerySchema } from "./schema/metadata-query.schema";

const validateRequest = ValidationMiddleware.validateRequest;

const httpClient = new HttpClient({
	options: {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; MetadataBot/1.0)",
		},
	},
});

export class MetadataRoutesV1 {
	private static readonly controller = new MetadataController(httpClient);

	static get routes(): Router {
		const router = Router();

		router.get(
			"/metadata",
			validateRequest({ query: MetadataQuerySchema }),
			this.controller.getMetadataByUrl
		);

		return router;
	}
}
