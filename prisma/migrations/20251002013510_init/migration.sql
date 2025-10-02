/*
  Warnings:

  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the `_FolderToNote` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[folder_id,user_id]` on the table `share_folders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[note_id,user_id]` on the table `share_notes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_FolderToNote" DROP CONSTRAINT "_FolderToNote_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FolderToNote" DROP CONSTRAINT "_FolderToNote_B_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."_FolderToNote";

-- CreateIndex
CREATE INDEX "comments_note_id_idx" ON "comments"("note_id");

-- CreateIndex
CREATE INDEX "comments_folder_id_idx" ON "comments"("folder_id");

-- CreateIndex
CREATE INDEX "share_folders_user_id_idx" ON "share_folders"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "share_folders_folder_id_user_id_key" ON "share_folders"("folder_id", "user_id");

-- CreateIndex
CREATE INDEX "share_notes_user_id_idx" ON "share_notes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "share_notes_note_id_user_id_key" ON "share_notes"("note_id", "user_id");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
