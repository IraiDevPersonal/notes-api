import type { DbSharedUser } from "../models/db/db-shared-user.model";
import type { SharedUser } from "../models/domain/shared-user.model";

export class SharedUserMapper {
	static map = (raw: DbSharedUser): SharedUser => {
		return {
			id: raw.id,
			email: raw.email,
			userName: raw.userName,
			fullName: `${raw.name} ${raw.lastName}`,
		};
	};

	static toArray = (list: DbSharedUser[]): SharedUser[] => {
		return list.map(this.map);
	};
}
