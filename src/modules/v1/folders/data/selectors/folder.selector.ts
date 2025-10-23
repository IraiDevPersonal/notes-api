import type { Prisma } from "@prisma/client";
import { NOTE_SELECTOR } from "@/modules/v1/notes/data/selectors/note.selector";
import { SHARED_USER_SELECTOR } from "@/modules/v1/user/data/selectors/shared-user.selector";

const BASE_FOLDER_SELECTOR = {
	id: true,
	name: true,
	order: true,
	parentId: true,
	updatedAt: true,
	createdAt: true,
	description: true,
	owner: {
		select: SHARED_USER_SELECTOR,
	},
	lastModifiedBy: {
		select: SHARED_USER_SELECTOR,
	},
	shareFolders: {
		select: {
			user: { select: SHARED_USER_SELECTOR },
		},
	},
} satisfies Prisma.FolderSelect;

export const FOLDER_SELECTOR = {
	...BASE_FOLDER_SELECTOR,
	notes: {
		select: NOTE_SELECTOR,
	},
	children: {
		select: BASE_FOLDER_SELECTOR,
	},
} satisfies Prisma.FolderSelect;
