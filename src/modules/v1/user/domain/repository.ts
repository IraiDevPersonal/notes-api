import type { LoggedUserDbModel } from "../data/models/logged-user.model";
import type {
	OwnUserResourcesDbModel,
	SharedUserResourcesDbModel,
	UserResourcesDbModel,
} from "../data/models/user-resources-db.model";
import type { ResoruceQueryModel } from "./models/resource-query.model";

export abstract class UserRepository {
	abstract getUserResources(
		id: string,
		query?: ResoruceQueryModel
	): Promise<UserResourcesDbModel | null>;
	abstract getSharedUserResources(
		id: string,
		query?: ResoruceQueryModel
	): Promise<SharedUserResourcesDbModel | null>;
	abstract getOwnUserResources(
		id: string,
		query?: ResoruceQueryModel
	): Promise<OwnUserResourcesDbModel | null>;
	abstract getPinnedUserResources(
		id: string,
		query?: ResoruceQueryModel
	): Promise<UserResourcesDbModel | null>;
	abstract getLoggedUser(id: string): Promise<LoggedUserDbModel | null>;
}
