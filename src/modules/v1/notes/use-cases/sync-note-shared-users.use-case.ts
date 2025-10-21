import { HttpError } from "@/lib/errors/http-error";
import type { NotesRepository } from "../repository";
import type { GetNoteByIdUseCase } from "./get-note-by-id.use-case";

type ExecutePayload = {
	userId: string;
	noteId: string;
	sharedUsers: string[];
};

export class SyncNoteSharedUsersUseCase {
	private readonly repository: NotesRepository;
	private readonly getNoteByIdUseCase: GetNoteByIdUseCase;

	constructor(repository: NotesRepository, getNoteByIdUseCase: GetNoteByIdUseCase) {
		this.repository = repository;
		this.getNoteByIdUseCase = getNoteByIdUseCase;
	}

	execute = async ({ userId, noteId, sharedUsers }: ExecutePayload) => {
		const note = await this.getNoteByIdUseCase.execute(noteId);

		if (note.folderId) {
			throw HttpError.badRequest("Note is inside a folder, not possible to share");
		}

		if (note.owner.id !== userId) {
			throw HttpError.unauthorized("You are not the owner of this note");
		}

		await this.repository.syncNoteSharedUsers(noteId, sharedUsers);
	};
}
