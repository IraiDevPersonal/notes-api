import type { Prisma } from "@prisma/client";
import { NOTE_QUERY_SELECTOR } from "@/modules/v1/notes/utils/query-selectors/note.query-selector";
import { SHARED_USER_QUERY_SELECTOR } from "@/modules/v1/user/utils/query-selectors/shared-user.query-selector";

const BASE_FOLDER_QUERY_SELECTOR = {
	id: true,
	name: true,
	order: true,
	parentId: true,
	updatedAt: true,
	createdAt: true,
	description: true,
	owner: {
		select: SHARED_USER_QUERY_SELECTOR,
	},
	lastModifiedBy: {
		select: SHARED_USER_QUERY_SELECTOR,
	},
	shareFolders: {
		select: {
			user: { select: SHARED_USER_QUERY_SELECTOR },
		},
	},
} satisfies Prisma.FolderSelect;

export const FOLDER_QUERY_SELECTOR = {
	...BASE_FOLDER_QUERY_SELECTOR,
	notes: {
		select: NOTE_QUERY_SELECTOR,
	},
	children: {
		select: BASE_FOLDER_QUERY_SELECTOR,
	},
} satisfies Prisma.FolderSelect;
