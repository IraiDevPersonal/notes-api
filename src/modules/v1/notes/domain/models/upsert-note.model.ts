import type z from "zod";
import type { CreateNoteSchema, UpdateNoteSchema } from "../schemas/upsert-note.schema";

export type CreateNoteModel = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteModel = z.infer<typeof UpdateNoteSchema>;
