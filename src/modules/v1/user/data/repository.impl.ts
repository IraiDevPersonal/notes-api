import { DatabaseClient } from "@/lib/database-client";
import { HttpError } from "@/lib/errors/http-error";
import type { ResoruceQueryModel } from "../domain/models/resource-query.model";
import type { UserRepository } from "../domain/repository";
import type { LoggedUserDbModel } from "./models/logged-user.model";
import type {
	OwnUserResourcesDbModel,
	PinnedUserResourcesDbModel,
	SharedUserResourcesDbModel,
	UserResourcesDbModel,
} from "./models/user-resources-db.model";
import { LOGGED_USER_SELECTOR } from "./selectors/logger-user.selector";
import {
	OWN_USER_RESOURCES_SELECTOR,
	SHARED_USER_RESOURCES_SELECTOR,
	USER_PINNED_RESOURCES_SELECTOR,
	USER_RESOURCES_SELECTOR,
} from "./selectors/user-resources.selector";

export class UserRepositoryImpl extends DatabaseClient implements UserRepository {
	private readonly loggedUserSelector = LOGGED_USER_SELECTOR;
	private readonly userResourcesSelector = USER_RESOURCES_SELECTOR;
	private readonly userPinnedResourcesSelector = USER_PINNED_RESOURCES_SELECTOR;
	private readonly sharedUserResourcesSelector = SHARED_USER_RESOURCES_SELECTOR;
	private readonly ownUserResourcesSelector = OWN_USER_RESOURCES_SELECTOR;

	getLoggedUser = async (id: string): Promise<LoggedUserDbModel | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id },
				select: { ...this.loggedUserSelector },
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get logged user"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getUserResources = async (
		userId: string,
		query?: ResoruceQueryModel
	): Promise<UserResourcesDbModel | null> => {
		try {
			return await this.db.user.findUnique({
				where: { id: userId },
				select: this.userResourcesSelector(query),
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getPinnedUserResources = async (
		userId: string,
		query?: ResoruceQueryModel
	): Promise<PinnedUserResourcesDbModel | null> => {
		try {
			return await this.db.user.findUnique({
				where: {
					id: userId,
					// OR: [
					// 	{ notes: { some: { isPinned: true, deletedAt: null } } },
					// 	{ folders: { some: { isPinned: true, deletedAt: null } } },
					// 	{ shareFolders: { some: { folder: { isPinned: true, deletedAt: null } } } },
					// 	{ shareNotes: { some: { note: { isPinned: true, deletedAt: null } } } },
					// ],
				},
				select: this.userPinnedResourcesSelector(query),
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get pinned user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getSharedUserResources = async (
		userId: string,
		query?: ResoruceQueryModel
	): Promise<SharedUserResourcesDbModel | null> => {
		try {
			return await this.db.user.findUnique({
				where: { id: userId },
				select: this.sharedUserResourcesSelector(query),
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get shared user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};

	getOwnUserResources = async (
		userId: string,
		query?: ResoruceQueryModel
	): Promise<OwnUserResourcesDbModel | null> => {
		try {
			return await this.db.user.findUnique({
				where: { id: userId },
				select: this.ownUserResourcesSelector(query),
			});
		} catch (error) {
			const { message, statusCode } = HttpError.parseError(
				error,
				"Error to get own user resources"
			);
			throw new HttpError(message, statusCode);
		}
	};
}
