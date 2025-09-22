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
-- Nota: Las contraseñas están hasheadas con bcrypt (password123)
INSERT INTO "User" (id, email, "userName", name, "lastName", password, avatar, "createdAt", "updatedAt") VALUES
('user_juan_001', 'juan@example.com', 'juanperez', 'Juan', 'Pérez', '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW(), NOW()),
('user_maria_002', 'maria@example.com', 'mariagarcia', 'María', 'García', '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO', 'https://images.unsplash.com/photo-1494790108755-2616b612b105?w=150&h=150&fit=crop&crop=face', NOW(), NOW()),
('user_carlos_003', 'carlos@example.com', 'carlosrodriguez', 'Carlos', 'Rodríguez', '$2b$10$rOzJT1.KVXf1p8qKpGGHMeYvp2YnE8.mF3JY9HJx.Zc5vJ8Hb2cMO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NOW(), NOW());

-- 2. Insertar tags
INSERT INTO "Tag" (id, name, color, "createdAt", "updatedAt") VALUES
('tag_trabajo_001', 'Trabajo', '#3b82f6', NOW(), NOW()),
('tag_personal_002', 'Personal', '#10b981', NOW(), NOW()),
('tag_ideas_003', 'Ideas', '#f59e0b', NOW(), NOW()),
('tag_urgente_004', 'Urgente', '#ef4444', NOW(), NOW()),
('tag_proyecto_005', 'Proyecto', '#8b5cf6', NOW(), NOW());

-- 3. Insertar carpetas
INSERT INTO "Folder" (id, name, "parentId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Carpetas principales de Juan
('folder_proyectos_001', 'Proyectos de Trabajo', NULL, 'user_juan_001', 1, NOW(), NOW()),
('folder_personal_002', 'Notas Personales', NULL, 'user_juan_001', 2, NOW(), NOW()),
-- Carpeta de María
('folder_investigacion_003', 'Investigación', NULL, 'user_maria_002', 1, NOW(), NOW()),
-- Subcarpeta de Proyectos de Trabajo
('folder_frontend_004', 'Frontend', 'folder_proyectos_001', 'user_juan_001', 1, NOW(), NOW());

-- 4. Insertar notas
INSERT INTO "Note" (id, title, content, "folderId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Notas de Juan
('note_tareas_001', 'Lista de tareas del proyecto', E'# Lista de tareas\n\n- [ ] Configurar el entorno de desarrollo\n- [ ] Crear mockups iniciales\n- [x] Revisar requerimientos\n- [ ] Planificar sprints\n\n## Prioridades\n1. Setup inicial\n2. Diseño de base de datos\n3. API endpoints\n4. Frontend básico', 'folder_proyectos_001', 'user_juan_001', 1, NOW(), NOW()),

('note_ui_ideas_002', 'Ideas para la interfaz de usuario', E'## Conceptos de UI/UX\n\n**Colores principales:**\n- Azul: #3b82f6\n- Verde: #10b981\n- Gris: #6b7280\n\n**Tipografía:**\n- Títulos: Inter Bold\n- Texto: Inter Regular\n\n**Componentes:**\n- Botones con border-radius: 8px\n- Shadows sutiles\n- Transiciones suaves (300ms)', 'folder_frontend_004', 'user_juan_001', 1, NOW(), NOW()),

('note_recetas_003', 'Recetas favoritas', E'# Mis recetas\n\n## Pasta Carbonara\n**Ingredientes:**\n- 400g pasta (spaghetti o fettuccine)\n- 200g panceta cortada en cubos\n- 4 huevos grandes\n- 100g queso parmesano rallado\n- Pimienta negra recién molida\n- Sal al gusto\n\n**Preparación:**\n1. Cocinar la pasta al dente\n2. Dorar la panceta\n3. Mezclar huevos con queso\n4. Combinar todo fuera del fuego', 'folder_personal_002', 'user_juan_001', 1, NOW(), NOW()),

-- Nota de María
('note_analisis_004', 'Análisis de mercado 2024', E'# Análisis de Mercado 2024\n\n## Tendencias principales:\n\n1. **Digitalización acelerada**\n   - Transformación digital empresarial\n   - Automatización de procesos\n   - IA aplicada a negocios\n\n2. **Sostenibilidad**\n   - Productos eco-friendly\n   - Economía circular\n   - Responsabilidad social\n\n3. **Experiencia del cliente**\n   - Personalización masiva\n   - Omnicanalidad\n   - Atención 24/7\n\n### Datos relevantes:\n- Crecimiento del e-commerce: 15%\n- Inversión en tecnología: +25%\n- Demanda de productos sostenibles: +40%', 'folder_investigacion_003', 'user_maria_002', 1, NOW(), NOW()),

-- Nota suelta de Carlos
('note_app_movil_005', 'Lluvia de ideas - App móvil', E'# Nueva App Móvil\n\n## Características principales:\n\n### Core Features\n- **Sincronización offline**: Trabajar sin conexión\n- **Interfaz minimalista**: Clean design, fácil de usar\n- **Notificaciones inteligentes**: Solo lo importante\n- **Colaboración en tiempo real**: Edición simultánea\n\n### Features adicionales\n- Dark mode\n- Búsqueda avanzada con filtros\n- Exportar a PDF/Word\n- Integraciones (Google Drive, Dropbox)\n- Voice-to-text\n\n## Target:\n- **Profesionales** 25-45 años\n- **Estudiantes** universitarios\n- **Creativos** que necesitan organización\n\n## Monetización:\n- Freemium model\n- Plan Pro: $9.99/mes\n- Plan Teams: $19.99/mes', NULL, 'user_carlos_003', 1, NOW(), NOW());

-- 5. Asociar tags con notas (tabla NoteTag)
INSERT INTO "NoteTag" ("noteId", "tagId") VALUES
-- Lista de tareas: Trabajo + Proyecto
('note_tareas_001', 'tag_trabajo_001'),
('note_tareas_001', 'tag_proyecto_005'),
-- Ideas UI: Trabajo + Ideas
('note_ui_ideas_002', 'tag_trabajo_001'),
('note_ui_ideas_002', 'tag_ideas_003'),
-- Recetas: Personal
('note_recetas_003', 'tag_personal_002'),
-- Análisis: Trabajo + Urgente
('note_analisis_004', 'tag_trabajo_001'),
('note_analisis_004', 'tag_urgente_004'),
-- App móvil: Ideas + Proyecto
('note_app_movil_005', 'tag_ideas_003'),
('note_app_movil_005', 'tag_proyecto_005');

-- 6. Crear shares (compartir contenido)
INSERT INTO "Share" (id, "userId", "sharedBy", "folderId", "noteId", permission, "createdAt") VALUES
-- Juan comparte su carpeta de trabajo con María (WRITE)
('share_001', 'user_maria_002', 'user_juan_001', 'folder_proyectos_001', NULL, 'WRITE', NOW()),
-- María comparte su análisis con Juan (READ)
('share_002', 'user_juan_001', 'user_maria_002', NULL, 'note_analisis_004', 'READ', NOW()),
-- Carlos comparte su idea con Juan (READ)
('share_003', 'user_juan_001', 'user_carlos_003', NULL, 'note_app_movil_005', 'READ', NOW()),
-- Carlos comparte su idea con María (READ)
('share_004', 'user_maria_002', 'user_carlos_003', NULL, 'note_app_movil_005', 'READ', NOW());

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