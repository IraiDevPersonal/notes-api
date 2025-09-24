import { DbClient } from "@/lib/db-client";
import type { DBUserResources } from "./models/db/db-user-resources.model";
import type { UserRepository } from "./repository";
import { NOTE_USER_SELECTOR } from "./utils/constants";

export class UserService extends DbClient implements UserRepository {
	private readonly noteUserSelector = NOTE_USER_SELECTOR;

	getUserResources = async (userId: string): Promise<DBUserResources | null> => {
		try {
			return await this.db.user.findFirst({
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
											user: { select: this.noteUserSelector },
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
											user: { select: this.noteUserSelector },
										},
									},
								},
							},
						},
					},
				},
			});
		} catch (error) {
			console.log(error);
			throw new Error("Error to get user resources");
		}
	};
}
