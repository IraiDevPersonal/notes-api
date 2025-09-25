import { logger } from "@/lib/logger";
import type { DbFolder } from "@/modules/v1/folders/models/db/db-folder.model";
import type { ResourceFolder } from "@/modules/v1/folders/models/domain/resource-folter.model";
import type { RootFolder } from "@/modules/v1/folders/models/domain/root-folder.model";
import { ResourceNoteMapper } from "@/modules/v1/notes/mappers/resource-note.mapper";
import type { DbNote } from "@/modules/v1/notes/models/db/db-note.model";
import type { ResourceNote } from "@/modules/v1/notes/models/domain/resource-note.model";
import { ResourceFolderMapper } from "../../folders/mappers/resource-folder.mapper";
import type { UserRepository } from "../repository";

type Data = {
	ownResources: RootFolder;
	sharedResources: RootFolder;
};

type ExecuteResponse = [errorMessage: string | null, statusCode: number, Data | null];

export class GetUserResourcesUseCase {
	private readonly respository: UserRepository;
	private readonly sourceError = "GetUserResourcesUseCase/execute";

	constructor(respository: UserRepository) {
		this.respository = respository;
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
			this.buildFolderTree(result.folders, result.notes)
		);

		const flattenedShareFolders = result.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = result.shareNotes.flatMap((n) => n.note);

		const sharedResources = this.buildRootFolder(
			"shared-root-folder",
			this.getUnfolderedNotes(flattenedShareNotes),
			this.buildFolderTree(flattenedShareFolders, flattenedShareNotes)
		);

		const data: Data = {
			ownResources,
			sharedResources,
		};

		return [null, 200, data];
	};

	private buildRootFolder = (
		folderId: string,
		looseNotes: ResourceNote[],
		nestedFolders: ResourceFolder[]
	): RootFolder => {
		return {
			name: "/",
			id: folderId,
			notes: looseNotes,
			subfolders: nestedFolders,
		};
	};

	private getUnfolderedNotes = (notes: DbNote[]): ResourceNote[] => {
		return notes.filter((n) => n.folderId === null).map(ResourceNoteMapper.map);
	};

	private buildFolderTree = (
		folders: DbFolder[],
		notes: DbNote[],
		parentId: string | null = null
	): ResourceFolder[] => {
		return folders
			.filter((f) => f.parentId === parentId)
			.map((f) => ({
				...ResourceFolderMapper.map(f, notes),
				subfolders: this.buildFolderTree(folders, notes, f.id),
			}));
	};
}
