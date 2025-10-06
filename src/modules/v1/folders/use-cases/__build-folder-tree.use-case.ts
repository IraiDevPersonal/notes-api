import type { NoteDbModel } from "../../notes/models/db/note.db..model";
import type { ResourceFolderDbModel } from "../models/db/resource-folder.db.model";
import type { FolderDomainModel } from "../models/domain/folder.domain.model";
import type { ResourceFolderDomainModel } from "../models/domain/resource-folter.domain.model";

type FolderMapper<T> = (
	folder: ResourceFolderDbModel,
	notes: NoteDbModel[]
) => Omit<T, "subfolders">;

export class BuildFolderTreeUseCase<
	T extends FolderDomainModel | ResourceFolderDomainModel,
> {
	private readonly mapper: FolderMapper<T>;

	constructor(mapper: FolderMapper<T>) {
		this.mapper = mapper;
	}

	execute = (
		folders: ResourceFolderDbModel[],
		notes: NoteDbModel[],
		parentId: string | null = null
	): T[] => {
		return folders
			.filter((f) => f.parentId === parentId)
			.map(
				(f) =>
					({
						...this.mapper(f, notes),
						subfolders: this.execute(folders, notes, f.id),
					}) as unknown as T
			);
	};
}
