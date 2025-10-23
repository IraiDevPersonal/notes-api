import type { Prisma } from "@prisma/client";
import type { RESOURCE_FOLDER_SELECTOR } from "../selectors/resource-folder.selector";

export type ResourceFolderDbModel = Prisma.FolderGetPayload<{
	select: typeof RESOURCE_FOLDER_SELECTOR;
}>;
