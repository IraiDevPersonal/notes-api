import type z from "zod";

export class SchemaErrorHandler {
	static safeParseErrorMessage(error: z.ZodError) {
		const issueMessages = error.issues
			.map(
				(issue) => `field [${issue.path.join(".")}] ${issue.message.toLocaleLowerCase()}`
			)
			.join(", ");

		return issueMessages;
	}
}
