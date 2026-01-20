import { HttpError } from "@/lib/errors/http-error";
import { ResourceFolderMapper } from "@/modules/v1/folders/application/mappers/resource-folder.mapper";
import type { ResourceFolderDbModel } from "@/modules/v1/folders/data/models/resource-folder-db.model";
import type { ResourceFolderModel } from "@/modules/v1/folders/domain/models/resource-folter.model";
import type { RootFolderModel } from "@/modules/v1/folders/domain/models/root-folder.model";
import { NoteMapper } from "@/modules/v1/notes/application/mappers/note.mapper";
import type { NoteDbModel } from "@/modules/v1/notes/data/models/note-db.model";
import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { SharedUserResourcesDbModel } from "../../data/models/user-resources-db.model";
import type { ResoruceQueryModel } from "../../domain/models/resource-query.model";
import type { UserRepository } from "../../domain/repository";

type Data = RootFolderModel;

export class GetUserResourcesUseCase {
	private readonly respository: UserRepository;

	constructor(respository: UserRepository) {
		this.respository = respository;
	}

	execute = async (userId: string, type?: ResoruceQueryModel["type"]): Promise<Data> => {
		switch (type) {
			case "shared":
				return await this.getSharedResources(userId);
			case "own":
				return await this.getOwnResources(userId);
			case "pinned":
				return this.getPinnedResources(userId);
			default:
				return await this.getAllResources(userId);
		}
	};

	private getAllResources = async (userId: string): Promise<Data> => {
		const [ownResources, sharedResources] = await Promise.all([
			this.getOwnResources(userId),
			this.getSharedResources(userId),
		]);

		const allNotes = ownResources.notes.concat(sharedResources.notes);
		const allFolders = ownResources.folders.concat(sharedResources.folders);

		return this.buildRootFolder("all-resources-id", allNotes, allFolders);
	};

	private getOwnResources = async (userId: string): Promise<Data> => {
		const result = await this.respository.getOwnUserResources(userId);

		if (!result) {
			throw HttpError.notFound("User not found");
		}

		return this.buildRootFolder(
			"own-folder-id",
			this.mappedNotes(result.notes),
			this.mappedFolders(result.folders)
		);
	};

	private getSharedResources = async (userId: string): Promise<Data> => {
		const result = await this.respository.getSharedUserResources(userId);

		if (!result) {
			throw HttpError.notFound("User not found");
		}

		const flattenedResources = this.flattedSharedResources(result);

		return this.buildRootFolder(
			"shared-folder-id",
			this.mappedNotes(flattenedResources.notes),
			this.mappedFolders(flattenedResources.folders)
		);
	};

	private getPinnedResources = async (userId: string): Promise<Data> => {
		const result = await this.respository.getPinnedUserResources(userId);

		if (!result) {
			throw HttpError.notFound("User not found");
		}

		const flattenedResources = this.flattedSharedResources(result);

		return this.buildRootFolder(
			"pinned-folder-id",
			this.mappedNotes(result.notes.concat(flattenedResources.notes)),
			this.mappedFolders(result.folders.concat(flattenedResources.folders))
		);
	};

	private buildRootFolder = (
		folderId: string,
		notes: NoteModel[],
		folders: ResourceFolderModel[]
	): RootFolderModel => {
		return {
			name: "/",
			id: folderId,
			notes: notes,
			folders: folders,
		};
	};

	private mappedFolders = (folders: ResourceFolderDbModel[]): ResourceFolderModel[] => {
		return folders.map(ResourceFolderMapper.map);
	};

	private mappedNotes = (notes: NoteDbModel[]): NoteModel[] => {
		return notes.map(NoteMapper.map);
	};

	private flattedSharedResources = (
		resources: SharedUserResourcesDbModel
	): { folders: ResourceFolderDbModel[]; notes: NoteDbModel[] } => {
		const flattenedShareFolders = resources.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = resources.shareNotes.flatMap((n) => n.note);

		return {
			folders: flattenedShareFolders,
			notes: flattenedShareNotes,
		};
	};
}
