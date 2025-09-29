import { logger } from "@/lib/logger";
import type { ResourceFolderDomainModel } from "@/modules/v1/folders/models/domain/resource-folter.domain.model";
import type { RootFolderDomainModel } from "@/modules/v1/folders/models/domain/root-folder.domain.model";
import { NoteMapper } from "@/modules/v1/notes/mappers/note.mapper";
import type { DbNote } from "@/modules/v1/notes/models/db/db-note.model";
import type { Note } from "@/modules/v1/notes/models/domain/note.model";
import { ResourceFolderMapper } from "../../folders/mappers/resource-folder.mapper";
import { BuildFolderTreeUseCase } from "../../folders/use-cases/build-folder-tree.use-case";
import type { UserRepository } from "../repositories/user.repository";

type Data = {
	ownResources: RootFolderDomainModel;
	sharedResources: RootFolderDomainModel;
};

type ExecuteResponse = [errorMessage: string | null, statusCode: number, Data | null];

export class GetUserResourcesUseCase {
	private readonly respository: UserRepository;
	private readonly sourceError = "GetUserResourcesUseCase/execute";
	private readonly buildFolderTreeUseCase: BuildFolderTreeUseCase<ResourceFolderDomainModel>;

	constructor(respository: UserRepository) {
		this.respository = respository;
		this.buildFolderTreeUseCase = new BuildFolderTreeUseCase(ResourceFolderMapper.map);
	}

	execute = async (userId: string | undefined): Promise<ExecuteResponse> => {
		if (!userId) {
			const errorMessage = "User ID is required";
			logger.error({
				source: this.sourceError,
				message: errorMessage,
			});
			return [errorMessage, 400, null];
		}

		const result = await this.respository.getUserResources(userId);

		if (!result) {
			const errorMessage = "User not found";
			logger.error({
				source: this.sourceError,
				message: errorMessage,
			});
			return [errorMessage, 404, null];
		}

		const ownResources = this.buildRootFolder(
			"own-root-folder",
			this.getUnfolderedNotes(result.notes),
			this.buildFolderTreeUseCase.execute(result.folders, result.notes)
		);

		const flattenedShareFolders = result.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = result.shareNotes.flatMap((n) => n.note);

		const sharedResources = this.buildRootFolder(
			"shared-root-folder",
			this.getUnfolderedNotes(flattenedShareNotes),
			this.buildFolderTreeUseCase.execute(flattenedShareFolders, flattenedShareNotes)
		);

		const data: Data = {
			ownResources,
			sharedResources,
		};

		return [null, 200, data];
	};

	private buildRootFolder = (
		folderId: string,
		looseNotes: Note[],
		nestedFolders: ResourceFolderDomainModel[]
	): RootFolderDomainModel => {
		return {
			name: "/",
			id: folderId,
			notes: looseNotes,
			subfolders: nestedFolders,
		};
	};

	private getUnfolderedNotes = (notes: DbNote[]): Note[] => {
		return notes.filter((n) => n.folderId === null).map(NoteMapper.map);
	};
}
