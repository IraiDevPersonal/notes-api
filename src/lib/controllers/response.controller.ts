import type { Response } from "express";

export class ResponseController {
	private readonly response: Response;

	constructor(response: Response) {
		this.response = response;
	}

	json<T extends object>(data: T, statusCode: number = 200) {
		this.response.status(statusCode).json(data);
	}

	error(message: string, statusCode: number) {
		this.response.status(statusCode).json({ error: message });
	}
}
