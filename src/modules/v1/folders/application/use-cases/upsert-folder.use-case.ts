import type { FolderModel } from "../../domain/models/folder.model";
import type {
	CreateFolderModel,
	UpdateFolderModel,
} from "../../domain/models/upsert-folder.model";
import type { FoldersRepository } from "../../domain/repository";
import { FolderMapper } from "../mappers/folder.mapper";

type ExecutePayload = {
	folderId?: string;
	userId: string;
	body: unknown;
};

export class UpsertFolderUseCase {
	private readonly repository: FoldersRepository;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
	}

	execute = async ({ userId, folderId, body }: ExecutePayload): Promise<FolderModel> => {
		if (folderId) {
			return this.update(userId, folderId, body);
		}
		return this.create(userId, body);
	};

	private create = async (userId: string, body: unknown): Promise<FolderModel> => {
		const result = await this.repository.createFolder(userId, body as CreateFolderModel);
		return FolderMapper.map(result);
	};

	private update = async (
		userId: string,
		folderId: string,
		body: unknown
	): Promise<FolderModel> => {
		const result = await this.repository.updateFolder(
			userId,
			folderId,
			body as UpdateFolderModel
		);
		return FolderMapper.map(result);
	};
}
