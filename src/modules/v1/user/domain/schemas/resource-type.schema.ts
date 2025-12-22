import z from "zod";

export const ResourceTypeSchema = z.object({
	type: z.enum(["own", "shared"]),
});
