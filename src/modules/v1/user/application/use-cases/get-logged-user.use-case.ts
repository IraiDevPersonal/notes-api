import type { LoggedUserModel } from "../../domain/models/logged-user.model";
import type { UserRepository } from "../../domain/repository";
import { LoggedUserMapper } from "../mappers/logged-user.mapper";

export class GetLoggedUserUseCase {
	private readonly repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(userId: string): Promise<LoggedUserModel> {
		const user = await this.repository.getLoggedUser(userId);

		if (!user) {
			throw new Error("User not found");
		}

		return LoggedUserMapper.map(user);
	}
}
