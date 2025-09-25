-- Script SQL para insertar solo 2 usuarios
-- Las demás tablas quedan vacías
-- Basado en el esquema de Prisma actualizado

-- Configurar encoding al inicio
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Limpiar datos existentes (en orden inverso debido a las foreign keys)
DO $$
BEGIN
    -- Limpiar tablas con foreign keys primero
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
        DELETE FROM "comments";
        RAISE NOTICE 'Tabla comments limpiada';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'share_notes') THEN
        DELETE FROM "share_notes";
        RAISE NOTICE 'Tabla share_notes limpiada';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'share_folders') THEN
        DELETE FROM "share_folders";
        RAISE NOTICE 'Tabla share_folders limpiada';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notes') THEN
        DELETE FROM "notes";
        RAISE NOTICE 'Tabla notes limpiada';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'folders') THEN
        DELETE FROM "folders";
        RAISE NOTICE 'Tabla folders limpiada';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        DELETE FROM "users";
        RAISE NOTICE 'Tabla users limpiada';
    END IF;
END $$;

-- Insertar solo 2 usuarios
INSERT INTO "users" (
    "id",
    "email",
    "user_name",
    "name",
    "last_name",
    "password",
    "avatar",
    "created_at",
    "updated_at"
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@example.com',
    'admin',
    'Administrador',
    'Sistema',
    '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO', -- password: password123
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'user@example.com',
    'testuser',
    'Usuario',
    'Prueba',
    '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO', -- password: password123
    'https://images.unsplash.com/photo-1494790108755-2616b612b105?w=150&h=150&fit=crop&crop=face',
    NOW(),
    NOW()
);

-- Mensaje de confirmación
DO $$
DECLARE
    user_count INTEGER;
    folder_count INTEGER;
    note_count INTEGER;
    share_folder_count INTEGER;
    share_note_count INTEGER;
    comment_count INTEGER;
BEGIN
    -- Contar registros en cada tabla
    SELECT COUNT(*) INTO user_count FROM "users";
    SELECT COUNT(*) INTO folder_count FROM "folders";
    SELECT COUNT(*) INTO note_count FROM "notes";
    SELECT COUNT(*) INTO share_folder_count FROM "share_folders";
    SELECT COUNT(*) INTO share_note_count FROM "share_notes";
    SELECT COUNT(*) INTO comment_count FROM "comments";

    RAISE NOTICE '✅ Base de datos inicializada correctamente';
    RAISE NOTICE '👤 Usuarios creados: %', user_count;
    RAISE NOTICE '   📧 admin@example.com | 👤 admin | 🔑 password123';
    RAISE NOTICE '   📧 user@example.com | 👤 testuser | 🔑 password123';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Estado de las demás tablas:';
    RAISE NOTICE '   📁 Carpetas: % (vacía)', folder_count;
    RAISE NOTICE '   📝 Notas: % (vacía)', note_count;
    RAISE NOTICE '   🤝 Carpetas compartidas: % (vacía)', share_folder_count;
    RAISE NOTICE '   🤝 Notas compartidas: % (vacía)', share_note_count;
    RAISE NOTICE '   💬 Comentarios: % (vacía)', comment_count;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Listo para comenzar a trabajar!';
END $$;