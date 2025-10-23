import type { Prisma } from "@prisma/client";
import type { SHARED_USER_SELECTOR } from "../selectors/shared-user.selector";

export type SharedUserDbModel = Prisma.UserGetPayload<{
	select: typeof SHARED_USER_SELECTOR;
}>;
