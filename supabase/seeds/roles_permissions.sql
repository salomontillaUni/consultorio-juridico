-- ADMIN: todos los permisos
INSERT INTO public.role_permissions (role, permission)
SELECT 'admin', unnest(enum_range(NULL::public.app_permission));

-- PROFESIONAL DE APOYO: puede leer y crear casos y usuarios
INSERT INTO public.role_permissions (role, permission)
VALUES
('pro_apoyo', 'usuarios.create'),
('pro_apoyo', 'usuarios.read'),
('pro_apoyo', 'usuarios.update'),
('pro_apoyo', 'casos.create'),
('pro_apoyo', 'casos.read'),
('pro_apoyo', 'casos.update'),
('pro_apoyo', 'estudiantes.read'),
('pro_apoyo', 'asesores.read'),
('pro_apoyo', 'demandados.read');

-- 🔹 ESTUDIANTE: puede leer casos asignados y actualizar observaciones
INSERT INTO public.role_permissions (role, permission)
VALUES
('estudiante', 'casos.read'),
('estudiante', 'casos.update'),
('estudiante', 'usuarios.read'),
('estudiante', 'demandados.read'),
('estudiante', 'estudiantes.read');

-- 🔹 ASESOR: puede aprobar casos, leer, actualizar y cerrar
INSERT INTO public.role_permissions (role, permission)
VALUES
('asesor', 'casos.read'),
('asesor', 'casos.update'),
('asesor', 'casos.delete'),
('asesor', 'usuarios.read'),
('asesor', 'asesores.read');

-- Ejemplo de asignaciones:
INSERT INTO public.perfiles_roles (user_id, role)
VALUES
-- Admin (Elody)
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Elody Trantow'), 'admin'),

-- Estudiante (Stacey)
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Stacey Harris'), 'estudiante'),

-- Asesor (Betsy)
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Betsy Prohaska'), 'asesor'),

-- Asesor (Hertha)
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Hertha Turcotte'), 'asesor'),

-- Profesional de apoyo (Alessandra)
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Alessandra Waelchi'), 'pro_apoyo');

