import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import { ResponseController } from "../controllers/response.controller";
import { ZodErrorHandler } from "../errors/zod-error-handler";
import { logger } from "../logger";

export class ValidationMiddleware {
	static validateRequest = (schemas: {
		body?: z.ZodSchema;
		params?: z.ZodSchema;
		query?: z.ZodSchema;
	}) => {
		return (req: Request, res: Response, next: NextFunction): void => {
			try {
				if (schemas.body) {
					req.body = schemas.body.parse(req.body);
				}

				if (schemas.params) {
					schemas.params.parse(req.params);
				}

				if (schemas.query) {
					schemas.query.parse(req.query);
				}

				next();
			} catch (error) {
				const responseController = new ResponseController(res);

				if (ZodErrorHandler.isZodError(error)) {
					const errorMessage = ZodErrorHandler.formatErrorMessage(error);
					logger.error({
						source: "ValidationMiddleware/validateRequest",
						message: errorMessage,
						error,
					});
					responseController.error(errorMessage, 400);
					return;
				}

				next(error);
			}
		};
	};
}
