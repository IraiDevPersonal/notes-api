import type { LoggedUserDbModel } from "../../data/models/logged-user.model";
import type { LoggedUserModel } from "../../domain/models/logged-user.model";

export class LoggedUserMapper {
	static map = (raw: LoggedUserDbModel): LoggedUserModel => ({
		id: raw.id,
		name: raw.name,
		email: raw.email,
		avatar: raw.avatar,
		lastName: raw.lastName,
		createdAt: raw.createdAt,
		ownerResourceCount: raw._count.folders + raw._count.notes,
		sharedResourceCount: raw._count.shareFolders + raw._count.shareNotes,
	});
}
