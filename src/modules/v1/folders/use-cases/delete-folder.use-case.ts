import type { FoldersRepository } from "../repositories/folders.repository";

export class DeleteFolderUseCase {
	private readonly repository: FoldersRepository;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
	}

	execute = async (id: string): Promise<void> => {
		await this.repository.deleteFolder(id);
	};
}
