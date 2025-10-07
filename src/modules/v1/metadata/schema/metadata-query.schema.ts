import z from "zod";

export const MetadataQuerySchema = z.object({
	url: z.url(),
});
