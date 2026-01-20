import type { Prisma } from "@prisma/client";
import { SHARED_USER_SELECTOR } from "@/modules/v1/user/data/selectors/shared-user.selector";

export const RESOURCE_FOLDER_SELECTOR = {
	id: true,
	name: true,
	order: true,
	parentId: true,
	updatedAt: true,
	createdAt: true,
	description: true,
	isPinned: true,
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
