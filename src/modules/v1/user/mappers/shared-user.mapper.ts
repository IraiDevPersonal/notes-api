import type { DbSharedUser } from "../models/db/db-shared-user.model";
import type { SharedUser } from "../models/shared-user.model";

export class SharedUserMapper {
	static map = (user: DbSharedUser): SharedUser => {
		return {
			id: user.id,
			email: user.email,
			userName: user.userName,
			fullName: `${user.name} ${user.lastName}`,
		};
	};

	static toArray = (users: DbSharedUser[]): SharedUser[] => {
		return users.map(this.map);
	};
}
