import type { Prisma } from "@prisma/client";
import type { FOLDER_SELECTOR } from "../selectors/folder.selector";

export type FolderDbModel = Prisma.FolderGetPayload<{
	select: typeof FOLDER_SELECTOR;
}>;
