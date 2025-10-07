import z from "zod";
import { HttpError } from "./http-error";

export class ZodErrorHandler {
	/**
	 * Formatea los errores de validación de Zod en un mensaje legible
	 */
	static formatErrorMessage(error: z.ZodError): string {
		const issueMessages = error.issues
			.map((issue) => {
				const path = issue.path.length > 0 ? issue.path.join(".") : "root";
				const message = issue.message.toLowerCase();
				return `Field '${path}' ${message}`;
			})
			.join("; ");

		return issueMessages;
	}

	/**
	 * Convierte un error de Zod a HttpError
	 */
	static toHttpError(error: z.ZodError): HttpError {
		const message = this.formatErrorMessage(error);
		return HttpError.badRequest(message);
	}

	/**
	 * Verifica si un error es un ZodError
	 */
	static isZodError(error: unknown): error is z.ZodError {
		return error instanceof z.ZodError;
	}

	/**
	 * Formatea los errores de manera estructurada (útil para APIs)
	 */
	static formatStructured(error: z.ZodError) {
		return error.issues.map((issue) => ({
			field: issue.path.join(".") || "root",
			message: issue.message,
			code: issue.code,
		}));
	}
}
