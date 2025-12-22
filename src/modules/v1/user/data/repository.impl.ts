import { DatabaseClient } from "@/lib/database-client";
import { HttpError } from "@/lib/errors/http-error";
import type { UserRepository } from "../domain/repository";
import type {
	OwnUserResourcesDbModel,
	SharedUserResourcesDbModel,
	UserResourcesDbModel,
} from "./models/user-resources-db.model";
import {
	OWN_USER_RESOURCES_SELECTOR,
	SHARED_USER_RESOURCES_SELECTOR,
	USER_RESOURCES_SELECTOR,
} from "./selectors/user-resources.selector";

export class UserRepositoryImpl extends DatabaseClient implements UserRepository {
	private readonly userResourcesSelector = USER_RESOURCES_SELECTOR;
	private readonly sharedUserResourcesSelector = SHARED_USER_RESOURCES_SELECTOR;
	private readonly ownUserResourcesSelector = OWN_USER_RESOURCES_SELECTOR;

	getUserResources = async (userId: string): Promise<UserResourcesDbModel | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id: userId },
				select: { ...this.userResourcesSelector },
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getSharedUserResources = async (
		userId: string
	): Promise<SharedUserResourcesDbModel | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id: userId },
				select: { ...this.sharedUserResourcesSelector },
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getOwnUserResources = async (
		userId: string
	): Promise<OwnUserResourcesDbModel | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id: userId },
				select: { ...this.ownUserResourcesSelector },
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};
}
