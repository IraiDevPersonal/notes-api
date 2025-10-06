import { DatabaseClient } from "@/lib/database-client";
import { HttpError } from "@/lib/errors/http-error";
import type { DBUserResources } from "../models/db/db-user-resources.model";
import { USER_RESOURCES_QUERY_SELECTOR } from "../utils/query-selectors/user-resources.query-selector";
import type { UserRepository } from "./user.repository";

export class UserRepositoryImpl extends DatabaseClient implements UserRepository {
	private readonly userResourcesSelector = USER_RESOURCES_QUERY_SELECTOR;

	getUserResources = async (userId: string): Promise<DBUserResources | null> => {
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
