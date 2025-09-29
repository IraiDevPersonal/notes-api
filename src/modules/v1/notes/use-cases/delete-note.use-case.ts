import type { NotesRepository } from "../repositories/notes.respository";

export class DeleteNoteUseCase {
	private readonly repository: NotesRepository;

	constructor(repository: NotesRepository) {
		this.repository = repository;
	}

	execute = async (id: string): Promise<void> => {
		await this.repository.deleteNote(id);
	};
}
