import type { Prisma } from "@prisma/client";
import type { USER_RESOURCE_SELECTOR } from "../../utils/constants";

export type DBUserResources = Prisma.UserGetPayload<{
	select: typeof USER_RESOURCE_SELECTOR;
}>;
