import type { ParseError } from "@/types/global";

export class HttpError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;

		Object.setPrototypeOf(this, HttpError.prototype);
	}

	static notFound = (message: string = "Not found"): HttpError => {
		return new HttpError(message, 404);
	};

	static badRequest = (message: string = "Bad request"): HttpError => {
		return new HttpError(message, 400);
	};

	static unauthorized(message: string = "Unauthorized"): HttpError {
		return new HttpError(message, 401);
	}

	static internalServerError = (message: string = "Internal server error"): HttpError => {
		return new HttpError(message, 500);
	};

	static parseError(
		error: unknown,
		defaultMessage: string = "An unknown error occurred"
	): ParseError {
		if (error instanceof HttpError) {
			return { message: error.message, statusCode: error.statusCode };
		}

		if (error instanceof Error) {
			return { message: error.message, statusCode: 500 };
		}
		return { message: defaultMessage, statusCode: 500 };
	}
}
