import type { Prisma } from "@prisma/client";
import { SHARED_USER_QUERY_SELECTOR } from "@/modules/v1/user/utils/query-selectors/shared-user.query-selector";

export const RESOURCE_FOLDER_QUERY_SELECTOR = {
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
