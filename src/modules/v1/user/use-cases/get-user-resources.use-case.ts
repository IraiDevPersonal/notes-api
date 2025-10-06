import { HttpError } from "@/lib/errors/http-error";
import type { ResourceFolderDomainModel } from "@/modules/v1/folders/models/domain/resource-folter.domain.model";
import type { RootFolderDomainModel } from "@/modules/v1/folders/models/domain/root-folder.domain.model";
import { NoteMapper } from "@/modules/v1/notes/mappers/note.mapper";
import type { NoteDbModel } from "@/modules/v1/notes/models/db/note.db..model";
import type { NoteDomainModel } from "@/modules/v1/notes/models/domain/note.domain.model";
import { ResourceFolderMapper } from "../../folders/mappers/resource-folder.mapper";
import type { ResourceFolderDbModel } from "../../folders/models/db/resource-folder.db.model";
import type { UserRepository } from "../repositories/user.repository";

type Data = {
	ownResources: RootFolderDomainModel;
	sharedResources: RootFolderDomainModel;
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

	private getUnfolderedNotes = (notes: NoteDbModel[]): NoteDomainModel[] => {
		return notes.filter((n) => n.folderId === null).map(NoteMapper.map);
	};

	private buildRootFolder = (
		folderId: string,
		looseNotes: NoteDomainModel[],
		nestedFolders: ResourceFolderDomainModel[]
	): RootFolderDomainModel => {
		return {
			name: "/",
			id: folderId,
			notes: looseNotes,
			subfolders: nestedFolders,
		};
	};

	private buildFolderTree = (
		folders: ResourceFolderDbModel[],
		notes: NoteDbModel[],
		parentId: string | null = null
	): ResourceFolderDomainModel[] => {
		return folders
			.filter((f) => f.parentId === parentId)
			.map((f) => ({
				...ResourceFolderMapper.map(f, notes),
				subfolders: this.buildFolderTree(folders, notes, f.id),
			}));
	};
}
