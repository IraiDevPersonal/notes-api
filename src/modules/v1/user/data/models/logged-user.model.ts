import type { Prisma } from "@prisma/client";
import type { LOGGED_USER_SELECTOR } from "../selectors/logger-user.selector";

export type LoggedUserDbModel = Prisma.UserGetPayload<{
	select: typeof LOGGED_USER_SELECTOR;
}>;
