import type { Prisma } from "@prisma/client";
import type { NOTE_QUERY_SELECTOR } from "../../utils/query-selectors/note.query-selector";

export type NoteDbModel = Prisma.NoteGetPayload<{
	select: typeof NOTE_QUERY_SELECTOR;
}>;
