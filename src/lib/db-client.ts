import { PrismaClient } from "@prisma/client";

export class DbClient {
	protected readonly db: PrismaClient;

	constructor() {
		this.db = new PrismaClient();
	}
}
