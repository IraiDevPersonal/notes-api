import type { Prisma } from "@prisma/client";
import { SHARED_USER_QUERY_SELECTOR } from "../../../user/utils/query-selectors/shared-user.query-selector";

export const NOTE_QUERY_SELECTOR = {
	id: true,
	title: true,
	order: true,
	content: true,
	folderId: true,
	createdAt: true,
	updatedAt: true,
	owner: {
		select: SHARED_USER_QUERY_SELECTOR,
	},
	lastModifiedBy: {
		select: SHARED_USER_QUERY_SELECTOR,
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
	shareNotes: {
		select: {
			user: { select: SHARED_USER_QUERY_SELECTOR },
		},
	},
} satisfies Prisma.NoteSelect;
