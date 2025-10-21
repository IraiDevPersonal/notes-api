import z from "zod";

export const FolderSharedUsersSchema = z.object({
	userIds: z.array(z.uuid()),
});
