import { HttpError } from "@/lib/errors/http-error";
import { ResourceFolderMapper } from "@/modules/v1/folders/application/mappers/resource-folder.mapper";
import type { ResourceFolderDbModel } from "@/modules/v1/folders/data/models/resource-folder-db.model";
import type { ResourceFolderModel } from "@/modules/v1/folders/domain/models/resource-folter.model";
import type { RootFolderModel } from "@/modules/v1/folders/domain/models/root-folder.model";
import { NoteMapper } from "@/modules/v1/notes/application/mappers/note.mapper";
import type { NoteDbModel } from "@/modules/v1/notes/data/models/note-db.model";
import type { NoteModel } from "@/modules/v1/notes/domain/models/note.model";
import type { UserRepository } from "../../domain/repository";

type Data = {
	ownResources: RootFolderModel;
	sharedResources: RootFolderModel;
};

export class GetUserResourcesUseCase {
	private readonly respository: UserRepository;

	constructor(respository: UserRepository) {
		this.respository = respository;
	}

	execute = async (userId: string): Promise<Data> => {
		const result = await this.respository.getUserResources(userId);

		if (!result) {
			throw HttpError.notFound("User not found");
		}

		const ownResources = this.buildRootFolder(
			"own-folder-id",
			this.getUnfolderedNotes(result.notes),
			this.buildFolderTree(result.folders, result.notes)
		);

		const flattenedShareFolders = result.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = result.shareNotes.flatMap((n) => n.note);

		const sharedResources = this.buildRootFolder(
			"shared-folder-id",
			this.getUnfolderedNotes(flattenedShareNotes),
			this.buildFolderTree(flattenedShareFolders, flattenedShareNotes)
		);

		const data: Data = {
			ownResources,
			sharedResources,
		};

		return data;
	};

	private getUnfolderedNotes = (notes: NoteDbModel[]): NoteModel[] => {
		return notes.filter((n) => n.folderId === null).map(NoteMapper.map);
	};

	private buildRootFolder = (
		folderId: string,
		looseNotes: NoteModel[],
		nestedFolders: ResourceFolderModel[]
	): RootFolderModel => {
		return {
			name: "/",
			id: folderId,
			notes: looseNotes,
			folders: nestedFolders,
		};
	};

	private buildFolderTree = (
		folders: ResourceFolderDbModel[],
		notes: NoteDbModel[],
		parentId: string | null = null
	): ResourceFolderModel[] => {
		return folders
			.filter((f) => f.parentId === parentId)
			.map((f) => ({
				...ResourceFolderMapper.map(f, notes),
				subfolders: this.buildFolderTree(folders, notes, f.id),
			}));
	};
}
