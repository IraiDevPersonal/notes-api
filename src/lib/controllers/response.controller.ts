import type { Response } from "express";
import { HttpError } from "../errors/http-error";
import { logger } from "../logger";

export class ResponseController {
	private readonly response: Response;

	constructor(response: Response) {
		this.response = response;
	}

	json<T extends object>(data: T, statusCode: number = 200) {
		this.response.status(statusCode).json(data);
	}

	noContent() {
		this.response.status(204).json({});
	}

	error(message: string, statusCode: number) {
		this.response.status(statusCode).json({ error: message });
	}

	errorHandler(error: unknown, options?: { source?: string; defaultMessage?: string }) {
		const { message, statusCode } = HttpError.parseError(error, options?.defaultMessage);
		logger.error({
			source: options?.source,
			message,
			error,
		});
		this.error(message, statusCode);
	}
}
