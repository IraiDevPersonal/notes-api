import type { FolderRepository } from "../../data/repository";

export class DeleteFolderUseCase {
	private readonly repository: FolderRepository;

	constructor(repository: FolderRepository) {
		this.repository = repository;
	}

	execute = async (id: string): Promise<void> => {
		await this.repository.deleteFolder(id);
	};
}
