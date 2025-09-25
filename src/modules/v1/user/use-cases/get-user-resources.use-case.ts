import type { DbSharedUser } from "../models/db/db-shared-user.model";
import type { DBUserResources } from "../models/db/db-user-resources.model";
import type { FolderTree } from "../models/folter-tree.model";
import type { Note } from "../models/note.model";
import type { SharedUser } from "../models/shared-user.model";
import type { UserRepository } from "../repository";

type Data = {
	ownFolders: FolderTree[];
	sharedFolders: FolderTree[];
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

		const ownFolders = this.buildRootFolder(
			"own-root-folder",
			this.getUnfolderedNotes(result.notes),
			this.buildFolderTree(result.folders, result.notes)
		);

		const flattenedShareFolders = result.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = result.shareNotes.flatMap((n) => n.note);

		const sharedFolders = this.buildRootFolder(
			"shared-root-folder",
			this.getUnfolderedNotes(flattenedShareNotes),
			this.buildFolderTree(flattenedShareFolders, flattenedShareNotes)
		);

		const data: Data = {
			ownFolders,
			sharedFolders,
		};

		return [null, 200, data];
	};

	private buildRootFolder = (
		folderId: string,
		looseNotes: Note[],
		nestedFolders: FolderTree[]
	): FolderTree[] => {
		return [
			{
				name: "/",
				id: folderId,
				notes: looseNotes,
				subfolders: nestedFolders,
			},
		];
	};

	private getUnfolderedNotes = (notes: DBUserResources["notes"]): Note[] => {
		return notes.filter((n) => n.folderId === null).map(this.mapNote);
	};

	private buildFolderTree = (
		folders: DBUserResources["folders"],
		notes: DBUserResources["notes"],
		parentId: string | null = null
	): FolderTree[] => {
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
				owner: this.mapShareUser(f.owner),
				sharedWith: f.shareFolders.map((s) => this.mapShareUser(s.user)),
				modifiedBy: f.lastModifiedBy ? this.mapShareUser(f.lastModifiedBy) : null,
				notes: notes.filter((n) => n.folderId === f.id).map(this.mapNote),
				subfolders: this.buildFolderTree(folders, notes, f.id),
			}));
	};

	private mapNote = (note: DBUserResources["notes"][number]): Note => {
		return {
			id: note.id,
			order: note.order,
			title: note.title,
			content: note.content,
			folderId: note.folderId,
			updatedAt: note.updatedAt,
			createdAt: note.createdAt,
			owner: this.mapShareUser(note.owner),
			sharedWith: note.shareNotes.map((n) => this.mapShareUser(n.user)),
			modifiedBy: note.lastModifiedBy ? this.mapShareUser(note.lastModifiedBy) : null,
		};
	};

	private mapShareUser = (user: DbSharedUser): SharedUser => {
		return {
			id: user.id,
			email: user.email,
			userName: user.userName,
			fullName: `${user.name} ${user.lastName}`,
		};
	};
}
