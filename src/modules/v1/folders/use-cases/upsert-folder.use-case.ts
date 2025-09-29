import { ResourceFolderMapper } from "../mappers/resource-folder.mapper";
import type { ResourceFolderDomainModel } from "../models/domain/resource-folter.domain.model";
import type {
	CreateFolderPayload,
	UpdateFolderPayload,
} from "../models/domain/upsert-folder-payload.model";
import type { FoldersRepository } from "../repositories/folders.repository";

export class UpsertFolderUseCase {
	private readonly repository: FoldersRepository;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
	}

	executeCreate = async (
		userId: string,
		body: unknown
	): Promise<Omit<ResourceFolderDomainModel, "subfolders">> => {
		const folder = await this.repository.createFolder(
			userId,
			body as CreateFolderPayload
		);
		return ResourceFolderMapper.map(folder, []);
	};

	executeUpdate = async (
		userId: string,
		folderId: string,
		body: unknown
	): Promise<Omit<ResourceFolderDomainModel, "subfolders">> => {
		const folder = await this.repository.updateFolder(
			userId,
			folderId,
			body as UpdateFolderPayload
		);
		const notes = await this.repository.getNotesByFolder(folderId);
		return ResourceFolderMapper.map(folder, notes);
	};
}
