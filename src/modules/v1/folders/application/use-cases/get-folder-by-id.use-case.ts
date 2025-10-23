import { HttpError } from "@/lib/errors/http-error";
import type { FolderRepository } from "../../data/repository";
import { FolderMapper } from "../mappers/folder.mapper";

export class GetFolderByIdUseCase {
	private readonly repository: FolderRepository;

	constructor(repository: FolderRepository) {
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
