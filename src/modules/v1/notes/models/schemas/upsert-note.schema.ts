import { z } from "zod";

export const CreateNoteSchema = z.object({
	title: z.string(),
	content: z.string(),
	folderId: z.string().optional(),
	comments: z
		.object({
			description: z.string(),
			title: z.string(),
		})
		.array()
		.optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.omit({
	comments: true,
}).partial();
