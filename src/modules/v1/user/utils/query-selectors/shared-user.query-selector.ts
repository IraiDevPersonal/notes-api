import type { Prisma } from "@prisma/client";

export const SHARED_USER_QUERY_SELECTOR = {
	id: true,
	name: true,
	email: true,
	userName: true,
	lastName: true,
	// avatar: true,
} satisfies Prisma.UserSelect;
