import { SchemaErrorHandler } from "@/lib/errors/schema-error-handler";
import type { ValidationResult } from "@/types/global";
import type {
	CreateNotePayload,
	UpdateNotePayload,
} from "../models/domain/upsert-note-payload.model";
import { CreateNoteSchema, UpdateNoteSchema } from "../models/schemas/upsert-note.schema";

export class UpsertNoteValidation {
	static validateUpdatePayload = (raw: unknown): ValidationResult<UpdateNotePayload> => {
		const { success, data, error } = UpdateNoteSchema.safeParse(raw);
		if (success) {
			return [null, data];
		}
		return [SchemaErrorHandler.safeParseErrorMessage(error), null];
	};

	static validateCreatePayload = (raw: unknown): ValidationResult<CreateNotePayload> => {
		const { success, data, error } = CreateNoteSchema.safeParse(raw);
		if (success) {
			return [null, data];
		}
		return [SchemaErrorHandler.safeParseErrorMessage(error), null];
	};
}
