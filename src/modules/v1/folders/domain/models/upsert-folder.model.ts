import type z from "zod";
import type {
	CreateFolderSchema,
	UpdateFolderSchema,
} from "../schemas/upsert-folder.schema";

export type CreateFolderModel = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderModel = z.infer<typeof UpdateFolderSchema>;
