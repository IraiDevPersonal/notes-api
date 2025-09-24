import type { Prisma } from "@prisma/client";
import type { NOTE_SELECTOR } from "../../utils/constants";

export type DbNote = Prisma.NoteGetPayload<{
	select: typeof NOTE_SELECTOR;
}>;
