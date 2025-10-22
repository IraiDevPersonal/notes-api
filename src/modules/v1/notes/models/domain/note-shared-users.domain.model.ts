import type z from "zod";
import type { NoteSharedUsersSchema } from "../../utils/schemas/note-shared-users.schema";

export type NoteSharedUsersDomainModel = z.infer<typeof NoteSharedUsersSchema>;
