import type { Prisma } from "@prisma/client";
import { RESOURCE_USER_SELECTOR } from "@/modules/v1/user/utils/constants";

export const NOTE_SELECTOR = {
	id: true,
	title: true,
	order: true,
	content: true,
	folderId: true,
	createdAt: true,
	updatedAt: true,
	lastModifiedBy: {
		select: RESOURCE_USER_SELECTOR,
	},
	owner: {
		select: RESOURCE_USER_SELECTOR,
	},
	comments: {
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			updatedAt: true,
		},
	},
	tags: {
		select: {
			tag: {
				select: {
					id: true,
					name: true,
					color: true,
				},
			},
		},
	},
} satisfies Prisma.NoteSelect;
