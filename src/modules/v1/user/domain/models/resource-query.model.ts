import type z from "zod";
import type { ResourceQuerySchema } from "../schemas/resource-query.schema";

export enum EResourceType {
	OWN = "own",
	SHARED = "shared",
	PINNED = "pinned",
}

export type ResoruceQueryModel = z.infer<typeof ResourceQuerySchema>;
