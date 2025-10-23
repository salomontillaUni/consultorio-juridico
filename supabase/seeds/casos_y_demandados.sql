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
((SELECT id FROM perfiles WHERE nombre_completo = 'Luis Hernandez'), 1, CURRENT_DATE);

INSERT INTO public.asesores_casos (id_asesor, id_caso, fecha_asignacion)
VALUES
((SELECT id FROM perfiles WHERE nombre_completo = 'Maria Gomez'), 1, CURRENT_DATE);
