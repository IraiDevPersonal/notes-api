import type { Request, Response } from "express";
import { ResponseController } from "@/lib/controllers/response.controller";
import type { HttpClient } from "@/lib/http-client";
import { GetMetadataByUrlUseCase } from "../application/use-cases/get-metadata-by-url.use-case";

export class UtilitiesController {
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
			responseController.errorHandler(error, {
				source: "UtilitiesController/getMetadataByUrl",
				defaultMessage: "Failed to get metadata by URL",
			});
		}
	};
}
