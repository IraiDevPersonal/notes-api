import type { DBUserResources } from "../models/db/db-user-resources.model";
import type { FolderTree } from "../models/folter-tree.model";
import type { UserRepository } from "../repository";

type ExecuteResponse = [
	errorMessage: string | null,
	statusCode: number,
	FolderTree[] | null,
];

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

		const data = this.buildFolderTree(result.folders, result.notes);

		return [null, 200, data];
	};

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
				notes: notes
					.filter((n) => n.folderId === f.id)
					.map((n) => ({
						id: n.id,
						title: n.title,
						content: n.content,
					})),
			}));
	}
}
