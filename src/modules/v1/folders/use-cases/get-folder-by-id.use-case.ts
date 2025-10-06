import { HttpError } from "@/lib/errors/http-error";
import { FolderMapper } from "../mappers/folder.mapper";
import type { FoldersRepository } from "../repositories/folders.repository";

export class GetFolderByIdUseCase {
	private readonly repository: FoldersRepository;

	constructor(repository: FoldersRepository) {
		this.repository = repository;
	}

	execute = async (folderId: string) => {
		const result = await this.repository.getFolderById(folderId);

		if (!result) {
			throw HttpError.notFound("Folder not found");
		}

		return FolderMapper.map(result);
	};
}
