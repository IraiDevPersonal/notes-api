import type { Prisma } from "@prisma/client";
import { RESOURCE_FOLDER_SELECTOR } from "@/modules/v1/folders/data/selectors/resource-folder.selector";
import { NOTE_SELECTOR } from "@/modules/v1/notes/data/selectors/note.selector";

export const USER_RESOURCES_SELECTOR = {
	folders: {
		select: RESOURCE_FOLDER_SELECTOR,
		where: { deletedAt: null },
	},
	notes: {
		select: NOTE_SELECTOR,
		where: { deletedAt: null },
	},
	shareFolders: {
		select: {
			permission: true,
			folder: { select: RESOURCE_FOLDER_SELECTOR },
		},
		where: { folder: { deletedAt: null } },
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_SELECTOR },
		},
		where: { note: { deletedAt: null } },
	},
} satisfies Prisma.UserSelect;

export const USER_PINNED_RESOURCES_SELECTOR = {
	folders: {
		select: RESOURCE_FOLDER_SELECTOR,
		where: { deletedAt: null, isPinned: true },
	},
	notes: {
		select: NOTE_SELECTOR,
		where: { deletedAt: null, isPinned: true },
	},
	shareFolders: {
		select: {
			permission: true,
			folder: { select: RESOURCE_FOLDER_SELECTOR },
		},
		where: {
			folder: {
				isPinned: true,
				deletedAt: null,
			},
		},
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_SELECTOR },
		},
		where: {
			note: {
				isPinned: true,
				deletedAt: null,
			},
		},
	},
} satisfies Prisma.UserSelect;

export const OWN_USER_RESOURCES_SELECTOR = {
	folders: {
		select: RESOURCE_FOLDER_SELECTOR,
		where: { deletedAt: null },
	},
	notes: {
		select: NOTE_SELECTOR,
		where: { deletedAt: null },
	},
} satisfies Prisma.UserSelect;

export const SHARED_USER_RESOURCES_SELECTOR = {
	shareFolders: {
		select: {
			permission: true,
			folder: { select: RESOURCE_FOLDER_SELECTOR },
		},
		where: { folder: { deletedAt: null } },
	},
	shareNotes: {
		select: {
			permission: true,
			note: { select: NOTE_SELECTOR },
		},
		where: { note: { deletedAt: null } },
	},
} satisfies Prisma.UserSelect;
