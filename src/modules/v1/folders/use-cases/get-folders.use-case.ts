import { FolderMapper } from "../mappers/folder.mapper";
import type { FolderDomainModel } from "../models/domain/folder.domain.model";
import type { FoldersRepository } from "../repositories/folders.repository";
import { BuildFolderTreeUseCase } from "./build-folder-tree.use-case";

export class GetFoldersUseCase {
	private readonly repository: FoldersRepository;
	private readonly buildFolderTreeUseCase: BuildFolderTreeUseCase<FolderDomainModel>;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
		this.buildFolderTreeUseCase = new BuildFolderTreeUseCase(FolderMapper.map);
	}

	execute = async (folderId: string): Promise<FolderDomainModel[]> => {
		const result = await this.repository.getFoldersByParentId(folderId);
		const notes = result.flatMap((f) => f.notes);

		return this.buildFolderTreeUseCase.execute(result, notes, folderId);
	};
}
