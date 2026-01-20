import type {
	OwnUserResourcesDbModel,
	SharedUserResourcesDbModel,
	UserResourcesDbModel,
} from "../data/models/user-resources-db.model";

export abstract class UserRepository {
	abstract getUserResources(id: string): Promise<UserResourcesDbModel | null>;
	abstract getSharedUserResources(id: string): Promise<SharedUserResourcesDbModel | null>;
	abstract getOwnUserResources(id: string): Promise<OwnUserResourcesDbModel | null>;
	abstract getPinnedUserResources(id: string): Promise<UserResourcesDbModel | null>;
}
