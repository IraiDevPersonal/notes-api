import type { Prisma } from "@prisma/client";
import type { USER_RESOURCES_QUERY_SELECTOR } from "../../utils/query-selectors/user-resources.query-selector";

export type DBUserResources = Prisma.UserGetPayload<{
	select: typeof USER_RESOURCES_QUERY_SELECTOR;
}>;
