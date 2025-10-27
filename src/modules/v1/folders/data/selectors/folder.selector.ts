import type { Prisma } from "@prisma/client";
import { NOTE_SELECTOR } from "@/modules/v1/notes/data/selectors/note.selector";
import { SHARED_USER_SELECTOR } from "@/modules/v1/user/data/selectors/shared-user.selector";

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
	shareFolders: {
		select: {
			user: { select: SHARED_USER_SELECTOR },
		},
		take: 3,
	},
	_count: {
		select: {
			comments: true,
			shareFolders: true,
		},
	},
	notes: {
		select: NOTE_SELECTOR,
	},
	children: {
		select: {
			id: true,
			name: true,
			order: true,
			updatedAt: true,
			createdAt: true,
		},
		orderBy: [{ order: "asc" }, { name: "asc" }],
	},
} satisfies Prisma.FolderSelect;
