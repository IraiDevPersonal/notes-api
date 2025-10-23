import type { Prisma } from "@prisma/client";
import type { USER_RESOURCES_SELECTOR } from "../selectors/user-resources.selector";

export type UserResourcesDbModel = Prisma.UserGetPayload<{
	select: typeof USER_RESOURCES_SELECTOR;
}>;
