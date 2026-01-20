import z from "zod";
import { EResourceType } from "../models/resource-query.model";

export const ResourceQuerySchema = z.object({
	type: z.enum(EResourceType).optional(),
});
