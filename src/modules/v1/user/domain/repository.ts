import type { UserResourcesDbModel } from "../data/models/user-resources-db.model";

export abstract class UserRepository {
	abstract getUserResources(id: string): Promise<UserResourcesDbModel | null>;
}
