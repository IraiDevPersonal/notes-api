import type { Prisma } from "@prisma/client";

export const NOTE_SELECTOR: Prisma.NoteSelect = {
	id: true,
	title: true,
	order: true,
	content: true,
	folderId: true,
	createdAt: true,
	updatedAt: true,
	lastModifiedBy: {
		select: {
			name: true,
			email: true,
			avatar: true,
			userName: true,
			lastName: true,
		},
	},
	owner: {
		select: {
			name: true,
			email: true,
			avatar: true,
			userName: true,
			lastName: true,
		},
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
};
