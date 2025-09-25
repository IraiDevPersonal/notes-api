import type { Prisma } from "@prisma/client";
import { SHARED_USER_SELECTOR } from "../../user/utils/constants";

export const FOLDER_SELECTOR = {
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
	comments: {
		select: {
			id: true,
			title: true,
			createdAt: true,
			updatedAt: true,
			description: true,
		},
	},
	shareFolders: {
		select: {
			user: { select: SHARED_USER_SELECTOR },
		},
	},
} satisfies Prisma.FolderSelect;
