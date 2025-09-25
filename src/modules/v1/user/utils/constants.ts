import type { Prisma } from "@prisma/client";
import { FOLDER_SELECTOR } from "../../folders/utils/constants";
import { NOTE_SELECTOR } from "../../notes/utils/constants";

export const SHARED_USER_SELECTOR = {
	id: true,
	name: true,
	email: true,
	userName: true,
	lastName: true,
	// avatar: true,
} satisfies Prisma.UserSelect;

export const USER_RESOURCES_SELECTOR = {
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
