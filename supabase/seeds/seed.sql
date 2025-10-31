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
('estudiante', 'casos_asignados.read'),
('estudiante', 'casos_asignados.update'),
('estudiante', 'usuarios.read'),
('estudiante', 'demandados.read'),
('estudiante', 'perfiles.read'),
('estudiante', 'asesores.read'),
('estudiante', 'estudiantes.read'),
('estudiante', 'estudiantes_casos.read'),
('estudiante', 'asesores_casos.read'),
('estudiante', 'estudiantes.read');

-- 🔹 ASESOR: puede aprobar casos, leer, actualizar y cerrar
INSERT INTO public.role_permissions (role, permission)
VALUES
('asesor', 'casos_asignados.read'),
('asesor', 'casos_asignados.update'),
('asesor', 'casos_asignados.delete'),
('asesor', 'demandados.read'),
('asesor', 'perfiles.read'),
('asesor', 'asesores.read'),
('asesor', 'estudiantes.read'),
('asesor', 'estudiantes_casos.read'),
('asesor', 'asesores_casos.read'),
('asesor', 'usuarios.read'),
('asesor', 'asesores.read');

-- Ejemplo de asignaciones:
INSERT INTO public.perfiles_roles (user_id, role)
VALUES
-- Admin (maria)
((SELECT id FROM perfiles WHERE correo = 'admin@ejemplo.com'), 'admin'),

-- Estudiante (Luis)
((SELECT id FROM perfiles WHERE correo = 'estudiante@ejemplo.com'), 'estudiante'),

-- Asesor (Maria Gomez)
((SELECT id FROM perfiles WHERE correo = 'asesor@ejemplo.com'), 'asesor'),

-- Asesor (Carlos Rodriguez)
((SELECT id FROM perfiles WHERE correo = 'proapoyo@ejemplo.com'), 'pro_apoyo');

-- ESTUDIANTES Y ASESORES
INSERT INTO public.estudiantes (id_perfil, semestre, jornada, turno)
VALUES
((SELECT id FROM perfiles WHERE correo = 'estudiante@ejemplo.com'), 8, 'diurna', '9-11');

INSERT INTO public.asesores (id_perfil, turno, area)
VALUES
((SELECT id FROM perfiles WHERE correo = 'asesor@ejemplo.com'), '4-6', 'laboral');

-- USUARIOS (solicitantes)

INSERT INTO public.usuarios (
  id_usuario, nombre_completo, sexo, cedula, telefono, edad, contacto_familiar,
  estado_civil, estrato, direccion, correo, tipo_vivienda,
  situacion_laboral, otros_ingresos, valor_otros_ingresos, concepto_otros_ingresos,
  tiene_contrato, tiene_representado
)
VALUES
(gen_random_uuid(), 'Juan Pérez', 'M', '10023456', '+573004567890', 35, 'María López', 'casado', 3,
 'Calle 10 #20-30', 'juan.perez@example.com', 'propia', 'dependiente', true, 500000, 'ventas ocasionales', true, false),
(gen_random_uuid(), 'Luisa Gómez', 'F', '10023457', '+573115678901', 28, 'Carlos Gómez', 'soltero', 2,
 'Cra 15 #25-40', 'luisa.gomez@example.com', 'arriendo', 'independiente', false, NULL, NULL, true, true),
(gen_random_uuid(), 'Pedro Torres', 'M', '10023458', '+573224567890', 40, 'Ana Torres', 'unión libre', 1,
 'Av 30 #50-60', 'pedro.torres@example.com', 'propia', 'desempleado', false, NULL, NULL, false, false);

-- CASOS 
INSERT INTO public.casos (
  id_caso, id_usuario, resumen_hechos, observaciones, estado, aprobacion_asesor, area, tipo_proceso
)
VALUES
(1, (SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Juan Pérez'),
 'El usuario fue despedido sin justa causa y busca conciliación laboral.',
 'Pendiente de documentos adicionales.', 'en_proceso', false, 'laboral', 'despido injustificado'),
(2,(SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Luisa Gómez'),
 'Conflicto por cuota alimentaria con su expareja.', 'Esperando citación.', 'pendiente_aprobacion', false, 'familia', 'cuota alimentaria'),
(3, (SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Pedro Torres'),
 'Demanda civil por incumplimiento de contrato.', 'Caso revisado por asesor.', 'aprobado', true, 'civil', 'incumplimiento de contrato');

-- DEMANDADOS

INSERT INTO public.demandados (id_caso, nombre_completo, documento, celular, lugar_residencia, correo)
VALUES
(1, 'Empresa XYZ S.A.', '900123456', '+573214567890', 'Bogotá', 'contacto@xyz.com'),
(2, 'José Rodríguez', '1012345678', '+573334567890', 'Medellín', 'jose.rodriguez@example.com'),
(3, 'Compañía ABC Ltda.', '800987654', '+573114567890', 'Cali', 'info@abc.com');

-- RELACIONES: ESTUDIANTES_CASOS y ASESORES_CASOS

INSERT INTO public.estudiantes_casos (id_estudiante, id_caso, fecha_asignacion)
VALUES
((SELECT id FROM perfiles WHERE correo = 'estudiante@ejemplo.com'), 1, CURRENT_DATE);

INSERT INTO public.asesores_casos (id_asesor, id_caso, fecha_asignacion)
VALUES
((SELECT id FROM perfiles WHERE correo = 'asesor@ejemplo.com'), 1, CURRENT_DATE);

-- CONTRATOS LABORALES
INSERT INTO public.contratos_laborales (
  id_usuario, tipo_contrato, representante_legal, correo_patrono,
  direccion_empresa, fecha_inicio, fecha_fin, continua, salario_inicial, salario_actual
)
VALUES
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Juan Pérez'),
 'escrito', 'Carlos Mendoza', 'empresa@ejemplo.com', 'Calle 123 #45-67', '2023-01-10', NULL, true, 2500000, 3000000);