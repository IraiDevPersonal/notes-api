import { Prisma } from "@prisma/client";
import type { ErrorResult } from "@/types/global";

export class DBErrorHandler {
	static getErrorData(error: unknown, defaultErrorMessage?: string): ErrorResult {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					return { message: "Record not found", statusCode: 404 };
				default:
					return { message: error.message, statusCode: 500 };
			}
		}
		return { message: defaultErrorMessage || "Internal server error", statusCode: 500 };
	}
}
