import type { ErrorResult } from "@/types/global";

export class CustomError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "CustomError";
		this.statusCode = statusCode;
	}

	static notFound = (message: string = "Not found"): CustomError => {
		return new CustomError(message, 404);
	};

	static badRequest = (message: string = "Bad request"): CustomError => {
		return new CustomError(message, 400);
	};

	static internalServerError = (
		message: string = "Internal server error"
	): CustomError => {
		return new CustomError(message, 500);
	};

	static getErrorData(error: unknown, defaultMessage?: string): ErrorResult {
		if (error instanceof CustomError) {
			return { message: error.message, statusCode: error.statusCode };
		}

		if (error instanceof Error) {
			return { message: error.message, statusCode: 500 };
		}
		return { message: defaultMessage || "An unknown error occurred", statusCode: 500 };
	}
}
