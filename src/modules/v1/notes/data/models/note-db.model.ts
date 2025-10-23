import type { Prisma } from "@prisma/client";
import type { NOTE_QUERY_SELECTOR } from "../selectors/note.selector";

export type NoteDbModel = Prisma.NoteGetPayload<{
	select: typeof NOTE_QUERY_SELECTOR;
}>;
