import type { Prisma } from "@prisma/client";
import type { SHARED_USER_SELECTOR } from "../../utils/constants";

export type DbSharedUser = Prisma.UserGetPayload<{
	select: typeof SHARED_USER_SELECTOR;
}>;
