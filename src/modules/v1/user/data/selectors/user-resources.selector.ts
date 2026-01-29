import type { Prisma } from "@prisma/client";
import { RESOURCE_FOLDER_SELECTOR } from "@/modules/v1/folders/data/selectors/resource-folder.selector";
import { NOTE_SELECTOR } from "@/modules/v1/notes/data/selectors/note.selector";
import type { ResoruceQueryModel } from "../../domain/models/resource-query.model";

const folderFilters = (
	query?: ResoruceQueryModel
): Prisma.FolderWhereInput | undefined =>
	query?.q ? { name: { contains: query.q, mode: "insensitive" } } : undefined;

const noteFilters = (query?: ResoruceQueryModel): Prisma.NoteWhereInput | undefined =>
	query?.q ? { title: { contains: query.q, mode: "insensitive" } } : undefined;

export const USER_RESOURCES_SELECTOR = (query?: ResoruceQueryModel) =>
	({
		folders: {
			select: RESOURCE_FOLDER_SELECTOR,
			where: { deletedAt: null, ...folderFilters(query) },
		},
		notes: {
			select: NOTE_SELECTOR,
			where: { deletedAt: null, ...noteFilters(query) },
		},
		shareFolders: {
			select: {
				permission: true,
				folder: { select: RESOURCE_FOLDER_SELECTOR },
			},
			where: { folder: { deletedAt: null, ...folderFilters(query) } },
		},
		shareNotes: {
			select: {
				permission: true,
				note: { select: NOTE_SELECTOR },
			},
			where: { note: { deletedAt: null, ...noteFilters(query) } },
		},
	}) satisfies Prisma.UserSelect;

export const USER_PINNED_RESOURCES_SELECTOR = (query?: ResoruceQueryModel) =>
	({
		folders: {
			select: RESOURCE_FOLDER_SELECTOR,
			where: { deletedAt: null, isPinned: true, ...folderFilters(query) },
		},
		notes: {
			select: NOTE_SELECTOR,
			where: { deletedAt: null, isPinned: true, ...noteFilters(query) },
		},
		shareFolders: {
			select: {
				permission: true,
				folder: { select: RESOURCE_FOLDER_SELECTOR },
			},
			where: {
				folder: {
					isPinned: true,
					deletedAt: null,
					...folderFilters(query),
				},
			},
		},
		shareNotes: {
			select: {
				permission: true,
				note: { select: NOTE_SELECTOR },
			},
			where: {
				note: {
					isPinned: true,
					deletedAt: null,
					...noteFilters(query),
				},
			},
		},
	}) satisfies Prisma.UserSelect;

export const OWN_USER_RESOURCES_SELECTOR = (query?: ResoruceQueryModel) =>
	({
		folders: {
			select: RESOURCE_FOLDER_SELECTOR,
			where: { deletedAt: null, ...folderFilters(query) },
		},
		notes: {
			select: NOTE_SELECTOR,
			where: { deletedAt: null, ...noteFilters(query) },
		},
	}) satisfies Prisma.UserSelect;

export const SHARED_USER_RESOURCES_SELECTOR = (query?: ResoruceQueryModel) =>
	({
		shareFolders: {
			select: {
				permission: true,
				folder: { select: RESOURCE_FOLDER_SELECTOR },
			},
			where: { folder: { deletedAt: null, ...folderFilters(query) } },
		},
		shareNotes: {
			select: {
				permission: true,
				note: { select: NOTE_SELECTOR },
			},
			where: { note: { deletedAt: null, ...noteFilters(query) } },
		},
	}) satisfies Prisma.UserSelect;
