import { PrismaClient } from "@prisma/client";

export class DatabaseClient {
	protected readonly db: PrismaClient;

	constructor() {
		this.db = new PrismaClient();
	}
}
