import { DbClient } from "@/lib/db-client";
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
			console.log(error);
			throw new Error("Error to get user resources");
		}
	};
}
