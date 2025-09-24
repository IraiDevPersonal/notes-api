import type { DBUserResources } from "../models/db/db-user-resources.model";
import type { FolderTree, NoteTree } from "../models/folter-tree.model";
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
			"own-root",
			this.getUnfolderedNotes(result.notes),
			this.buildFolderTree(result.folders, result.notes)
		);

		const flattenedShareFolders = result.shareFolders.flatMap((f) => f.folder);
		const flattenedShareNotes = result.shareNotes.flatMap((n) => n.note);

		const sharedFolders = this.buildRootFolder(
			"shared-root",
			this.getUnfolderedNotes(flattenedShareNotes),
			this.buildFolderTree(flattenedShareFolders, flattenedShareNotes)
		);

		const data: Data = {
			ownFolders,
			sharedFolders,
		};

		return [null, 200, data];
	};

	private buildRootFolder(
		folderId: string,
		looseNotes: NoteTree[],
		nestedFolders: FolderTree[]
	): FolderTree[] {
		return [
			{
				id: folderId,
				name: "/",
				description: null,
				notes: looseNotes,
				subfolders: nestedFolders,
			},
		];
	}

	private getUnfolderedNotes(notes: DBUserResources["notes"]): NoteTree[] {
		return notes.filter((n) => n.folderId === null).map(this.mapNote);
	}

	private buildFolderTree(
		folders: DBUserResources["folders"],
		notes: DBUserResources["notes"],
		parentId: string | null = null
	): FolderTree[] {
		return folders
			.filter((f) => f.parentId === parentId)
			.map((f) => ({
				id: f.id,
				name: f.name,
				description: f.description,
				subfolders: this.buildFolderTree(folders, notes, f.id),
				notes: notes.filter((n) => n.folderId === f.id).map(this.mapNote),
			}));
	}

	private mapNote(note: DBUserResources["notes"][number]): NoteTree {
		return {
			id: note.id,
			title: note.title,
			content: note.content,
		};
	}
}
