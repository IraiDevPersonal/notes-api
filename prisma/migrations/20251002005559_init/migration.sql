-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ', 'WRITE', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "last_modified_by_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "folder_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "last_modified_by_id" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_folders" (
    "id" SERIAL NOT NULL,
    "folder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "share_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_notes" (
    "id" SERIAL NOT NULL,
    "note_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "share_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "note_id" TEXT,
    "folder_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FolderToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FolderToNote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE INDEX "folders_owner_id_idx" ON "folders"("owner_id");

-- CreateIndex
CREATE INDEX "folders_parent_id_idx" ON "folders"("parent_id");

-- CreateIndex
CREATE INDEX "notes_owner_id_idx" ON "notes"("owner_id");

-- CreateIndex
CREATE INDEX "notes_folder_id_idx" ON "notes"("folder_id");

-- CreateIndex
CREATE INDEX "share_folders_folder_id_idx" ON "share_folders"("folder_id");

-- CreateIndex
CREATE INDEX "share_notes_note_id_idx" ON "share_notes"("note_id");

-- CreateIndex
CREATE INDEX "_FolderToNote_B_index" ON "_FolderToNote"("B");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_last_modified_by_id_fkey" FOREIGN KEY ("last_modified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_last_modified_by_id_fkey" FOREIGN KEY ("last_modified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_folders" ADD CONSTRAINT "share_folders_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_folders" ADD CONSTRAINT "share_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_notes" ADD CONSTRAINT "share_notes_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_notes" ADD CONSTRAINT "share_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderToNote" ADD CONSTRAINT "_FolderToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderToNote" ADD CONSTRAINT "_FolderToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
