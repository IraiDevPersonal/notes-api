import type { Prisma } from "@prisma/client";

export const LOGGED_USER_SELECTOR = {
	id: true,
	email: true,
	lastName: true,
	name: true,
	avatar: true,
	createdAt: true,
	_count: {
		select: {
			folders: true,
			notes: true,
			shareFolders: true,
			shareNotes: true,
		},
	},
} satisfies Prisma.UserSelect;
