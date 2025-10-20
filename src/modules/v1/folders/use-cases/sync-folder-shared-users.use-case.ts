import { HttpError } from "@/lib/errors/http-error";
import type { FoldersRepository } from "../repository";

export class SyncFolderSharedUsersUseCase {
	private readonly repository: FoldersRepository;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
	}

	execute = async (folderId: string, sharedUsers: string[]) => {
		if (sharedUsers.length === 0) {
			throw HttpError.badRequest("Shared users are required");
		}
		await this.repository.syncFolderSharedUsers(folderId, sharedUsers);
	};
}
