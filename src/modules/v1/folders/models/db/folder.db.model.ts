import type { Prisma } from "@prisma/client";
import type { FOLDER_QUERY_SELECTOR } from "../../utils/query-selectors/folder.query-selector";

export type FolderDbModel = Prisma.FolderGetPayload<{
	select: typeof FOLDER_QUERY_SELECTOR;
}>;
