import type { DBUserResources } from "./models/db/db-user-resources.model";

export abstract class UserRepository {
	abstract getUserResources(userId: string): Promise<DBUserResources | null>;
}
