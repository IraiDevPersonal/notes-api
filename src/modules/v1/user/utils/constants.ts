import type { Prisma } from "@prisma/client";

export const RESOURCE_USER_SELECTOR = {
	id: true,
	name: true,
	email: true,
	// avatar: true,
	userName: true,
	lastName: true,
} satisfies Prisma.UserSelect;

export const FOLDER_SELECTOR = {
	id: true,
	name: true,
	order: true,
	parentId: true,
	updatedAt: true,
	createdAt: true,
	description: true,
	owner: {
		select: RESOURCE_USER_SELECTOR,
	},
	lastModifiedBy: {
		select: RESOURCE_USER_SELECTOR,
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
			user: { select: RESOURCE_USER_SELECTOR },
		},
	},
} satisfies Prisma.FolderSelect;

export const NOTE_SELECTOR = {
	id: true,
	title: true,
	order: true,
	content: true,
	folderId: true,
	createdAt: true,
	updatedAt: true,
	owner: {
		select: RESOURCE_USER_SELECTOR,
	},
	lastModifiedBy: {
		select: RESOURCE_USER_SELECTOR,
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
	shareNotes: {
		select: {
			user: { select: RESOURCE_USER_SELECTOR },
		},
	},
} satisfies Prisma.NoteSelect;

export const USER_RESOURCE_SELECTOR = {
	folders: {
		select: FOLDER_SELECTOR,
	},
	notes: {
		select: NOTE_SELECTOR,
	},
	shareFolders: {
		select: {
			permission: true,
			folder: { select: FOLDER_SELECTOR },
		},
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_SELECTOR },
		},
	},
} satisfies Prisma.UserSelect;
