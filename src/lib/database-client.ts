import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export class DatabaseClient {
	protected readonly db: PrismaClient;

	constructor() {
		this.db = prismaClient;
	}
}
