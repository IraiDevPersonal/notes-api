import { HttpError } from "@/lib/errors/http-error";
import type { FoldersRepository } from "../repository";
import type { GetFolderByIdUseCase } from "./get-folder-by-id.use-case";

type ExecutePayload = {
	userId: string;
	folderId: string;
	sharedUsers: string[];
};

export class SyncFolderSharedUsersUseCase {
	private readonly repository: FoldersRepository;
	private readonly getFolderByIdUseCase: GetFolderByIdUseCase;

	constructor(repository: FoldersRepository, getFolderByIdUseCase: GetFolderByIdUseCase) {
		this.repository = repository;
		this.getFolderByIdUseCase = getFolderByIdUseCase;
	}

	execute = async ({ userId, folderId, sharedUsers }: ExecutePayload) => {
		const folder = await this.getFolderByIdUseCase.execute(folderId);

		if (folder.owner.id !== userId) {
			throw HttpError.unauthorized("You are not the owner of this folder");
		}

		await this.repository.syncFolderSharedUsers(folderId, sharedUsers);
	};
}
