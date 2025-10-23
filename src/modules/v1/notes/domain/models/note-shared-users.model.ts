import type z from "zod";
import type { NoteSharedUsersSchema } from "../schemas/note-shared-users.schema";

export type NoteSharedUsersModel = z.infer<typeof NoteSharedUsersSchema>;
