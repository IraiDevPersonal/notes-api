import type { UserResourcesDbModel } from "../models/db/user-resources.db.model";

export abstract class UserRepository {
	abstract getUserResources(userId: string): Promise<UserResourcesDbModel | null>;
}
