import type { Prisma } from "@prisma/client";
import { NOTE_QUERY_SELECTOR } from "@/modules/v1/notes/utils/query-selectors/note.query-selector";
import { RESOURCE_FOLDER_QUERY_SELECTOR } from "./resource-folder.query-selector";

export const FOLDER_QUERY_SELECTOR = {
	...RESOURCE_FOLDER_QUERY_SELECTOR,
	notes: {
		select: {
			...NOTE_QUERY_SELECTOR,
		},
	},
} satisfies Prisma.FolderSelect;
