import type { FolderDomainModel } from "./folder.domain.model";

export type ResourceFolderDomainModel = Pick<
	FolderDomainModel,
	"id" | "name" | "order" | "notes" | "owner" | "sharedWith" | "subfolders"
>;
