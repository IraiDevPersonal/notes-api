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

	execute = async (userId: string, query: ResoruceQueryModel): Promise<Data> => {
		const { type, ...restQuery } = query;

		switch (type) {
			case "shared":
				return await this.getSharedResources(userId, restQuery);
			case "own":
				return await this.getOwnResources(userId, restQuery);
			case "pinned":
				return this.getPinnedResources(userId, restQuery);
			default:
				return await this.getAllResources(userId, restQuery);
		}
	};

	private getAllResources = async (
		userId: string,
		query: ResoruceQueryModel
	): Promise<Data> => {
		const [ownResources, sharedResources] = await Promise.all([
			this.getOwnResources(userId, query),
			this.getSharedResources(userId, query),
		]);

		const allNotes = ownResources.notes.concat(sharedResources.notes);
		const allFolders = ownResources.folders.concat(sharedResources.folders);

		return this.buildRootFolder("all", allNotes, allFolders);
	};

	private getOwnResources = async (
		userId: string,
		query: ResoruceQueryModel
	): Promise<Data> => {
		const result = await this.respository.getOwnUserResources(userId, query);

		if (!result) {
			throw HttpError.notFound("User not found from All Resources");
		}

		return this.buildRootFolder(
			"own",
			this.mappedNotes(result.notes),
			this.mappedFolders(result.folders)
		);
	};

	private getSharedResources = async (
		userId: string,
		query: ResoruceQueryModel
	): Promise<Data> => {
		const result = await this.respository.getSharedUserResources(userId, query);

		if (!result) {
			throw HttpError.notFound("User not found from Shared Resources");
		}

		const flattenedResources = this.flattenSharedResources(result);

		return this.buildRootFolder(
			"shared",
			this.mappedNotes(flattenedResources.notes),
			this.mappedFolders(flattenedResources.folders)
		);
	};

	private getPinnedResources = async (
		userId: string,
		query: ResoruceQueryModel
	): Promise<Data> => {
		const result = await this.respository.getPinnedUserResources(userId, query);

		if (!result) {
			throw HttpError.notFound("User not found from Pinned Resources");
		}

		const flattenedResources = this.flattenSharedResources(result);

		return this.buildRootFolder(
			"pinned",
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

	private flattenSharedResources = (
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
