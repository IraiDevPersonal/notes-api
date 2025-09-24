import type { Prisma } from "@prisma/client";

export const NOTE_USER_SELECTOR: Prisma.UserSelect = {
	id: true,
	name: true,
	email: true,
	avatar: true,
	userName: true,
	lastName: true,
};
