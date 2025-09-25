import type { Prisma } from "@prisma/client";
import type { FOLDER_SELECTOR } from "../../utils/constants";

export type DbFolder = Prisma.FolderGetPayload<{
	select: typeof FOLDER_SELECTOR;
}>;
