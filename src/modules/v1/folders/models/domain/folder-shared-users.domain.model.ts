import type z from "zod";
import type { FolderSharedUsersSchema } from "../../utils/schemas/folder-shared-users.schema";

export type FolderSharedUsersDomainModel = z.infer<typeof FolderSharedUsersSchema>;
