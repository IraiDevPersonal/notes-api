import type { SharedUserDbModel } from "../../data/models/shared-user-db.model";
import type { SharedUserModel } from "../../domain/models/shared-user.model";

export class SharedUserMapper {
	static map = (raw: SharedUserDbModel): SharedUserModel => {
		return {
			id: raw.id,
			email: raw.email,
			userName: raw.userName,
			fullName: `${raw.name} ${raw.lastName}`,
		};
	};

	static toArray = (list: SharedUserDbModel[]): SharedUserModel[] => {
		return list.map(this.map);
	};
}
