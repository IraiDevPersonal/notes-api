import type { Prisma } from "@prisma/client";
import { SHARED_USER_SELECTOR } from "../../../user/data/selectors/shared-user.selector";

export const NOTE_SELECTOR = {
	id: true,
	title: true,
	order: true,
	content: true,
	folderId: true,
	createdAt: true,
	updatedAt: true,
	owner: {
		select: SHARED_USER_SELECTOR,
	},
	lastModifiedBy: {
		select: SHARED_USER_SELECTOR,
	},
	_count: {
		select: {
			comments: true,
		},
	},
	shareNotes: {
		select: {
			user: { select: SHARED_USER_SELECTOR },
		},
	},
} satisfies Prisma.NoteSelect;
