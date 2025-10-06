import { Prisma } from "@prisma/client";
import type { ParseError } from "@/types/global";
import { HttpError } from "./http-error";

export class DatabaseErrorhandler {
	static parseError(
		error: unknown,
		defaultErrorMessage: string = "Database is not connected"
	): ParseError {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					return { message: "Record not found", statusCode: 404 };
				default:
					return { message: error.message, statusCode: 500 };
			}
		}
		return {
			message: defaultErrorMessage,
			statusCode: 500,
		};
	}

	/**
	 * Convierte errores de Prisma a HttpError con códigos de estado apropiados
	 */
	static toHttpError(error: unknown, defaultMessage?: string): HttpError {
		// Error conocido de Prisma
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return this.handleKnownError(error);
		}

		// Error de validación de Prisma
		if (error instanceof Prisma.PrismaClientValidationError) {
			return HttpError.badRequest("Invalid data provided");
		}

		// Error de inicialización de Prisma
		if (error instanceof Prisma.PrismaClientInitializationError) {
			return HttpError.internalServerError(
				defaultMessage || "Database connection failed"
			);
		}

		// Error desconocido
		return HttpError.internalServerError(
			defaultMessage || "An unexpected database error occurred"
		);
	}

	/**
	 * Maneja errores conocidos de Prisma según su código
	 */
	private static handleKnownError(
		error: Prisma.PrismaClientKnownRequestError
	): HttpError {
		switch (error.code) {
			case "P2000":
				return HttpError.badRequest("Value too long for column");

			case "P2001":
			case "P2018":
			case "P2025":
				return HttpError.notFound("Record not found");

			case "P2002":
				return HttpError.badRequest(`Duplicate value for ${this.getFieldName(error)}`);

			case "P2003":
				return HttpError.badRequest("Foreign key constraint failed");

			case "P2014":
				return HttpError.badRequest("Related record is required");

			case "P2015":
				return HttpError.notFound("Related record not found");

			default:
				return HttpError.internalServerError(
					error.message || "Database operation failed"
				);
		}
	}

	/**
	 * Extrae el nombre del campo del error de Prisma
	 */
	private static getFieldName(error: Prisma.PrismaClientKnownRequestError): string {
		if (error.meta && typeof error.meta === "object" && "target" in error.meta) {
			const target = error.meta.target;
			return Array.isArray(target) ? target.join(", ") : String(target);
		}
		return "field";
	}
}
