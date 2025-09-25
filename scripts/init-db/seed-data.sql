-- Script SQL para crear la estructura completa de la base de datos
-- Basado en el esquema de Prisma actualizado

-- Configurar encoding al inicio
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Eliminar tablas existentes (en orden inverso debido a las foreign keys)
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "share_notes" CASCADE;
DROP TABLE IF EXISTS "share_folders" CASCADE;
DROP TABLE IF EXISTS "notes" CASCADE;
DROP TABLE IF EXISTS "folders" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Eliminar tipos enum si existen
DROP TYPE IF EXISTS "Permission" CASCADE;

-- Crear tipo enum para permisos
CREATE TYPE "Permission" AS ENUM ('READ', 'WRITE', 'OWNER');

-- Crear tabla users (nombres actualizados según el esquema)
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT UNIQUE NOT NULL,
    "user_name" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3)
);

-- Crear tabla folders
CREATE TABLE "folders" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "last_modified_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "folders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "folders_last_modified_by_id_fkey" FOREIGN KEY ("last_modified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Crear tabla notes
CREATE TABLE "notes" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "folder_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "last_modified_by_id" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "notes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_last_modified_by_id_fkey" FOREIGN KEY ("last_modified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notes_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Crear tabla share_folders
CREATE TABLE "share_folders" (
    "id" SERIAL PRIMARY KEY,
    "folder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,
    CONSTRAINT "share_folders_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "share_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear tabla share_notes
CREATE TABLE "share_notes" (
    "id" SERIAL PRIMARY KEY,
    "note_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,
    CONSTRAINT "share_notes_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "share_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear tabla comments
CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "note_id" TEXT,
    "folder_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear índices según el esquema de Prisma
CREATE INDEX "folders_owner_id_idx" ON "folders"("owner_id");
CREATE INDEX "folders_parent_id_idx" ON "folders"("parent_id");
CREATE INDEX "notes_owner_id_idx" ON "notes"("owner_id");
CREATE INDEX "notes_folder_id_idx" ON "notes"("folder_id");
CREATE INDEX "share_folders_folder_id_idx" ON "share_folders"("folder_id");
CREATE INDEX "share_notes_note_id_idx" ON "share_notes"("note_id");

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updated_at en las tablas que lo necesiten
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON "folders"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON "notes"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON "comments"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Estructura de base de datos creada correctamente';
    RAISE NOTICE '📊 Tablas creadas:';
    RAISE NOTICE '   - users (con snake_case según Prisma)';
    RAISE NOTICE '   - folders (con relaciones owner y last_modified_by)';
    RAISE NOTICE '   - notes (con relaciones owner, folder y last_modified_by)';
    RAISE NOTICE '   - share_folders (para compartir carpetas)';
    RAISE NOTICE '   - share_notes (para compartir notas)';
    RAISE NOTICE '   - comments (para comentarios en notas y carpetas)';
    RAISE NOTICE '🔧 Índices y triggers configurados correctamente';
END $$;