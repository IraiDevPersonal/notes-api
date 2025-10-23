import { DatabaseClient } from "@/lib/database-client";
import { HttpError } from "@/lib/errors/http-error";
import type { UserRepository } from "../domain/repository";
import type { UserResourcesDbModel } from "./models/user-resources-db.model";
import { USER_RESOURCES_SELECTOR } from "./selectors/user-resources.selector";

export class UserRepositoryImpl extends DatabaseClient implements UserRepository {
	private readonly userResourcesSelector = USER_RESOURCES_SELECTOR;

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
}
