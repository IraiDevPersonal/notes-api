-- AlterTable
ALTER TABLE "public"."folders" ADD COLUMN     "is_pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."notes" ADD COLUMN     "is_pinned" BOOLEAN NOT NULL DEFAULT false;
