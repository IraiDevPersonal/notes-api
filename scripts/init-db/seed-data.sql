-- Script de inicialización para base de datos de notas
-- Este archivo debe colocarse en /docker-entrypoint-initdb.d/ en el contenedor de PostgreSQL
-- Actualizado para el esquema de Prisma actual

-- Configurar encoding al inicio
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Comment') THEN
        DELETE FROM "Comment";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ShareNote') THEN
        DELETE FROM "ShareNote";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ShareFolder') THEN
        DELETE FROM "ShareFolder";
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Comment') THEN
        DELETE FROM "Comment";
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

-- 2. Insertar tags (usando INT como en tu esquema)
INSERT INTO "Tag" (name, color, "createdAt", "updatedAt") VALUES
('Trabajo', '#3b82f6', NOW(), NOW()),
('Personal', '#10b981', NOW(), NOW()),
('Ideas', '#f59e0b', NOW(), NOW()),
('Urgente', '#ef4444', NOW(), NOW()),
('Proyecto', '#8b5cf6', NOW(), NOW());

-- 3. Insertar carpetas
INSERT INTO "Folder" (id, name, description, "parentId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Carpetas principales de Juan
('66666666-6666-6666-6666-666666666666', 'Proyectos de Trabajo', 'Carpeta para organizar todos los proyectos laborales', NULL, '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Notas Personales', 'Espacio para notas y recordatorios personales', NULL, '550e8400-e29b-41d4-a716-446655440000', 2, NOW(), NOW()),
-- Carpeta de María
('88888888-8888-8888-8888-888888888888', 'Investigación', 'Documentos y análisis de investigación', NULL, '550e8400-e29b-41d4-a716-446655440001', 1, NOW(), NOW()),
-- Subcarpeta de Proyectos de Trabajo (ejemplo de anidamiento)
('99999999-9999-9999-9999-999999999999', 'Frontend', 'Proyectos relacionados con desarrollo frontend', '66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),
-- Subcarpeta de subcarpeta (ejemplo de anidamiento profundo)
('aaaaaaaa-1111-1111-1111-111111111111', 'React Components', 'Componentes reutilizables de React', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW());

-- 4. Insertar notas
INSERT INTO "Note" (id, title, content, "folderId", "ownerId", "order", "createdAt", "updatedAt") VALUES
-- Notas de Juan en carpetas
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lista de tareas del proyecto', E'# Lista de tareas\n\n- [ ] Configurar el entorno de desarrollo\n- [ ] Crear mockups iniciales\n- [x] Revisar requerimientos\n- [ ] Planificar sprints\n\n## Prioridades\n1. Setup inicial\n2. Diseño de base de datos\n3. API endpoints\n4. Frontend básico', '66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ideas para la interfaz de usuario', E'## Conceptos de UI/UX\n\n**Colores principales:**\n- Azul: #3b82f6\n- Verde: #10b981\n- Gris: #6b7280\n\n**Tipografía:**\n- Títulos: Inter Bold\n- Texto: Inter Regular\n\n**Componentes:**\n- Botones con border-radius: 8px\n- Shadows sutiles\n- Transiciones suaves (300ms)', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Recetas favoritas', E'# Mis recetas\n\n## Pasta Carbonara\n**Ingredientes:**\n- 400g pasta (spaghetti o fettuccine)\n- 200g panceta cortada en cubos\n- 4 huevos grandes\n- 100g queso parmesano rallado\n- Pimienta negra recién molida\n- Sal al gusto\n\n**Preparación:**\n1. Cocinar la pasta al dente\n2. Dorar la panceta\n3. Mezclar huevos con queso\n4. Combinar todo fuera del fuego', '77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

-- Nota en subcarpeta anidada
('ffffff11-1111-1111-1111-111111111111', 'Button Component', E'# Button Component\n\n```jsx\nimport React from "react";\n\nconst Button = ({ children, variant = "primary", size = "md", ...props }) => {\n  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";\n  const variants = {\n    primary: "bg-blue-600 text-white hover:bg-blue-700",\n    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"\n  };\n  \n  return (\n    <button className={`${baseClasses} ${variants[variant]}`} {...props}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;\n```', 'aaaaaaaa-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW()),

-- Nota de María
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Análisis de mercado 2024', E'# Análisis de Mercado 2024\n\n## Tendencias principales:\n\n1. **Digitalización acelerada**\n   - Transformación digital empresarial\n   - Automatización de procesos\n   - IA aplicada a negocios\n\n2. **Sostenibilidad**\n   - Productos eco-friendly\n   - Economía circular\n   - Responsabilidad social\n\n3. **Experiencia del cliente**\n   - Personalización masiva\n   - Omnicanalidad\n   - Atención 24/7\n\n### Datos relevantes:\n- Crecimiento del e-commerce: 15%\n- Inversión en tecnología: +25%\n- Demanda de productos sostenibles: +40%', '88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440001', 1, NOW(), NOW()),

-- Nota suelta de Carlos (sin carpeta - folderId es NULL)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Lluvia de ideas - App móvil', E'# Nueva App Móvil\n\n## Características principales\n\n### Core Features\n- **Sincronización offline**: Trabajar sin conexión\n- **Interfaz minimalista**: Clean design, fácil de usar\n- **Notificaciones inteligentes**: Solo lo importante\n- **Colaboración en tiempo real**: Edición simultánea\n\n### Features adicionales\n- Dark mode\n- Búsqueda avanzada con filtros\n- Exportar a PDF/Word\n- Integraciones (Google Drive, Dropbox)\n- Voice-to-text\n\n## Target:\n- **Profesionales** 25-45 años\n- **Estudiantes** universitarios\n- **Creativos** que necesitan organización\n\n## Monetización:\n- Freemium model\n- Plan Pro: $9.99/mes\n- Plan Teams: $19.99/mes', NULL, '550e8400-e29b-41d4-a716-446655440002', 1, NOW(), NOW()),

-- Nota suelta de Juan (ejemplo adicional sin carpeta)
('ffffff22-2222-2222-2222-222222222222', 'Ideas rápidas', E'# Ideas sueltas\n\n- Implementar dark mode en la app\n- Probar nueva librería de animaciones\n- Revisar feedback de usuarios\n- Planificar próxima release\n\n**Recordatorio:** Llamar al cliente mañana a las 10:00 AM', NULL, '550e8400-e29b-41d4-a716-446655440000', 1, NOW(), NOW());

-- 5. Asociar tags con notas (tabla NoteTag)
INSERT INTO "NoteTag" ("noteId", "tagId") VALUES
-- Lista de tareas: Trabajo + Proyecto
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5),
-- Ideas UI: Trabajo + Ideas
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3),
-- Button Component: Trabajo + Proyecto
('ffffff11-1111-1111-1111-111111111111', 1),
('ffffff11-1111-1111-1111-111111111111', 5),
-- Recetas: Personal
('cccccccc-cccc-cccc-cccc-cccccccccccc', 2),
-- Análisis: Trabajo + Urgente
('dddddddd-dddd-dddd-dddd-dddddddddddd', 1),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 4),
-- App móvil: Ideas + Proyecto
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 3),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5),
-- Ideas rápidas: Trabajo
('ffffff22-2222-2222-2222-222222222222', 1);

-- 6. Crear ShareFolder (compartir carpetas)
INSERT INTO "ShareFolder" ("folderId", "userId", permission) VALUES
-- Juan comparte su carpeta de trabajo con María (WRITE)
('66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440001', 'WRITE'),
-- Juan comparte su carpeta personal con Carlos (READ)
('77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440002', 'READ'),
-- María comparte su carpeta de investigación con Juan (READ)
('88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440000', 'READ');

-- 7. Crear ShareNote (compartir notas)
INSERT INTO "ShareNote" ("noteId", "userId", permission) VALUES
-- María comparte su análisis con Juan (READ)
('dddddddd-dddd-dddd-dddd-dddddddddddd', '550e8400-e29b-41d4-a716-446655440000', 'READ'),
-- Carlos comparte su idea con Juan (READ)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '550e8400-e29b-41d4-a716-446655440000', 'READ'),
-- Carlos comparte su idea con María (WRITE)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '550e8400-e29b-41d4-a716-446655440001', 'WRITE'),
-- Juan comparte su componente con María (READ)
('ffffff11-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440001', 'READ');

-- 8. Crear comentarios de ejemplo
INSERT INTO "Comment" (title, description, "userId", "noteId", "folderId", "createdAt", "updatedAt") VALUES
-- Comentarios en notas
('Muy útil', 'Esta lista está muy completa, me ayuda mucho para organizar el proyecto', '550e8400-e29b-41d4-a716-446655440001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, NOW(), NOW()),
('Sugerencia', 'Podrías agregar validación de props con PropTypes o TypeScript', '550e8400-e29b-41d4-a716-446655440001', 'ffffff11-1111-1111-1111-111111111111', NULL, NOW(), NOW()),
('Excelente análisis', 'Los datos están muy actualizados, me servirá para mi presentación', '550e8400-e29b-41d4-a716-446655440000', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, NOW(), NOW()),

-- Comentarios en carpetas
('Organización', 'Esta carpeta está muy bien estructurada, fácil de navegar', '550e8400-e29b-41d4-a716-446655440001', NULL, '66666666-6666-6666-6666-666666666666', NOW(), NOW()),
('Acceso', 'Gracias por compartir esta carpeta, tiene información muy valiosa', '550e8400-e29b-41d4-a716-446655440000', NULL, '88888888-8888-8888-8888-888888888888', NOW(), NOW());

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos inicializada correctamente con datos de prueba';
    RAISE NOTICE '👤 Usuarios creados:';
    RAISE NOTICE '   📧 juan@example.com | 🔑 password123';
    RAISE NOTICE '   📧 maria@example.com | 🔑 password123';
    RAISE NOTICE '   📧 carlos@example.com | 🔑 password123';
    RAISE NOTICE '📊 Datos insertados:';
    RAISE NOTICE '   👥 3 usuarios | 📁 5 carpetas (con anidamiento) | 📝 7 notas | 🏷️ 5 tags | 🤝 7 shares | 💬 5 comentarios';
    RAISE NOTICE '🔗 Ejemplos de funcionalidades:';
    RAISE NOTICE '   📂 Carpetas anidadas: Proyectos > Frontend > React Components';
    RAISE NOTICE '   📄 Notas sueltas: 2 notas sin carpeta';
    RAISE NOTICE '   🤝 Sistema de compartir: carpetas y notas compartidas entre usuarios';
    RAISE NOTICE '   💬 Comentarios: en notas y carpetas';
END $$;