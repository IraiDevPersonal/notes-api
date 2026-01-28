import type { Prisma } from "@prisma/client";
import type {
	OWN_USER_RESOURCES_SELECTOR,
	SHARED_USER_RESOURCES_SELECTOR,
	USER_PINNED_RESOURCES_SELECTOR,
	USER_RESOURCES_SELECTOR,
} from "../selectors/user-resources.selector";

export type UserResourcesDbModel = Prisma.UserGetPayload<{
	select: typeof USER_RESOURCES_SELECTOR;
}>;

export type OwnUserResourcesDbModel = Prisma.UserGetPayload<{
	select: typeof OWN_USER_RESOURCES_SELECTOR;
}>;

export type SharedUserResourcesDbModel = Prisma.UserGetPayload<{
	select: typeof SHARED_USER_RESOURCES_SELECTOR;
}>;

export type PinnedUserResourcesDbModel = Prisma.UserGetPayload<{
	select: typeof USER_PINNED_RESOURCES_SELECTOR;
}>;
