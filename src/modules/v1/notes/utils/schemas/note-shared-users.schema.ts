import z from "zod";

export const NoteSharedUsersSchema = z.object({
	userIds: z.array(z.uuid()),
});
