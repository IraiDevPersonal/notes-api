import type { NoteComment } from "./note-comment.model";

export type CreateNotePayload = {
	title: string;
	content: string;
	folderId?: string;
	comments?: NoteComment[];
};

export type UpdateNotePayload = Partial<
	Pick<CreateNotePayload, "content" | "title" | "folderId">
> & {
	updaterUserId: string;
};
