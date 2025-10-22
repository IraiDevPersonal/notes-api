import type z from "zod";
import type {
	CreateNoteSchema,
	UpdateNoteSchema,
} from "../../utils/schemas/upsert-note.schema";

export type CreateNotePayload = z.infer<typeof CreateNoteSchema>;
export type UpdateNotePayload = z.infer<typeof UpdateNoteSchema>;
