-- Script de inicialización para base de datos de notas
-- Este archivo debe colocarse en /docker-entrypoint-initdb.d/ en el contenedor de PostgreSQL

-- Limpiar datos existentes (solo si las tablas existen)

-- Configurar encoding al inicio
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

DO $$
BEGIN
    -- Verificar si las tablas existen antes de limpiar
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'NoteTag') THEN
        DELETE FROM "NoteTag";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Share') THEN
        DELETE FROM "Share";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Note') THEN
        DELETE FROM "Note";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Tag') THEN
        DELETE FROM "Tag";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Folder') THEN
        DELETE FROM "Folder";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User') THEN
        DELETE FROM "User";
    END IF;
END $$;

-- 1. Insertar usuarios
INSERT INTO "User" (id, email, "userName", name, "lastName", password, avatar, "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440000', 'juan@example.com', 'juanperez', 'Juan', 'Pérez',
 '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'maria@example.com', 'mariagarcia', 'María', 'García',
 '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO',
 'https://images.unsplash.com/photo-1494790108755-2616b612b105?w=150&h=150&fit=crop&crop=face', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'carlos@example.com', 'carlosrodriguez', 'Carlos', 'Rodríguez',
 '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NOW(), NOW());

-- 2. Insertar tags
INSERT INTO "Tag" (id, name, color, "createdAt", "updatedAt") VALUES
('11111111-1111-1111-1111-111111111111', 'Trabajo', '#3b82f6', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Personal', '#10b981', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Ideas', '#f59e0b', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Urgente', '#ef4444', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Proyecto', '#8b5cf6', NOW(), NOW());

-- 3. Insertar carpetas
INSERT INTO "Folder" (id, name, "parentId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Carpetas principales de Juan
('66666666-6666-6666-6666-666666666666', 'Proyectos de Trabajo', NULL, '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Notas Personales', NULL, '550e8400-e29b-41d4-a716-446655440000', 2, NOW(), NOW()),
-- Carpeta de María
('88888888-8888-8888-8888-888888888888', 'Investigación', NULL, '550e8400-e29b-41d4-a716-446655440001', 1, NOW(), NOW()),
-- Subcarpeta de Proyectos de Trabajo
('99999999-9999-9999-9999-999999999999', 'Frontend', '66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW());

-- 4. Insertar notas
INSERT INTO "Note" (id, title, content, "folderId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Notas de Juan
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lista de tareas del proyecto', E'# Lista de tareas\n\n- [ ] Configurar el entorno de desarrollo\n- [ ] Crear mockups iniciales\n- [x] Revisar requerimientos\n- [ ] Planificar sprints\n\n## Prioridades\n1. Setup inicial\n2. Diseño de base de datos\n3. API endpoints\n4. Frontend básico', '66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ideas para la interfaz de usuario', E'## Conceptos de UI/UX\n\n**Colores principales:**\n- Azul: #3b82f6\n- Verde: #10b981\n- Gris: #6b7280\n\n**Tipografía:**\n- Títulos: Inter Bold\n- Texto: Inter Regular\n\n**Componentes:**\n- Botones con border-radius: 8px\n- Shadows sutiles\n- Transiciones suaves (300ms)', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Recetas favoritas', E'# Mis recetas\n\n## Pasta Carbonara\n**Ingredientes:**\n- 400g pasta (spaghetti o fettuccine)\n- 200g panceta cortada en cubos\n- 4 huevos grandes\n- 100g queso parmesano rallado\n- Pimienta negra recién molida\n- Sal al gusto\n\n**Preparación:**\n1. Cocinar la pasta al dente\n2. Dorar la panceta\n3. Mezclar huevos con queso\n4. Combinar todo fuera del fuego', '77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

-- Nota de María
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Análisis de mercado 2024', E'# Análisis de Mercado 2024\n\n## Tendencias principales:\n\n1. **Digitalización acelerada**\n   - Transformación digital empresarial\n   - Automatización de procesos\n   - IA aplicada a negocios\n\n2. **Sostenibilidad**\n   - Productos eco-friendly\n   - Economía circular\n   - Responsabilidad social\n\n3. **Experiencia del cliente**\n   - Personalización masiva\n   - Omnicanalidad\n   - Atención 24/7\n\n### Datos relevantes:\n- Crecimiento del e-commerce: 15%\n- Inversión en tecnología: +25%\n- Demanda de productos sostenibles: +40%', '88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440001', 1, NOW(), NOW()),

-- Nota suelta de Carlos
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Lluvia de ideas - App móvil', E'# Nueva App Móvil\n\n## Características principales\n\n### Core Features\n- **Sincronización offline**: Trabajar sin conexión\n- **Interfaz minimalista**: Clean design, fácil de usar\n- **Notificaciones inteligentes**: Solo lo importante\n- **Colaboración en tiempo real**: Edición simultánea\n\n### Features adicionales\n- Dark mode\n- Búsqueda avanzada con filtros\n- Exportar a PDF/Word\n- Integraciones (Google Drive, Dropbox)\n- Voice-to-text\n\n## Target:\n- **Profesionales** 25-45 años\n- **Estudiantes** universitarios\n- **Creativos** que necesitan organización\n\n## Monetización:\n- Freemium model\n- Plan Pro: $9.99/mes\n- Plan Teams: $19.99/mes', NULL, '550e8400-e29b-41d4-a716-446655440002', 1, NOW(), NOW());

-- 5. Asociar tags con notas (tabla NoteTag)
INSERT INTO "NoteTag" ("noteId", "tagId") VALUES
-- Lista de tareas: Trabajo + Proyecto
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
-- Ideas UI: Trabajo + Ideas
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
-- Recetas: Personal
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222'),
-- Análisis: Trabajo + Urgente
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444'),
-- App móvil: Ideas + Proyecto
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555');

-- 6. Crear shares (compartir contenido)
INSERT INTO "Share" (id, "userId", "sharedBy", "folderId", "noteId", permission, "createdAt") VALUES
-- Juan comparte su carpeta de trabajo con María (WRITE)
('f1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '66666666-6666-6666-6666-666666666666', NULL, 'WRITE', NOW()),
-- María comparte su análisis con Juan (READ)
('f2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'READ', NOW()),
-- Carlos comparte su idea con Juan (READ)
('f3333333-cccc-cccc-cccc-cccccccccccc', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'READ', NOW()),
-- Carlos comparte su idea con María (READ)
('f4444444-dddd-dddd-dddd-dddddddddddd', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'READ', NOW());

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos inicializada correctamente con datos de prueba';
    RAISE NOTICE '👤 Usuarios creados:';
    RAISE NOTICE '   📧 juan@example.com | 🔑 password123';
    RAISE NOTICE '   📧 maria@example.com | 🔑 password123';
    RAISE NOTICE '   📧 carlos@example.com | 🔑 password123';
    RAISE NOTICE '📊 Datos insertados:';
    RAISE NOTICE '   👥 3 usuarios | 📁 4 carpetas | 📝 5 notas | 🏷️ 5 tags | 🤝 4 shares';
END $$;
