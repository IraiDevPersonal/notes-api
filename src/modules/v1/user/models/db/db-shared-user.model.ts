import type { Prisma } from "@prisma/client";
import type { RESOURCE_USER_SELECTOR } from "../../utils/constants";

export type DbSharedUser = Prisma.UserGetPayload<{
	select: typeof RESOURCE_USER_SELECTOR;
}>;
