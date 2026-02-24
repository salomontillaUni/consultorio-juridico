-- ADMIN: todos los permisos
INSERT INTO public.role_permissions (role, permission)
SELECT 'admin', unnest(enum_range(NULL::public.app_permission));

-- PROFESIONAL DE APOYO: puede leer y crear casos y usuarios
INSERT INTO public.role_permissions (role, permission)
VALUES
('pro_apoyo', 'usuarios.create'),
('pro_apoyo', 'usuarios.read'),
('pro_apoyo', 'usuarios.update'),
('pro_apoyo', 'perfiles.read'),
('pro_apoyo', 'perfiles.update'),
('pro_apoyo', 'casos.create'),
('pro_apoyo', 'casos.read'),
('pro_apoyo', 'casos.update'),
('pro_apoyo', 'estudiantes.read'),
('pro_apoyo', 'estudiantes.update'),
('pro_apoyo', 'estudiantes_casos.read'),
('pro_apoyo', 'estudiantes_casos.update'),
('pro_apoyo', 'estudiantes_casos.delete'),
('pro_apoyo', 'estudiantes_casos.create'),
('pro_apoyo', 'asesores.read'),
('pro_apoyo', 'asesores.update'),
('pro_apoyo', 'asesores_casos.create'),
('pro_apoyo', 'asesores_casos.read'),
('pro_apoyo', 'asesores_casos.update'),
('pro_apoyo', 'asesores_casos.delete'),
('pro_apoyo', 'demandados.read'),
('pro_apoyo', 'demandados.create'),
('pro_apoyo', 'demandados.update');

-- 🔹 ESTUDIANTE: puede leer casos asignados y actualizar observaciones
INSERT INTO public.role_permissions (role, permission)
VALUES
('estudiante', 'usuarios.read'),
('estudiante', 'usuarios.update'),
('estudiante', 'demandados.read'),
('estudiante', 'demandados.update'),
('estudiante', 'demandados.create'),
('estudiante', 'contratos_laborales.create'),
('estudiante', 'perfiles.read'),
('estudiante', 'asesores.read'),
('estudiante', 'estudiantes_casos.read'),
('estudiante', 'asesores_casos.read');

-- 🔹 ASESOR: puede aprobar casos, leer, actualizar y cerrar
INSERT INTO public.role_permissions (role, permission)
VALUES
('asesor', 'demandados.read'),
('asesor', 'perfiles.read'),
('asesor', 'estudiantes.read'),
('asesor', 'estudiantes_casos.read'),
('asesor', 'asesores_casos.read'),
('asesor', 'usuarios.read');