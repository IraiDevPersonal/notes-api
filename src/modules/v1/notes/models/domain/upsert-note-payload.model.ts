import type { NoteComment } from "./note-comment.model";
import type { NoteTag } from "./note-tag.model";

export type CreateNotePayload = {
	title: string;
	content: string;
	tags?: NoteTag[];
	folderId?: string;
	comments?: NoteComment[];
};

export type UpdateNotePayload = Partial<
	Pick<CreateNotePayload, "content" | "title" | "folderId">
> & {
	updaterUserId: string;
};
