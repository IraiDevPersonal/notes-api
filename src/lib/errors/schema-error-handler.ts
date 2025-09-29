import z from "zod";

export class SchemaErrorHandler {
	static getErrorMessage(error: z.ZodError) {
		const issueMessages = error.issues
			.map(
				(issue) => `field [${issue.path.join(".")}] ${issue.message.toLocaleLowerCase()}`
			)
			.join(", ");

		return issueMessages;
	}

	static isSchemaError(error: unknown): error is z.ZodError {
		return error instanceof z.ZodError;
	}
}
