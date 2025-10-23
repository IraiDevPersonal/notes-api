import type { FolderRepository } from "../../data/repository";
import type { FolderModel } from "../../domain/models/folder.model";
import type {
	CreateFolderModel,
	UpdateFolderModel,
} from "../../domain/models/upsert-folder.model";
import { FolderMapper } from "../mappers/folder.mapper";

type ExecutePayload = {
	folderId?: string;
	userId: string;
	body: unknown;
};

export class UpsertFolderUseCase {
	private readonly repository: FolderRepository;

	constructor(repository: FolderRepository) {
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
