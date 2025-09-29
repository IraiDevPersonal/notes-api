import type { Prisma } from "@prisma/client";
import type { RESOURCE_FOLDER_QUERY_SELECTOR } from "../../utils/query-selectors/resource-folder.query-selector";

export type ResourceFolderDbModel = Prisma.FolderGetPayload<{
	select: typeof RESOURCE_FOLDER_QUERY_SELECTOR;
}>;
