import { z } from "zod";

export const CreateNoteSchema = z.object({
	title: z.string(),
	content: z.string(),
	folderId: z.string().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();
