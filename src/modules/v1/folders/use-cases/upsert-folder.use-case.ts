import type { FolderDomainModel } from "../models/domain/folder.domain.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload";
import type { FoldersRepository } from "../repository";
import { FolderMapper } from "../utils/mappers/folder.mapper";

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

	execute = async ({
		userId,
		folderId,
		body,
	}: ExecutePayload): Promise<FolderDomainModel> => {
		if (folderId) {
			return this.update(userId, folderId, body);
		}
		return this.create(userId, body);
	};

	private create = async (userId: string, body: unknown): Promise<FolderDomainModel> => {
		const result = await this.repository.createFolder(
			userId,
			body as CreateFolderPayload
		);
		return FolderMapper.map(result);
	};

	private update = async (
		userId: string,
		folderId: string,
		body: unknown
	): Promise<FolderDomainModel> => {
		const result = await this.repository.updateFolder(
			userId,
			folderId,
			body as UpdateFolderPayload
		);
		return FolderMapper.map(result);
	};
}
