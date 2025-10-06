import type { SharedUserDbModel } from "../models/db/shared-user.db.model";
import type { SharedUserDomainModel } from "../models/domain/shared-user.domain.model";

export class SharedUserMapper {
	static map = (raw: SharedUserDbModel): SharedUserDomainModel => {
		return {
			id: raw.id,
			email: raw.email,
			userName: raw.userName,
			fullName: `${raw.name} ${raw.lastName}`,
		};
	};

	static toArray = (list: SharedUserDbModel[]): SharedUserDomainModel[] => {
		return list.map(this.map);
	};
}
