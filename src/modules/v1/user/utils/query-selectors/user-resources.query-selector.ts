import type { Prisma } from "@prisma/client";
import { RESOURCE_FOLDER_QUERY_SELECTOR } from "@/modules/v1/folders/utils/query-selectors/resource-folder.query-selector";
import { NOTE_QUERY_SELECTOR } from "@/modules/v1/notes/utils/query-selectors/note.query-selector";

export const USER_RESOURCES_QUERY_SELECTOR = {
	folders: {
		select: RESOURCE_FOLDER_QUERY_SELECTOR,
	},
	notes: {
		select: NOTE_QUERY_SELECTOR,
		where: { deletedAt: null },
	},
	shareFolders: {
		select: {
			permission: true,
			folder: { select: RESOURCE_FOLDER_QUERY_SELECTOR },
		},
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_QUERY_SELECTOR },
		},
	},
} satisfies Prisma.UserSelect;
