INSERT INTO public.casos (
  id_usuario, resumen_hechos, observaciones, estado, aprobacion_asesor, area, tipo_proceso
)
VALUES
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Juan Pérez'),
 'El usuario fue despedido sin justa causa y busca conciliación laboral.',
 'Pendiente de documentos adicionales.', 'en_proceso', false, 'laboral', 'despido injustificado'),
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Luisa Gómez'),
 'Conflicto por cuota alimentaria con su expareja.', 'Esperando citación.', 'pendiente_aprobacion', false, 'familia', 'cuota alimentaria'),
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Pedro Torres'),
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
('10b0544f-b235-4c3b-987a-0f9b03b72a8c', 1, CURRENT_DATE),
('5b9c9f8f-b1eb-4491-b37c-aebbe1befe5d', 2, CURRENT_DATE);

INSERT INTO public.asesores_casos (id_asesor, id_caso, fecha_asignacion)
VALUES
('b6e6e7e9-35ef-4b3a-949f-6ffdd8d23d7b', 1, CURRENT_DATE),
('caa9b78b-d8b0-4260-8ee8-177c3c651f97', 2, CURRENT_DATE),
('caa9b78b-d8b0-4260-8ee8-177c3c651f97', 3, CURRENT_DATE);
