import type { Prisma } from "@prisma/client";
import type { USER_RESOURCES_SELECTOR } from "../../utils/constants";

export type DBUserResources = Prisma.UserGetPayload<{
	select: typeof USER_RESOURCES_SELECTOR;
}>;
