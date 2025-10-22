import type z from "zod";
import type {
	CreateFolderSchema,
	UpdateFolderSchema,
} from "../../utils/schemas/upsert-folder.schema";

export type CreateFolderPayload = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderPayload = z.infer<typeof UpdateFolderSchema>;
