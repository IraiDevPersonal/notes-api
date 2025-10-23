import type { Prisma } from "@prisma/client";
import { RESOURCE_FOLDER_SELECTOR } from "@/modules/v1/folders/data/selectors/resource-folder.selector";
import { NOTE_SELECTOR } from "@/modules/v1/notes/data/selectors/note.selector";

export const USER_RESOURCES_SELECTOR = {
	folders: {
		select: RESOURCE_FOLDER_SELECTOR,
	},
	notes: {
		select: NOTE_SELECTOR,
		where: { deletedAt: null },
	},
	shareFolders: {
		select: {
			permission: true,
			folder: { select: RESOURCE_FOLDER_SELECTOR },
		},
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_SELECTOR },
		},
	},
} satisfies Prisma.UserSelect;
