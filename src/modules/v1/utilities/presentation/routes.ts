import { Router } from "express";
import { HttpClient } from "@/lib/http-client";
import { ValidationMiddleware } from "@/lib/middlewares/validation.middleware";
import { MetadataQuerySchema } from "../domain/schemas/metadata-query.schema";
import { UtilitiesController } from "./controller";

const validateRequest = ValidationMiddleware.validateRequest;

const httpClient = new HttpClient({
	options: {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; MetadataBot/1.0)",
		},
	},
});

export class UtilitiesRoutesV1 {
	private static readonly controller = new UtilitiesController(httpClient);

	static get routes(): Router {
		const router = Router();

		router.get(
			"/utilities/metadata",
			validateRequest({ query: MetadataQuerySchema }),
			this.controller.getMetadataByUrl
		);

		return router;
	}
}
