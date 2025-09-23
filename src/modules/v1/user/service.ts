import { type Prisma, PrismaClient } from "@prisma/client";
import type { DBUserResources } from "./models/db/db-user-resources.model";
import type { UserRepository } from "./repository";

export class UserService implements UserRepository {
	private readonly bd: PrismaClient;

	constructor() {
		this.bd = new PrismaClient();
	}

	getUserResources = async (
		userId: string
	): Promise<DBUserResources | null> => {
		try {
			const userSelect: Prisma.UserSelect = {
				id: true,
				name: true,
				email: true,
				avatar: true,
				userName: true,
				lastName: true,
			};

			return await this.bd.user.findFirst({
				where: { id: userId },
				select: {
					folders: true,
					notes: true,
					shareFolders: {
						include: {
							folder: {
								include: {
									shareFolders: {
										select: {
											user: { select: userSelect },
										},
									},
								},
							},
						},
					},
					shareNotes: {
						include: {
							note: {
								include: {
									shareNotes: {
										select: {
											user: { select: userSelect },
										},
									},
								},
							},
						},
					},
				},
			});
		} catch (_) {
			throw new Error("Error to get user resources");
		}
	};
}
