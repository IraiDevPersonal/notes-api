import type z from "zod";
import type { FolderSharedUsersSchema } from "../../schemas/folder-shared-users.schema";

export type FolderSharedUsersDomainModel = z.infer<typeof FolderSharedUsersSchema>;
