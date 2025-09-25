import type { DbFolder } from "@/modules/v1/folders/models/db/db-folder.model";
import type { ResourceFolder } from "@/modules/v1/folders/models/domain/resource-folter.model";
import type { RootFolder } from "@/modules/v1/folders/models/domain/root-folder.model";
import { ResourceNoteMapper } from "@/modules/v1/notes/mappers/resource-note.mapper";
import type { DbNote } from "@/modules/v1/notes/models/db/db-note.model";
import type { ResourceNote } from "@/modules/v1/notes/models/domain/resource-note.model";
import { SharedUserMapper } from "../mappers/shared-user.mapper";
import type { UserRepository } from "../repository";

type Data = {
	ownResources: RootFolder;
	sharedResources: RootFolder;
};

type ExecuteResponse = [errorMessage: string | null, statusCode: number, Data | null];

export class GetUserResourcesUseCase {
	private readonly respository: UserRepository;

	constructor(respository: UserRepository) {
		this.respository = respository;
	}

	execute = async (userId: string | undefined): Promise<ExecuteResponse> => {
		if (!userId) {
			return ["User ID is required", 400, null];
		}

		const result = await this.respository.getUserResources(userId);

		if (!result) {
			return ["User not found", 404, null];
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
				id: f.id,
				name: f.name,
				order: f.order,
				parentId: f.parentId,
				createdAt: f.createdAt,
				updatedAt: f.updatedAt,
				description: f.description,
				owner: SharedUserMapper.map(f.owner),
				sharedWith: SharedUserMapper.toArray(f.shareFolders.flatMap((f) => f.user)),
				modifiedBy: f.lastModifiedBy ? SharedUserMapper.map(f.lastModifiedBy) : null,
				notes: notes.filter((n) => n.folderId === f.id).map(ResourceNoteMapper.map),
				subfolders: this.buildFolderTree(folders, notes, f.id),
			}));
	};
}
