import { DbClient } from "@/lib/db-client";
import { logger } from "@/lib/logger";
import type { DBUserResources } from "./models/db/db-user-resources.model";
import type { UserRepository } from "./repository";
import { USER_RESOURCES_QUERY_SELECTOR } from "./utils/query-selectors/user-resources.query-selector";

export class UserService extends DbClient implements UserRepository {
	private readonly userResourceSelector = USER_RESOURCES_QUERY_SELECTOR;

	getUserResources = async (userId: string): Promise<DBUserResources | null> => {
		try {
			return await this.db.user.findFirst({
				where: { id: userId },
				select: { ...this.userResourceSelector },
			});
		} catch (error) {
			const errorMessage = "Error to get user resources";
			logger.error({
				message: errorMessage,
				source: "UserService/getUserResources",
				error,
			});
			throw new Error(errorMessage);
		}
	};
}
