import type { Prisma } from "@prisma/client";
import type { SHARED_USER_QUERY_SELECTOR } from "../../utils/query-selectors/shared-user.query-selector";

export type DbSharedUser = Prisma.UserGetPayload<{
	select: typeof SHARED_USER_QUERY_SELECTOR;
}>;
