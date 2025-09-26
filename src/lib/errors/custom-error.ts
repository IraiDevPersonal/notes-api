import type { ErrorResult } from "@/types/global";

export class CustomError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "CustomError";
		this.statusCode = statusCode;
	}

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
