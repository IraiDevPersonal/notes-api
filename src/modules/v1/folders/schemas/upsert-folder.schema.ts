import { z } from "zod";

export const CreateFolderSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	parentId: z.string().optional(),
	order: z.number().int().min(0).optional(),
});

export const UpdateFolderSchema = CreateFolderSchema.partial();
