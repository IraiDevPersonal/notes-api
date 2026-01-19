import z from "zod";

export const ResourceQuerySchema = z.object({
	type: z.enum(["own", "shared", "fixed"]).optional(),
});
