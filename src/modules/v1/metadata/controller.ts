import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import { HttpError } from "@/lib/errors/http-error";
import type { HttpClient } from "@/lib/http-client";
import { logger } from "@/lib/logger";
import { GetMetadataByUrlUseCase } from "./use-cases/get-metadata-by-url.use-case";

export class MetadataController {
	private readonly getMetadataByUrlUseCase: GetMetadataByUrlUseCase;

	constructor(httpClient: HttpClient) {
		this.getMetadataByUrlUseCase = new GetMetadataByUrlUseCase(httpClient);
	}

	getMetadataByUrl = async (req: Request, res: Response) => {
		const url = req.query.url as string;
		const responseController = new ResponseController(res);

		try {
			const metadata = await this.getMetadataByUrlUseCase.execute(url);
			responseController.json({ data: metadata }, 200);
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Failed to get metadata by URL"
			);
			logger.error({
				source: "MetadataController/getMetadataByUrl",
				message,
				error,
			});
			responseController.error(message, statusCode);
		}
	};
}
