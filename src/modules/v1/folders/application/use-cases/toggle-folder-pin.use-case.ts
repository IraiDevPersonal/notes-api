import type { FoldersRepository } from "../../domain/repository";
import type { GetFolderByIdUseCase } from "./get-folder-by-id.use-case";

export class ToggleFolderPinUseCase {
	private readonly repository: FoldersRepository;
	private readonly getFolderByIdUseCase: GetFolderByIdUseCase;

	constructor(repository: FoldersRepository, getFolderByIdUseCase: GetFolderByIdUseCase) {
		this.repository = repository;
		this.getFolderByIdUseCase = getFolderByIdUseCase;
	}

	execute = async (folderId: string): Promise<void> => {
		const folder = await this.getFolderByIdUseCase.execute(folderId);
		await this.repository.toggleFolderPin(folderId, !folder.isPinned);
	};
}
