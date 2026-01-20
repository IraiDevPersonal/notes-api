import type { NotesRepository } from "../../domain/repository";
import type { GetNoteByIdUseCase } from "./get-note-by-id.use-case";

export class ToggleNotePinUseCase {
	private readonly repository: NotesRepository;
	private readonly getNoteByIdUseCase: GetNoteByIdUseCase;

	constructor(repository: NotesRepository, getNoteByIdUseCase: GetNoteByIdUseCase) {
		this.repository = repository;
		this.getNoteByIdUseCase = getNoteByIdUseCase;
	}

	execute = async (noteId: string): Promise<void> => {
		const note = await this.getNoteByIdUseCase.execute(noteId);

		return this.repository.toggleNotePin(noteId, !note.isPinned);
	};
}
