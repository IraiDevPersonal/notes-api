import "dotenv/config";
import envVar from "env-var";

export const ENVS = {
	PORT: envVar.get("PORT").required().asPortNumber(),
	POSTGRES_USER: envVar.get("POSTGRES_USER").required().asString(),
	POSTGRES_DB: envVar.get("POSTGRES_DB").required().asString(),
	POSTGRES_PASSWORD: envVar.get("POSTGRES_PASSWORD").required().asString(),
	DATABASE_URL: envVar.get("DATABASE_URL").required().asString(),
	LOG_LEVEL: envVar.get("LOG_LEVEL").default("info").asString(),
	GEMINI_API_KEY: envVar.get("GEMINI_API_KEY").required().asString(),
};
