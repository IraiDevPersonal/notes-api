import { DbClient } from "@/lib/db-client";
import { CustomError } from "@/lib/errors/custom-error";
import type { DBUserResources } from "../models/db/db-user-resources.model";
import { USER_RESOURCES_QUERY_SELECTOR } from "../utils/query-selectors/user-resources.query-selector";
import type { UserRepository } from "./user.repository";

export class UserRepositoryImpl extends DbClient implements UserRepository {
	private readonly userResourcesSelector = USER_RESOURCES_QUERY_SELECTOR;

	getUserResources = async (userId: string): Promise<DBUserResources | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id: userId },
				select: { ...this.userResourcesSelector },
			});
		} catch (error) {
			const { message, statusCode } = CustomError.getErrorData(
				error,
				"Error to get user resources"
			);
			throw new CustomError(message, statusCode);
		}
	};
}
